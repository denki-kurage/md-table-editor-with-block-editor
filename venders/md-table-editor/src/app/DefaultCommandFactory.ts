import { ChangeAlignmentCommand } from "../commands/ChangeAlignmentCommand";
import { RemoveColumnCommand } from "../commands/RemoveColumnCommand";
import { InsertColumnCommand } from "../commands/InsertColumnCommand";
import { InsertRowCommand } from "../commands/InsertRowCommand";
import { MoveRowCommand } from "../commands/MoveRowCommand";
import { MoveColumnCommand } from "../commands/MoveColumnCommand";
import { FillCellsCommand } from "../commands/FillCellsCommand";
import { FormatCommand } from "../commands/FormatCommand";
import { RemoveRowCommand } from "../commands/RemoveRowCommand";
import { FocusCommand } from "../commands/FocusCommand";
import { DeleteCommentCommand } from "../commands/DeleteCommetCommand";
import { SortCommand } from "../commands/SortCommand";
import { TextSortCommand } from "../commands/TextSortCommand";
import { ScrollCommand } from "../commands/ScrollCommand";
import { ICommandContext } from "../interfaces/ICommandContext";
import { MarkdownAlignments } from "../interfaces/MarkdownAlignments";
import { MarkdownTableConverter, MarkdownTableRenderMode } from "../impls/MarkdownTableConverter";
import { Direction } from "../interfaces/Direction";
import { IAppContext } from "../interfaces/IAppContext";
import { TableCacheManager } from "./TableCacheManager";
import { IFormatterContext } from "../interfaces/IFormatterContext";
import { ColumnSelectCommand, SelectType } from "../commands/ColumnSelectCommand";
import { MarkdownTableContent } from "../impls/MarkdownTableContent";
import { ICommand } from "../interfaces";


export class DefaultCommandFactory
{
	public constructor(
		protected appContext: IAppContext,
		protected cache: TableCacheManager,
		private readonly formatterContext: IFormatterContext
	)
	{
		
	}

	public commandContext(renderMode: MarkdownTableRenderMode = MarkdownTableRenderMode.Natural): ICommandContext
	{
		const ctx: IFormatterContext = renderMode ? this.formatterContext : {
			formatter: this.formatterContext.formatter,
			replacer: this.formatterContext.replacer,
			renderer: new MarkdownTableConverter(renderMode, this.appContext.returnKey())
		}
		return new CommandContext(this.appContext, ctx, this.cache);
	}



	//#region セルベースのコマンド
	
	public createMoveLeft(): MoveColumnCommand
	{
		return new MoveColumnCommand(this.commandContext(), true);
	}

	public createMoveRight(): MoveColumnCommand
	{
		return new MoveColumnCommand(this.commandContext(), false);
	}

	public createMoveTop(): MoveRowCommand
	{
		return new MoveRowCommand(this.commandContext(), true);
	}

	public createMoveBottom(): MoveRowCommand
	{
		return new MoveRowCommand(this.commandContext(), false);
	}

	public createInsertLeft(): InsertColumnCommand
	{
		return new InsertColumnCommand(this.commandContext(), true);
	}

	public createInsertRight(): InsertColumnCommand
	{
		return new InsertColumnCommand(this.commandContext(), false);
	}

	public createInsertTop(): InsertRowCommand
	{
		return new InsertRowCommand(this.commandContext(), true);
	}

	public createInsertBottom(): InsertRowCommand
	{
		return new InsertRowCommand(this.commandContext(), false);
	}

	public createChangeAlignLeft(): ChangeAlignmentCommand
	{
		return new ChangeAlignmentCommand(this.commandContext(), MarkdownAlignments.Left);
	}

	public createChangeAlignCenter(): ChangeAlignmentCommand
	{
		return new ChangeAlignmentCommand(this.commandContext(), MarkdownAlignments.Center);
	}

	public createChangeAlignRight(): ChangeAlignmentCommand
	{
		return new ChangeAlignmentCommand(this.commandContext(), MarkdownAlignments.Right);
	}

	public createNaturalFormat(): FormatCommand
	{
		return new FormatCommand(this.commandContext(MarkdownTableRenderMode.Natural));
	}

	public createBeautifulFormat(): FormatCommand
	{
		return new FormatCommand(this.commandContext(MarkdownTableRenderMode.Beautiful));
	}

	public createFocusLeft(): FocusCommand
	{
		return new FocusCommand(this.commandContext(), Direction.Left);
	}

	public createFocusRight(): FocusCommand
	{
		return new FocusCommand(this.commandContext(), Direction.Right);
	}

