import { IDocumentPosition } from "./IDocumentPosition";
import { ITextSource } from "./ITextSource";
import { IStringCounter } from "./IStringCounter";
import { MarkdownTableContent } from "../impls/MarkdownTableContent";
import { ITextReplacer } from "./ITextReplacer";

export interface IAppContext
{
	getCursor(): IDocumentPosition | undefined;
	getText(): string;
	//replace(range: MarkdownRange, text: string, cursorPos: IDocumentPosition): void;
	getTextSource(): ITextSource | undefined;
	getTextReplacer(): ITextReplacer;

	getStringCounter(): IStringCounter;
	getAppConfig(): IAppConfig;
	returnKey(): string;

	getDecorator(): IEditorDecorator;
	scroll(docIndex: number): void;
}

export interface IEditorDecorator
{
	decorate(table: MarkdownTableContent, docPos: IDocumentPosition): void;
	clearDecorate(): void;
}

export interface IAppConfig
{
}


