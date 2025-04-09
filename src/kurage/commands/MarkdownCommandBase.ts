import { IAppContext, ICommand } from "md-table-editor";

export abstract class MarkdownCommandBase<T> implements ICommand
{
    public constructor(protected readonly appContext: IAppContext)
    {

    }

    public abstract execute(parameter?: T);
    public abstract canExecute(parameter?: T): boolean;
    canExecuteChanged: (() => void)[];
}

