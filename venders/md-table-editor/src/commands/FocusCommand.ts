import { IFormattableParameter } from "../interfaces/IFormattableParameter";
import { TableCellInfo } from "../impls/MarkdownTableContent";
import { FocusCommandBase } from "./CommandBaseClasses";
import { Direction } from "../interfaces/Direction";
import { TablePosition } from "../interfaces/TablePosition";

export class FocusCommand extends FocusCommandBase
{
	protected canExecuteOverride(cellInfo: TableCellInfo, parameter: void): boolean
	{
		// TODO: メニューバーとの問題がありどうするか検討中。
		const nextCellInfo = this.getNextCellInfo(cellInfo);

		return !cellInfo.isOuterSide && !!nextCellInfo;
	}

	protected executeOverride(cellInfo: TableCellInfo, parameter: void, focus: IFormattableParameter): void
	{
		let targetCellInfo = this.getNextCellInfo(cellInfo);
		if(targetCellInfo)
		{
			targetCellInfo = targetCellInfo.newCellInfo(0);
			const f = targetCellInfo?.getWordSelection();
			focus.setFocusedCellInfo(f);
		}
	}

	private getNextCellInfo(cellInfo: TableCellInfo): TableCellInfo | undefined
	{
		const colIndex = cellInfo.columnIndex; // firstCell or lastCell is -1
		const rowIndex = cellInfo.rowIndex;

		let currentCell: TableCellInfo | undefined = cellInfo;

		// 左移動(ワープ)
		if(this.direction === Direction.Left)
		{
			if(colIndex > 0)
			{
				return currentCell.getCellFromDirection(Direction.Left);
			}

			// row=0の場合はalignmentsを飛ばしてheadersへ移動。その後一番左へ移動。
			let left = currentCell.getCellFromRelative(new TablePosition(rowIndex === 0 ? -2 : -1, 0));
			return left?.getCellFromRelative(new TablePosition(0, Math.max(0, left.rowCellsLength - 1)));
		}

		// 右移動(ワープ)
		if(this.direction === Direction.Right)
		{
			const lastColIndex = cellInfo.rowCellsLength - 1 || 0;

			if(colIndex < lastColIndex)
			{
				return currentCell?.getCellFromDirection(Direction.Right);
			}

			const right = currentCell?.getCellFromAbsolute(cellInfo.tablePosition.newColumnIndex(0));
			return right?.getCellFromRelative(new TablePosition(rowIndex === -2 ? 2 : 1, 0));
		}


		if(this.direction === Direction.Top)
		{
			return currentCell.getCellFromRelative(new TablePosition(rowIndex === 0 ? -2 : -1, 0));
		}

		if(this.direction === Direction.Bottom)
		{
			return currentCell.getCellFromRelative(new TablePosition(rowIndex === -2 ? 2 : 1, 0));
		}

	}

	protected isRowOnly(): boolean
	{
		return false;
	}
}





