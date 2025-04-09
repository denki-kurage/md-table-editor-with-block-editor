import { MarkdownTableContent, TableCell, TableAlignmentCell, MarkdownTableRows, MarkdownTableAlignments } from "./MarkdownTableContent";
import { MarkdownAlignments } from "../interfaces/MarkdownAlignments";
import { ITableConverter } from "../interfaces/ITableConverter";
import { StringCounter } from "../StringCounter";


export interface IColumnRenderSizeInfo
{
	width: number,
	align: MarkdownAlignments
}


export enum MarkdownTableRenderMode
{
	/**
	 * 出来るだけ元を崩さず自然な状態でフォーマットします。
	 */
	Natural,


	/**
	 * 奇麗に整えられた状態でフォーマットします。
	 */
	Beautiful

}


/**
 * 
 */
export class MarkdownTableConverter implements ITableConverter<string>
{

	public constructor(
		public readonly renderMode: MarkdownTableRenderMode,
		private readonly returnKey: string)
	{

	}


	public toTable(data: string): MarkdownTableContent
	{
		throw new Error("Method not implemented.");
	}

	public fromTable(table: MarkdownTableContent): string
	{
		const textBuilder: Array<string> = [];

		textBuilder.push(this.createRow(table.headers));
		textBuilder.push(this.createRow(table.alignments));
		table.rows.forEach(_ => textBuilder.push(this.createRow(_)));

		// 
		// 改行コードは統一する。
		//
		return textBuilder.join(this.returnKey).trim();
	}

	protected createRow(row: MarkdownTableRows): string
	{
		return this.renderMode === MarkdownTableRenderMode.Beautiful ? this.beautiful(row) : this.natural(row);
	}

	protected natural(row: MarkdownTableRows): string
	{
		// firstCellがundefinedの時スプリッタが無いことを意味する。
		// この場合、その分を空白で埋める。
		// | a | b | c |
		//   d | e | f | ← スプリッタが無い分空白で埋める。
		const firstCellSpace = row.firstCell === undefined ? ' ' : '';

		return firstCellSpace + [...row].map(_ => _.word).join('|');
	}

	protected beautiful(row: MarkdownTableRows): string
	{
		const msg = row.lastCell ? row.lastCell.word : '';
		return `|${row.cells.map(_ => _.word).join('|')}|${msg}`
	}
	
}



/**
 * テーブルフォーマットの設定情報
 */
export interface ITableFormatterConfig
{
	readonly leftSpaceLength: number;
	readonly rightSpaceLength: number;
}

export interface IMarkdownTableFormatter
{
	format(table: MarkdownTableContent): void;
}


export class MarkdownTableFormatter implements IMarkdownTableFormatter
{

	public constructor(
		public readonly config: ITableFormatterConfig,
		public readonly cellFormatter: CellFormatter,
		public readonly alignFormatter: AlignFormatter)
	{

	}

	public static createInstance(leftSpaceLength: number = 1, rightSpaceLength: number = 1): MarkdownTableFormatter
	{
		return new MarkdownTableFormatter(
			{
				rightSpaceLength: rightSpaceLength,
				leftSpaceLength: leftSpaceLength
			},
			new CellFormatter(),
			new AlignFormatter()
		);
	}


	public format(table: MarkdownTableContent): void
	{
		const columnRenderSize = this.getColumnRenderSizeInfo(table);

		this.formatCell(table.headers, columnRenderSize);
		this.formatAlign(table.alignments, columnRenderSize);
		table.rows.forEach(_ => this.formatCell(_, columnRenderSize));
	}

	protected formatCell(row: MarkdownTableRows, columnInfo: Array<IColumnRenderSizeInfo>): void
	{
		row.cells.forEach((_, index) => this.cellFormatter.format(_, columnInfo[index], this.config));
	}

	protected formatAlign(align: MarkdownTableAlignments, columnInfo: Array<IColumnRenderSizeInfo>): void
	{
		align.cells.forEach((_, index) => this.alignFormatter.format(_, columnInfo[index]));
	}

	// 余白を含めたカラム横幅の最大サイズを取得。
	private getColumnRenderSizeInfo(table: MarkdownTableContent): Array<IColumnRenderSizeInfo>
	{
		return table.headers.cells.map<IColumnRenderSizeInfo>((value, index) =>
		{
			// 存在する縦のセルの文字数をすべて取得
			const vc = [...table.getVerticalOnlyTableRows(index)].map(_ => StringCounter.stringCount(_.cell.word.trim()));

			// ヘッダ文字数を含め、その中で最大値を取得
			const max = Math.max(...vc, StringCounter.stringCount(table.headers.cells[index].word.trim()));

			// アライメントのセルを取得
			const cell = table.alignments.getCell(index);

			return {
				width: this.adjustWidth(max),
				align: cell ? cell.align : MarkdownAlignments.Left
			};
		});
	}

	protected adjustWidth(width: number): number
	{
		// 余白を追加。
		width += this.config.leftSpaceLength + this.config.rightSpaceLength;

		// widthは最低でも3文字必要(アライメントが三文字(例えば'---'や'--:'など))なので調整する。
		width = Math.max(3, width);

		return width;
	}

}



export class CellFormatter
{
	public format(cell: TableCell, columnInfo: IColumnRenderSizeInfo, config: ITableFormatterConfig): void
	{
		const word = cell.word.trim();

		// 空白の合計サイズを計算。ワードから余白と文字列サイズを引いたもの。
		const spaceCount = Math.max(0, columnInfo.width - StringCounter.stringCount(word) - config.leftSpaceLength - config.rightSpaceLength);

		// 左右の空白のサイズを計算
		const [l, r] = this.getSpace(spaceCount, columnInfo.align);

		// 左右の空白に余白のサイズを追加。
		const [left, right] = [l + config.leftSpaceLength, r + config.rightSpaceLength];

		// 空白を文字列化
		const leftSpace = ' '.repeat(left);
		const rightSpace = ' '.repeat(right);

		// セルを変更
		cell.word = `${leftSpace}${word}${rightSpace}`;
	}

	// アライメントによって空白量を計算
	private getSpace(spaceCount: number, align: MarkdownAlignments): [number, number]
	{
		// Center or Right(スペースが左側)
		let [left, right] = align === MarkdownAlignments.Center
			? this.splitNumber(spaceCount) : [spaceCount, 0];

		// or Left
		if (align === MarkdownAlignments.Left)
		{
			[left, right] = [right, left];
		}

		return [left, right];
	}

	// センタリングの場合、奇数を考慮して２分割。奇数の場合はは左側に空白を追加。
	private splitNumber(len: number): [number, number]
	{
		const flag = len % 2;        // 奇数ならflagが1になる。
		const hf = (len - flag) / 2; // 偶数を2で割る
		return [hf + flag, hf];      // 奇数なら左に1追加
	}

}

export class AlignFormatter
{
	public format(align: TableAlignmentCell, columnInfo: IColumnRenderSizeInfo): void
	{
		const aw = align.alignWord;
		const line = '-'.repeat(columnInfo.width - 3);
		const lineStr = `${aw.charAt(0)}${line}${aw.charAt(1)}${aw.charAt(2)}`;

		// セルを変更
		align.word = lineStr;
	}
}