	public createFocusTop(): FocusCommand
	{
		return new FocusCommand(this.commandContext(), Direction.Top);
	}

	public createFocusBottom(): FocusCommand
	{
		return new FocusCommand(this.commandContext(), Direction.Bottom);
	}

	public createColumnSelect(): ColumnSelectCommand
	{
		return new ColumnSelectCommand(this.commandContext(), SelectType.Full);
	}

	public createColumnSelectAll(): ColumnSelectCommand
	{
		return new ColumnSelectCommand(this.commandContext(), SelectType.Empty | SelectType.Full);
	}

	public createColumnSelectEmpty(): ColumnSelectCommand
	{
		return new ColumnSelectCommand(this.commandContext(), SelectType.Empty);
	}

	public createDeleteComment(): DeleteCommentCommand
	{
		return new DeleteCommentCommand(this.commandContext());
	}

	public createFillCells(): FillCellsCommand
	{
		return new FillCellsCommand(this.commandContext());
	}

	public createRemoveRow(): RemoveRowCommand
	{
		return new RemoveRowCommand(this.commandContext());
	}

	public createRemoveColumn(): RemoveColumnCommand
	{
		return new RemoveColumnCommand(this.commandContext());
	}

	public createSortAsc(): SortCommand
	{
		return new SortCommand(this.commandContext(), true);
	}

	public createSortDesc(): SortCommand
	{
		return new SortCommand(this.commandContext(), false);
	}

	public createTextSortAsc(): TextSortCommand
	{
		return new TextSortCommand(this.commandContext(), true, false);
	}

	public createTextSortDesc(): TextSortCommand
	{
		return new TextSortCommand(this.commandContext(), false, false);
	}

	public createTextSortAscIgnore(): TextSortCommand
	{
		return new TextSortCommand(this.commandContext(), true, true);
	}

	public createTextSortDescIgnore(): TextSortCommand
	{
		return new TextSortCommand(this.commandContext(), false, true);
	}

	//#endregion





	//#region 全体的なコマンド

	public createIndexScrollCommand(): ScrollCommand
	{
		return new ScrollCommand(this.commandContext(), true);
	}

	//#endregion




	public createCommandFactries()
	{
		const factory = this;
		const commands = new Map<string, ICommand>();

		commands.set('format:beautiful', factory.createBeautifulFormat());
		commands.set('format:natural', factory.createNaturalFormat());
		commands.set('format:delete-comment', factory.createDeleteComment());
		commands.set('format:fill-cells', factory.createFillCells());

		commands.set('align:right', factory.createChangeAlignRight());
		commands.set('align:center', factory.createChangeAlignCenter());
		commands.set('align:left', factory.createChangeAlignLeft());

		commands.set('insert:top', factory.createInsertTop());
		commands.set('insert:bottom', factory.createInsertBottom());
		commands.set('insert:left', factory.createInsertLeft());
		commands.set('insert:right', factory.createInsertRight());

		commands.set('remove:column', factory.createRemoveColumn());
		commands.set('remove:row', factory.createRemoveRow());

		commands.set('move:top', factory.createMoveTop());
		commands.set('move:bottom', factory.createMoveBottom());
		commands.set('move:left', factory.createMoveLeft());
		commands.set('move:right', factory.createMoveRight());

		commands.set('focus:left', factory.createFocusLeft());
		commands.set('focus:top', factory.createFocusTop());
		commands.set('focus:bottom', factory.createFocusBottom());
        commands.set('focus:right', factory.createFocusRight());

        commands.set('multi-select:select', factory.createColumnSelect());
        commands.set('multi-select:all', factory.createColumnSelectAll());
        commands.set('multi-select:empty', factory.createColumnSelectEmpty());

		commands.set('sort:number-asc', factory.createSortAsc());
		commands.set('sort:number-desc', factory.createSortDesc());
		commands.set('sort:text-asc', factory.createTextSortAsc());
		commands.set('sort:text-desc', factory.createTextSortDesc());
		commands.set('sort:text-asc-ignore', factory.createTextSortAscIgnore());
        commands.set('sort:text-desc-ignore', factory.createTextSortDescIgnore());

		commands.set('scroll', factory.createIndexScrollCommand());

		
		return commands;
	}

}

class CommandContext implements ICommandContext
{
	public constructor(
		public readonly appContext: IAppContext,
		public readonly formatterContext: IFormatterContext,
		protected readonly cache: TableCacheManager)
	{

	}

	public getTable(): MarkdownTableContent | undefined
	{
		return this.cache.cachedItem;
	}

	public getFormatterContext(): IFormatterContext
	{
		return this.formatterContext;
	}

}






