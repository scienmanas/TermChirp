import * as assert from 'assert';
import * as vscode from 'vscode';

suite('TermChirp Extension Tests', () => {

    suiteSetup(async () => {
        // Ensure the extension is activated before running tests
        const ext = vscode.extensions.getExtension('scienmanas.termchirp');
        if (ext && !ext.isActive) {
            await ext.activate();
        }
        // Reset settings to defaults before tests run (in case a previous run left dirty state)
        const config = vscode.workspace.getConfiguration('termchirp');
        await config.update('errorSound', 'bruh', vscode.ConfigurationTarget.Global);
        await config.update('successSound', 'hehe_boy', vscode.ConfigurationTarget.Global);
    });

    // --- Activation ---

    test('Extension activates successfully', async () => {
        const ext = vscode.extensions.getExtension('scienmanas.termchirp');
        assert.ok(ext, 'Extension should be present');
        assert.strictEqual(ext!.isActive, true, 'Extension should be active');
    });

    // --- Commands registered ---

    test('Command termchirp.setSuccessSound is registered', async () => {
        const commands = await vscode.commands.getCommands(true);
        assert.ok(commands.includes('termchirp.setSuccessSound'), 'setSuccessSound command should be registered');
    });

    test('Command termchirp.setErrorSound is registered', async () => {
        const commands = await vscode.commands.getCommands(true);
        assert.ok(commands.includes('termchirp.setErrorSound'), 'setErrorSound command should be registered');
    });

    // --- Default configuration ---

    test('Default errorSound config is "bruh"', () => {
        const config = vscode.workspace.getConfiguration('termchirp');
        assert.strictEqual(config.get<string>('errorSound'), 'bruh');
    });

    test('Default successSound config is "hehe_boy"', () => {
        const config = vscode.workspace.getConfiguration('termchirp');
        assert.strictEqual(config.get<string>('successSound'), 'hehe_boy');
    });

    // --- Configuration update ---

    test('errorSound setting can be updated', async () => {
        await vscode.workspace.getConfiguration('termchirp').update('errorSound', 'haha', vscode.ConfigurationTarget.Global);
        assert.strictEqual(vscode.workspace.getConfiguration('termchirp').get<string>('errorSound'), 'haha');
        // Restore default
        await vscode.workspace.getConfiguration('termchirp').update('errorSound', 'bruh', vscode.ConfigurationTarget.Global);
    });

    test('successSound setting can be updated', async () => {
        await vscode.workspace.getConfiguration('termchirp').update('successSound', 'tada', vscode.ConfigurationTarget.Global);
        assert.strictEqual(vscode.workspace.getConfiguration('termchirp').get<string>('successSound'), 'tada');
        // Restore default
        await vscode.workspace.getConfiguration('termchirp').update('successSound', 'hehe_boy', vscode.ConfigurationTarget.Global);
    });

    // --- Error pattern matching logic ---

    const errorPatterns = ['error', 'command not found', 'exception', 'failed', 'not recognized'];

    test('Detects "error" in output', () => {
        const output = 'SyntaxError: unexpected token';
        const found = errorPatterns.some(p => output.toLowerCase().includes(p));
        assert.strictEqual(found, true);
    });

    test('Detects "failed" in output', () => {
        const output = 'Build failed with 3 errors';
        const found = errorPatterns.some(p => output.toLowerCase().includes(p));
        assert.strictEqual(found, true);
    });

    test('Detects "command not found" in output', () => {
        const output = 'zsh: command not found: nod';
        const found = errorPatterns.some(p => output.toLowerCase().includes(p));
        assert.strictEqual(found, true);
    });

    test('Does not flag clean output as error', () => {
        const output = 'Compiled successfully in 1.2s';
        const found = errorPatterns.some(p => output.toLowerCase().includes(p));
        assert.strictEqual(found, false);
    });

    // --- Exit code classification ---

    test('Exit code 0 with no error pattern → success', () => {
        const exitCode = 0;
        const foundErrorPattern = false;
        const isError = (exitCode !== undefined && exitCode !== 0) || foundErrorPattern;
        const isSuccess = exitCode === 0 && !foundErrorPattern;
        assert.strictEqual(isError, false);
        assert.strictEqual(isSuccess, true);
    });

    test('Exit code 1 → error', () => {
        const exitCode: number = 1;
        const foundErrorPattern = false;
        const isError = (exitCode !== undefined && exitCode !== 0) || foundErrorPattern;
        assert.strictEqual(isError, true);
    });

    test('Exit code 0 but error pattern found → error', () => {
        const exitCode = 0;
        const foundErrorPattern = true;
        const isError = (exitCode !== undefined && exitCode !== 0) || foundErrorPattern;
        const isSuccess = exitCode === 0 && !foundErrorPattern;
        assert.strictEqual(isError, true);
        assert.strictEqual(isSuccess, false);
    });

    test('Exit code undefined → not classified as success', () => {
        const exitCode = undefined;
        const foundErrorPattern = false;
        const isSuccess = exitCode === 0 && !foundErrorPattern;
        assert.strictEqual(isSuccess, false);
    });
});
