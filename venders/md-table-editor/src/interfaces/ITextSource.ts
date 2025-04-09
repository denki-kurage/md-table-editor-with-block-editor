

export interface ITextSource
{
	lineAt(line: number): string;
	hasLine(line: number): boolean;
}

