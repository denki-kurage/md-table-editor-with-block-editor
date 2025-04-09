

export class BrowserAppHelper
{
	public static toPosition(text: string, charIndex: number)
	{
		const lines = text.substring(0, charIndex).split("\n");
		const linePos = lines.length;
		const charPos = lines.pop()?.length ?? 0;
		return [linePos - 1, charPos];
	}

	public static toIndex(text: string, docIndex: number, charIndex: number)
	{
		const lines = text.split("\n");
		const slices = lines.slice(0, docIndex);
		const bef = slices.reduce((pre, cur) => pre + cur.length, 0) + slices.length;
		const pos = charIndex + bef;
		return pos;
	}

	public static lineToPosition(text: string, docIndex: number)
	{
		const lines = this.textLines(text).slice(0, docIndex);
		//lines.pop();

		const count = lines.reduce((pre, cur) => cur.length + pre + 1, 0);
		return count;
	}

	public static textLines(text: string)
	{
		return text.split("\n");
	}

	public static textLinesCount(text: string)
	{
		return this.textLines(text).length;
	}

	
}