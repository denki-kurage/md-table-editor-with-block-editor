import { MarkdownTableConverter, MarkdownTableRenderMode, MarkdownTableFormatter, IMarkdownTableFormatter } from "../impls/MarkdownTableConverter";
import { ITableConverter } from "../interfaces/ITableConverter";
import { IFormatterContext } from "../interfaces/IFormatterContext";
import { ITextReplacer } from "../interfaces/ITextReplacer";

export class DefaultFormatterContext implements IFormatterContext
{
	public readonly formatter: IMarkdownTableFormatter = MarkdownTableFormatter.createInstance();
	public readonly renderer: ITableConverter<string>;

	public constructor(
		public readonly replacer: ITextReplacer,
		mode: MarkdownTableRenderMode,
		returnKey: string)
	{
		this.renderer = new MarkdownTableConverter(mode, returnKey);
	}
}
