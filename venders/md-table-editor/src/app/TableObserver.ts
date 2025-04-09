import { ITextEventReciever, ITextChanged, ISelectChanged } from "../interfaces/ITextEventReciever";
import { EventUpdateManager } from "./EventUpdateManager";
import { MarkdownTableContent } from "../impls/MarkdownTableContent";
import { IAppContext } from "../interfaces/IAppContext";
import { AppHelper } from "./AppHelper";


export class TableObserver implements ITextEventReciever
{

	private eventManager: EventUpdateManager;

	public constructor(
		private readonly appContext: IAppContext,
		private readonly updated: (tables: Array<MarkdownTableContent>) => void)
	{
		this.eventManager = new EventUpdateManager(300);
		this.eventManager.updated.push(() =>
		{
			this.tableUpdate();
		});
	}

	public textChanged(e: ITextChanged): void
	{
		this.lazyUpdate();
	}

	public selectChanged(e: ISelectChanged): void
	{
		this.lazyUpdate();
	}

	public otherChanged(e?: any): void
	{
		// テキスト変更やセレクション変更以外、つまりエディタの変更時などは即時更新。
		this.eventManager.update();
	}

	private lazyUpdate(): void
	{
		this.eventManager.lazyUpdate();
	}

	private tableUpdate(): void
	{
		const tables = new AppHelper(this.appContext).getTableContents();
		console.log(tables)
		this.updated(tables);
	}

}

