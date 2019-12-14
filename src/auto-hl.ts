import * as vscode from 'vscode'

export function initAutoHighlight(context: vscode.ExtensionContext) {
    // command
    const AutoHLCommand = 'textmarker.toggleAutoHighlight'
    context.subscriptions.push(vscode.commands.registerCommand(AutoHLCommand, () => {
        vscode.workspace.getConfiguration().update('textmarker.enableAutoHighlight', !getCurrentHLConfig(), true)
    }))

    // statusbar
    let AutoHLStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)
    AutoHLStatusBar.command = AutoHLCommand
    context.subscriptions.push(AutoHLStatusBar)
    updateStatusBarItem(AutoHLStatusBar, getCurrentHLConfig())

    // selection
    vscode.window.onDidChangeTextEditorSelection((e: vscode.TextEditorSelectionChangeEvent) => {
        let editor = vscode.window.activeTextEditor

        if (getCurrentHLConfig() && editor && !editor.selection.isEmpty && e && e.kind == 2) {
            vscode.commands.executeCommand('textmarker.toggleHighlight')
        }
    })

    // update on config change
    vscode.workspace.onDidChangeConfiguration((e: any) => {
        if (e.affectsConfiguration('textmarker')) {
            updateStatusBarItem(AutoHLStatusBar, getCurrentHLConfig())
        }
    })
}

function getCurrentHLConfig() {
    return vscode.workspace.getConfiguration('textmarker').enableAutoHighlight
}

function updateStatusBarItem(item: vscode.StatusBarItem, type: any) {
    if (type) {
        item.text = '$(circle-filled)'
        item.tooltip = 'TextMarker: Auto Highlight Enabled'
    } else {
        item.text = '$(circle-outline)'
        item.tooltip = 'TextMarker: Toggle Auto Highlight Disabled'
    }

    item.show()
}
