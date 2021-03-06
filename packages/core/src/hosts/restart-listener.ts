import * as Readline from 'readline';

export interface RestartListenerInit {
	readline: Readline.ReadLine;
}

const readline = Readline.createInterface({
	input: process.stdin,
	terminal: false
});

export class RestartListener {
	private readline: Readline.ReadLine;
	// tslint:disable-next-line:no-empty
	private listener: () => void = () => {};

	private constructor(init: RestartListenerInit) {
		this.readline = init.readline;
	}

	public static async fromProcess(process: NodeJS.Process): Promise<RestartListener> {
		return new RestartListener({ readline });
	}

	private onRs = (line: string): void => {
		if (!line.endsWith('rs')) {
			return;
		}

		Readline.moveCursor(process.stdin, 0, -1);
		Readline.clearLine(process.stdin, 0);

		this.listener();
	};

	public subscribe(listener: () => void): void {
		this.listener = listener;
		this.readline.on('line', this.onRs);
	}

	public unsubscribe(): void {
		this.readline.removeAllListeners();
	}
}
