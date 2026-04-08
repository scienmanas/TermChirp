import * as vscode from 'vscode';
const player = require('play-sound')();

const errorPatterns = [
    "error",
    "command not found",
    "exception",
    "failed",
    "not recognized"
];

function playSound(soundPath: string) {
    player.play(soundPath, (err: any) => {
        if (err) {
            console.error(`TermChirp: Error playing sound: ${err}`);
        }
    });
}

export function activate(context: vscode.ExtensionContext) {

    const listenToShellExecution = vscode.window.onDidEndTerminalShellExecution(async (event) => {

        // Get the exit code and the sounds set from config
        const exitCode = event.exitCode;
        const config = vscode.workspace.getConfiguration('termchirp');

        // Flag
        let foundErrorPattern = false;

        // Try to read the terminal output if possible (VS Code 1.78+), and check for error patterns
        try {
            const stream = event.execution.read();
            let fullOutput = '';
            for await (const chunk of stream) {
                fullOutput += chunk;
            }
            const text = fullOutput.toLowerCase();
            foundErrorPattern = errorPatterns.some(pattern => text.includes(pattern));
        } catch {
            // read() not available — fall back to exit code only
        }

        const isError = (exitCode !== undefined && exitCode !== 0) || foundErrorPattern;
        const isSuccess = exitCode === 0 && !foundErrorPattern;

        if (isError) {
            const selected = config.get<string>('errorSound') || 'bruh';
            playSound(context.asAbsolutePath(`media/failed/${selected}.wav`));
        } else if (isSuccess) {
            const selected = config.get<string>('successSound') || 'hehe_boy';
            playSound(context.asAbsolutePath(`media/success/${selected}.wav`));
        }
    });

    const setSuccessSoundCommand = vscode.commands.registerCommand('termchirp.setSuccessSound', async () => {
        const options = [
            { label: 'Hehe Boy', value: 'hehe_boy' },
            { label: 'GTA Mission Passed', value: 'gta_mission_passed' },
            { label: 'Mario Yahoo', value: 'mario_yahoo' },
            { label: 'Ta-Da', value: 'tada' },
        ];
        const picked = await vscode.window.showQuickPick(options.map(o => o.label), {
            title: 'TermChirp: Select Success Sound'
        });
        if (picked) {
            const value = options.find(o => o.label === picked)!.value;
            await vscode.workspace.getConfiguration('termchirp').update('successSound', value, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage(`TermChirp: Success sound set to "${picked}".`);
        }
    });

    const setErrorSoundCommand = vscode.commands.registerCommand('termchirp.setErrorSound', async () => {
        const options = [
            { label: 'Bruh', value: 'bruh' },
            { label: 'Awkward Cricket', value: 'awkward_cricket' },
            { label: 'Ha Ha', value: 'haha' },
            { label: 'Windows XP Error', value: 'windows_xp_error' },
        ];
        const picked = await vscode.window.showQuickPick(options.map(o => o.label), {
            title: 'TermChirp: Select Error Sound'
        });
        if (picked) {
            const value = options.find(o => o.label === picked)!.value;
            await vscode.workspace.getConfiguration('termchirp').update('errorSound', value, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage(`TermChirp: Error sound set to "${picked}".`);
        }
    });

    context.subscriptions.push(listenToShellExecution);
    context.subscriptions.push(setSuccessSoundCommand);
    context.subscriptions.push(setErrorSoundCommand);
}

export function deactivate() {}
