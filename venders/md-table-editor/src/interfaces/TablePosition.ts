
export class TablePosition
{

	public constructor(
		public readonly rowIndex: number,
		public readonly columnIndex: number
	)
	{

	}

	public equals(tablePosition: TablePosition): boolean
	{
		return this.rowIndex === tablePosition.rowIndex && this.columnIndex === tablePosition.columnIndex;
	}

	public newAdded(vector: TablePosition): TablePosition
	{
		return new TablePosition(
			this.rowIndex + vector.rowIndex,
			this.columnIndex + vector.columnIndex
		);
	}

	public newAddedRowIndex(rowIndex: number): TablePosition
	{
		return this.newAdded(new TablePosition(rowIndex, 0));
	}

	public newAddedColumnIndex(columnIndex: number): TablePosition
	{
		return this.newAdded(new TablePosition(0, columnIndex));
	}

	public newRowIndex(rowIndex: number): TablePosition
	{
		return new TablePosition(rowIndex, this.columnIndex);
	}

	public newColumnIndex(columnIndex: number): TablePosition
	{
		return new TablePosition(this.rowIndex, columnIndex);
	}
}
