import { MarkdownTableContent } from "../impls/MarkdownTableContent";
import { setAppContext } from "./AppContext"
import { StringCounter } from "../StringCounter";
import { AutoFormatter } from "./AutoFormatter";
import { TableCacheManager } from "./TableCacheManager";
import { CacheUpdater } from "./CacheUpdater";
import { TableObserver } from "./TableObserver";
import { AppHelper } from "./AppHelper";
import { IAppContext } from "../interfaces/IAppContext";
import { ITextEventReciever, ITextChanged, ISelectChanged } from "../interfaces/ITextEventReciever";
import { ICommand, IFormatterContext, ITextReplacer } from "../interfaces";
import DefaultCommandItems from "./DefaultCommandItems";
import { DefaultFormatterContext } from "./DefaultFormatterContext";
import { DefaultCommandFactory } from "./DefaultCommandFactory";
import { MarkdownTableRenderMode } from "../impls/MarkdownTableConverter";


export abstract class AppMain<TInitParam>
{
	protected readonly appContext: IAppContext;
	protected readonly appHelper: AppHelper;
	protected readonly cache: TableCacheManager;
	protected readonly reciever: MultiEventRecievers;

	protected readonly switcher: Switcher;
	private readonly commands: Map<string, ICommand>;
	private enableCommandNames: string[] = [];


	public getCommands(): Map<string, ICommand>
	{
		return this.commands;
	}

	public getCommandNames()
	{
		return DefaultCommandItems;
	}

	public getEnabledCommandNames()
	{
		return this.enableCommandNames;
	}


	public constructor(protected readonly initParam: TInitParam)
	{
		this.appContext = this.createAppContext();
		this.appHelper = new AppHelper(this.appContext);
		this.cache = new TableCacheManager(() => this.appHelper.getTable());
		this.cache.cacheItemUpdated.push((nv, ov) =>
		{
			this.onCurrentTableChanged(nv, ov);
		});

		this.reciever = this.createReciever(this.cache);
		this.commands = this.createCommands(this.appContext, this.cache);
		this.switcher = this.createSwitcher(this.reciever);
		this.registerTransmitter(this.reciever);


		// 文字数カウントの設定、仕様が定まらない・・・。
		StringCounter.counter = this.appContext.getStringCounter();

		// TODO: 設計上どうかと思うけど面倒だから仕方ない。
		setAppContext(this.appContext);

	}

	
	protected createSwitcher(eventReciever: MultiEventRecievers)
	{
		return new Switcher(eventReciever, this.appContext);
	}

	protected createReciever(cache: TableCacheManager)
	{
		const formatterContext = this.createFormatterContext(this.appContext);
		const reciever = new MultiEventRecievers();
		reciever.recievers.push(new AutoFormatter(this.appContext, cache, () => this.onFormatRequest(), () => formatterContext));
		reciever.recievers.push(new CacheUpdater(cache));
		reciever.recievers.push(new TableObserver(this.appContext, tables => this.onTableUpdated(tables)));	
		return reciever;	
	}

	/**
	 * @param nv 
	 * @param ov 
	 * 
	 * テーブルに変更があった場合呼び出されます。
	 * セレクションのたびにテーブルの変更をチェックしますが、テーブルに変更が無ければ呼び出されません。
	 * これにより
	 */
	protected onCurrentTableChanged(nv: MarkdownTableContent | undefined, ov: MarkdownTableContent | undefined)
	{
		this.enableCommandNames = this.checkEnabledCommandNames();
		this.onCurrentTableChangedDecorate(nv, ov);
	}

	protected onCurrentTableChangedDecorate(nv: MarkdownTableContent | undefined, ov: MarkdownTableContent | undefined)
	{
		this.switcher.decoratorSwitcher.decorate(nv);
	}

	public dispose(): void
	{
		
	}

