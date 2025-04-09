import { IAppContext, IDocumentPosition, MarkdownTableContent } from "md-table-editor";
import { TableCell } from "md-table-editor/dist/impls/MarkdownTableContent";
import { editor, IDisposable, Range } from "monaco-editor";

type CellAndRange = { range: Range, cell: TableCell }

export class MonacoDecorator implements IDisposable
{
    private decorations: editor.IEditorDecorationsCollection | undefined;

    public constructor(
        private readonly appContext: IAppContext,
        private readonly editor: editor.IStandaloneCodeEditor)
    {

    }

    private toRange(cell: TableCell, docIndex: number, beginCharIndex: number, endCharIndex: number): CellAndRange
    {
        return ({
            cell,
            range: new Range(docIndex + 1, beginCharIndex + 1, docIndex + 1, endCharIndex + 1)
        })
    }

    private getDecorationInternal(center: TableCell, cellRanges: CellAndRange[], before: string, after: string, def: string): editor.IModelDeltaDecoration[]
    {
        const firstPosition = 0;
        const lastPosition = cellRanges.length - 1;
        const classes = cellRanges.map((cr, index) => {
            const { cell, range } = cr;
            const isCenter = cell === center;
            const className = isCenter ? 'center' : firstPosition === index ? before : lastPosition === index ? after : def;
            return { cell, range, className }
        })

        return classes.map(r => ({
            range: r.range,
            options: { inlineClassName: 'wp-kurage ' + r.className }
        }));
    }

    public decorate(table: MarkdownTableContent, docPos: IDocumentPosition)
    {
        const tableInfo = table.getCellInfo(docPos);
        if(!tableInfo) return;

        const centerCell = tableInfo.cell;
        const stringCounter = this.appContext.getStringCounter();
        const docIndex = docPos.docIndex;

        const rows = [...tableInfo.row.getCellInfomations(stringCounter)]
            .filter(ci => !tableInfo.row.isFirstOrLast(ci.cell))
            .map(ci => this.toRange(ci.cell, docIndex, ci.range.begin, ci.range.end))
        const columns = [...table.rows.entries()].map(([index, row]) => {
            const ci = row.getCellInfomationFromColumnIndex(tableInfo.columnIndex);
            if(ci)
            {
                return this.toRange(ci.cell, table.range.begin + index + 2, ci.range.begin, ci.range.end)
            }

            // @ts-ignore
        }).filter(c => !!c)
        //.filter(c => c.cell !== centerCell); // 縦はcenterを外す



        const rowDecs = this.getDecorationInternal(centerCell, rows, 'left', 'right', 'row');
        const columnDecs = this.getDecorationInternal(centerCell, columns, 'top', 'bottom', 'column');

        this.decorations = this.editor.createDecorationsCollection([...rowDecs, ...columnDecs])
    }

    public clear()
    {
        this.decorations?.clear();
        this.decorations = undefined;
    }

    public dispose()
    {
        this.clear();
    }

}

