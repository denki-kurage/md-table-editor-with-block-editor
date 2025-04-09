import { ICommand, AppMain } from 'md-table-editor';

export class AppMainHelper {
	public readonly commands: Map<string, ICommand>;
	public get enabledCommandNames() {
		return this.app.getEnabledCommandNames();
	}


	public constructor(public readonly app: AppMain<any>) {
		this.commands = app.getCommands();
	}

	// テーブルコマンド名のみ取得。
	public get getTableCommandNames() {
		return this.app.getCommandNames();
	}

	public isCommandEnable(n: string) {
		return this.enabledCommandNames.includes(n);
	}

	public getCommand(n: string): ICommand | undefined {
		return this.commands.get(n);
	}

	public execCommand(n: string, parameter: any): void {
		const cmd = this.getCommand(n);
		if (cmd && cmd.canExecute(parameter)) {
			cmd.execute(parameter);
		}
	}
}
