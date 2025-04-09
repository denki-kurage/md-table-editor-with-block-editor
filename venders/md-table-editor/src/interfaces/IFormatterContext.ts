import { IMarkdownTableFormatter } from "../impls/MarkdownTableConverter";
import { ITableConverter } from "./ITableConverter";
import { ITextReplacer } from "./ITextReplacer";

export interface IFormatterContext
{
	readonly formatter: IMarkdownTableFormatter;
	readonly renderer: ITableConverter<string>;
	readonly replacer: ITextReplacer;
}

