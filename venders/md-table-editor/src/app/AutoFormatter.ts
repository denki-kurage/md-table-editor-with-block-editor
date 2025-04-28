import { ITextEventReciever, ITextChanged, ISelectChanged } from "../interfaces/ITextEventReciever";
import { EventUpdateManager } from "./EventUpdateManager";
import { IDocumentPosition } from "../interfaces/IDocumentPosition";
import { TableCacheManager } from "./TableCacheManager";
import { IAppContext } from "../interfaces/IAppContext";
import { AppHelper } from "./AppHelper";
import { MarkdownTableRenderMode } from "../impls/MarkdownTableConverter";
import { IFormatterContext, ITableConverter } from "../interfaces";

/**
 * 現在キャッシュされているテーブルを文字列化したものと、
 * そのテーブルの範囲(行数)のテキストソースの文字列が違った場合再フォーマットする
 */
export class AutoFormatter implements ITextEventReciever
{

	private updateManager: EventUpdateManager;
	private docPos: IDocumentPosition | undefined;

	public constructor(
		protected readonly appContext: IAppContext,
		protected readonly cache: TableCacheManager,
		protected readonly formatted: () => void,
		protected readonly getFormatterContext: () => IFormatterContext
	)
	{
		this.updateManager = new EventUpdateManager(500);
		this.updateManager.updated.push(() => this.requestReplace());
	}

	public textChanged(e: ITextChanged): void
	{
		this.docPos = e.startPosition;

		//
		this.updateManager.lazyUpdate();
		//
		// 
		// this.updateManager.update();
		//
		//
		//
	}

	public selectChanged(e: ISelectChanged): void
	{
		// console.log(this.appContext.getCursor())
		// this.updateManager.hasUpdate();
	}


	public otherChanged(e: any): void
	{
		//this.updateManager.hasUpdate();
	}

	/**
	 * 
	 */
	private requestReplace(): void
	{
		if (!this.docPos) return;

		// 自動フォーマットなのでキャッシュではなく直接取得。
		let table = this.cache.newItem;

		if (table)
		{
			const helper = new AppHelper(this.appContext);

			// しまった、ここでテーブルの構造に変化が加わるので、
			const fmt = helper.formatAndRender(table, this.getFormatterContext()); // 改行コードなし
			const doc = helper.getDocumentText(table.range); // 改行コードあり
			

			// 新しくテーブルを再取得する必要がある。
			table = this.cache.newItem;
			const newPos = this.appContext.getCursor();

			
			if (table && newPos && fmt !== doc)
			{
				this.formatted();
				//this.appMain.commandFactory.createBeautifulFormat().execute();
				//this.updateManager.clearTimeout();
			}
		}

		// ちょっとリファクタ必要かな
		this.docPos = undefined;
	}

}
