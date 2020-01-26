import * as vscode from 'vscode'
const debounce = require('lodash.debounce')

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
    vscode.window.onDidChangeTextEditorSelection(
        debounce(function (e: vscode.TextEditorSelectionChangeEvent) {
            let editor = vscode.window.activeTextEditor

            if (
                getCurrentHLConfig() && // hl is on
                (editor && !editor.selection.isEmpty) && // something is selected
                (e && e.kind == 2) // selected by mouse
            ) {
                vscode.commands.executeCommand('textmarker.toggleHighlight')
            }
        }, 300)
    )

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
        item.text = '$(symbol-keyword)'
        item.tooltip = 'TextMarker Toggle: Auto Highlight Enabled'
    }
    else {
        item.text = '$(symbol-color)'
        item.tooltip = 'TextMarker Toggle: Auto Highlight Disabled'
    }

    item.show()
}
