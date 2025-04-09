import { IAppContext } from "../interfaces/IAppContext";
import { MarkdownRange } from "../interfaces/MarkdownRange";
import { IDocumentPosition } from "../interfaces/IDocumentPosition";
import { MarkdownParser } from "./MarkdownParser";
import { MarkdownTableContent } from "../impls/MarkdownTableContent";
import { MarkdownTableConverter, MarkdownTableFormatter, MarkdownTableRenderMode } from "../impls/MarkdownTableConverter";
import { TextReader } from "../interfaces/TextReader";
import { IFormatterContext } from "../interfaces";



export class AppHelper
{
	public constructor(public readonly appContext: IAppContext)
	{

	}

	public getTable(pos?: IDocumentPosition): MarkdownTableContent | undefined
	{
		const ts = this.appContext.getTextSource();
		pos = pos || this.appContext.getCursor();

		if (ts && pos)
		{
			const parser = new MarkdownParser();
			const content = parser.findContent(ts, pos.docIndex);

			if (content instanceof MarkdownTableContent)
			{
				return content as MarkdownTableContent;
			}
		}
	}

	public getTableContents(): Array<MarkdownTableContent>
	{
		const ts = this.appContext.getTextSource();
		if(ts)
		{
			const parser = new MarkdownParser();
			return <MarkdownTableContent[]>[...parser.parse(ts)].filter(_ => _ instanceof MarkdownTableContent);
		}

		return [];
	}

	public formatTable(table: MarkdownTableContent, renderMode: MarkdownTableRenderMode): string
	{
		const formatter = MarkdownTableFormatter.createInstance();
		formatter.format(table);

		const converter = new MarkdownTableConverter(renderMode, this.appContext.returnKey());
		return converter.fromTable(table);
	}

	public formatAndRender(table: MarkdownTableContent, context: IFormatterContext)
	{
		context.formatter.format(table);
		return context.renderer.fromTable(table);
	}

	public getDocumentText(range: MarkdownRange): string | undefined
	{
		const ts = this.appContext.getTextSource();
		if(ts)
		{
			const tr = new TextReader(ts);
			return tr.getText(range.begin, range.end).join(this.appContext.returnKey());
		}
	}


}