	/**
	 * フォーマット要求があった場合に呼び出されます。
	 * 必ず既定のメソッドよ呼び出してください。
	 */
	protected onFormatRequest(): void
	{
        const cmd = this.getCommands().get('format:beautiful');
        cmd?.execute();
	}
	
	/**
	 * @param tables テーブル一覧
	 * 
	 * ポーリング中、テーブル一覧に更新があった場合呼び出されます。
	 */
	protected onTableUpdated(tables: MarkdownTableContent[])
	{

	}


	protected createCommands(appContext: IAppContext, cache: TableCacheManager): Map<string, ICommand>
	{
		const formatterContext = this.createFormatterContext(appContext);
		const factory = new DefaultCommandFactory(appContext, cache, formatterContext);
		const commands = factory.createCommandFactries();
		return commands;
	}

	protected createFormatterContext(appContext: IAppContext): IFormatterContext
	{
		const textReplacer = appContext.getTextReplacer();
		const mode = this.getFormatMode();
		return new DefaultFormatterContext(textReplacer, mode, appContext.returnKey());
	}

	protected getFormatMode(): MarkdownTableRenderMode
	{
		return MarkdownTableRenderMode.Beautiful;
	}

	private checkEnabledCommandNames(): string[]
	{
		return [...this.getCommands().entries()]
			.filter(([, command]) => command.canExecute())
			.map(([name]) => name)
	}


	protected abstract createAppContext(): IAppContext;
	protected abstract registerTransmitter(reciever: ITextEventReciever): void;


}



export class MultiEventRecievers implements ITextEventReciever
{
	public readonly recievers: Array<ITextEventReciever> = [];
	
	public textChanged(e: ITextChanged): void
	{
		this.recievers.forEach(_ => _.textChanged(e));
	}

	public selectChanged(e: ISelectChanged): void
	{
		this.recievers.forEach(_ => _.selectChanged(e));
	}

	public otherChanged(e: any): void
	{
		this.recievers.forEach(_ => _.otherChanged(e));
	}

}




class Switcher
{

	public readonly recieverSwitcher: FormatterSwitcher;
	public readonly decoratorSwitcher: DecoratorSwitcher;

	public constructor(eventReciever: MultiEventRecievers, appContext: IAppContext)
	{
		this.recieverSwitcher = new FormatterSwitcher(eventReciever);
		this.decoratorSwitcher = new DecoratorSwitcher(appContext);
	}

}


export interface ISwitcher
{
	changeEnable(enabled: boolean): void;
}

class FormatterSwitcher implements ISwitcher
{
	private formatter: ITextEventReciever | undefined;

	public constructor(private readonly reciever: MultiEventRecievers)
	{

	}
	
	public changeEnable(enabled: boolean): void
	{
		enabled ? this.on() : this.off();
	}

	public on(): void
	{
		if(this.formatter)
		{
			this.reciever.recievers.unshift(this.formatter);
			this.formatter = undefined;
		}
	}

	public off(): void
	{
		const formatter = this.reciever.recievers.find(_ => _ instanceof AutoFormatter);
		if(formatter)
		{
			const rs = this.reciever.recievers;
			const f = rs.splice(rs.indexOf(formatter), 1);
			if(f.length)
			{
				this.formatter = f[0];
			}
		}
	}

}


class DecoratorSwitcher implements ISwitcher
{
	private _enabled: boolean = false ;

	public constructor(private readonly appContext: IAppContext)
	{

	}
	
	public changeEnable(enabled: boolean): void
	{
		this._enabled = enabled;
		if(!enabled)
		{
			this.appContext.getDecorator().clearDecorate();
		}
	}

	public decorate(nv?: MarkdownTableContent)
	{
		const decorator = this.appContext.getDecorator();

		if(this._enabled)
		{
			const appContext = this.appContext;

			decorator.clearDecorate();
			
			if (nv)
			{
				const docPos = appContext.getCursor();
				if (docPos)
				{
					decorator.decorate(nv, docPos);
				}
			}			
		}

		
	}
}







