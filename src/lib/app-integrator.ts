import * as Const from './const';
import CommandFactory from './command-factory';
import {ExtensionContextLike} from './vscode/vscode';
import {Logger} from './Logger';
import CommandComponent, {CommandItem} from './vscode/command';

export default class AppIntegrator {
    private readonly commandFactory: CommandFactory;
    private readonly vscode: any;
    private readonly commandComponent: CommandComponent;

    static create(vscode: any, logger: Logger) {
        const commandFactory = new CommandFactory(vscode, logger);
        const commandComponent = new CommandComponent(vscode.commands, logger);
        return new AppIntegrator(commandFactory, vscode, commandComponent);
    }

    constructor(commandFactory: CommandFactory, vscode: any, commandComponent: CommandComponent) {
        this.commandFactory = commandFactory;
        this.vscode = vscode;
        this.commandComponent = commandComponent;
    }

    integrate(context: ExtensionContextLike) {
        this.registerCommands(context);
        this.registerEventListeners(context);
        this.vscode.workspace.onDidChangeConfiguration((event: import('vscode').ConfigurationChangeEvent) => {
            const styleKeys = ['borderWidth', 'borderStyle', 'borderRadius', 'defaultHighlightOpacity',
                'autoSelectDistinctiveTextColor', 'useHighlightColorOnRuler'];
            if (styleKeys.some(key => event.affectsConfiguration(`${Const.EXTENSION_ID}.${key}`))) {
                this.commandFactory.getDecorationOperatorFactory().createForVisibleEditors().refreshStyles();
            }
        }, undefined, context.subscriptions);
        this.prepareExtensionEventsDrivenItems();
        this.broadcastReady();
    }

    private registerEventListeners(context: ExtensionContextLike) {
        const autoRefreshDecoration = this.commandFactory.createAutoRefreshDecoration();
        this.vscode.window.onDidChangeActiveTextEditor(
            autoRefreshDecoration.execute, autoRefreshDecoration, context.subscriptions);

        const autoRefreshDecorationWithDelay = this.commandFactory.createAutoRefreshDecorationWithDelay();
        this.vscode.workspace.onDidChangeTextDocument(
            autoRefreshDecorationWithDelay.execute, autoRefreshDecorationWithDelay, context.subscriptions);
    }

    private registerCommands(context: ExtensionContextLike) {
        this.getCommands().forEach(command => {
            const disposable = this.commandComponent.registerCommand(command);
            context.subscriptions.push(disposable);
        });
    }

    private prepareExtensionEventsDrivenItems() {
        this.commandFactory.createSavedHighlightsRestorer();
        if (!this.commandFactory.getConfigStore().hideStatusBarItems) {
            this.commandFactory.createToggleCaseSensitivityModeButton();
            this.commandFactory.createToggleWholeMatchModeButton();
        }
    }

    private broadcastReady() {
        this.commandFactory.getEventBus().emit(Const.Event.EXTENSION_READY);
    }

    private getCommands(): CommandItem[] {
        const factory = this.commandFactory;
        return [
            {
                name: `${Const.EXTENSION_ID}.highlightCyan`,
                command: factory.createSetHighlightColourCommand('#00BCD4'),
                type: 'TEXT_EDITOR'
            },
            {
                name: `${Const.EXTENSION_ID}.highlightBlue`,
                command: factory.createSetHighlightColourCommand('#5C8DFF'),
                type: 'TEXT_EDITOR'
            },
            {
                name: `${Const.EXTENSION_ID}.highlightYellow`,
                command: factory.createSetHighlightColourCommand('#FFEB3B'),
                type: 'TEXT_EDITOR'
            },
            {
                name: `${Const.EXTENSION_ID}.highlightPurple`,
                command: factory.createSetHighlightColourCommand('#AB47BC'),
                type: 'TEXT_EDITOR'
            },
            {
                name: `${Const.EXTENSION_ID}.highlightGreen`,
                command: factory.createSetHighlightColourCommand('#4CAF50'),
                type: 'TEXT_EDITOR'
            },
            {
                name: `${Const.EXTENSION_ID}.highlightRed`,
                command: factory.createSetHighlightColourCommand('#FF5252'),
                type: 'TEXT_EDITOR'
            },
            {
                name: `${Const.EXTENSION_ID}.highlightPink`,
                command: factory.createSetHighlightColourCommand('#FF80AB'),
                type: 'TEXT_EDITOR'
            },
            {
                name: `${Const.EXTENSION_ID}.highlightLime`,
                command: factory.createSetHighlightColourCommand('#CDDC39'),
                type: 'TEXT_EDITOR'
            },
            {
                name: `${Const.EXTENSION_ID}.highlightTeal`,
                command: factory.createSetHighlightColourCommand('#26A69A'),
                type: 'TEXT_EDITOR'
            },
            {
                name: `${Const.EXTENSION_ID}.highlightSilver`,
                command: factory.createSetHighlightColourCommand('#B0BEC5'),
                type: 'TEXT_EDITOR'
            },
            {
                name: `${Const.EXTENSION_ID}.highlightUsingRegex`,
                command: factory.createHighlightUsingRegex(),
                type: 'GENERAL'
            }, {
                name: `${Const.EXTENSION_ID}.clearAllHighlight`,
                command: factory.createRemoveAllHighlightsCommand(),
                type: 'GENERAL'
            }, {
                name: `${Const.EXTENSION_ID}.saveAllHighlights`,
                command: factory.createSaveAllHighlightsCommand(),
                type: 'GENERAL'
            }, {
                name: `${Const.EXTENSION_ID}.toggleCaseSensitivity`,
                command: factory.createToggleCaseSensitivityCommand(),
                type: 'GENERAL'
            }, {
                name: `${Const.EXTENSION_ID}.toggleModeForCaseSensitivity`,
                command: factory.createToggleCaseSensitivityModeCommand(),
                type: 'GENERAL'
            }, {
                name: `${Const.EXTENSION_ID}.toggleWholeMatch`,
                command: factory.createToggleWholeMatchCommand(),
                type: 'GENERAL'
            }, {
                name: `${Const.EXTENSION_ID}.toggleModeForWholeMatch`,
                command: factory.createToggleWholeMatchModeCommand(),
                type: 'GENERAL'
            }, {
                name: `${Const.EXTENSION_ID}.unhighlight`,
                command: factory.createUnhighlightCommand(),
                type: 'GENERAL'
            }, {
                name: `${Const.EXTENSION_ID}.goToNextHighlight`,
                command: factory.createGoToNextHighlightCommand(),
                type: 'TEXT_EDITOR'
            }, {
                name: `${Const.EXTENSION_ID}.goToPreviousHighlight`,
                command: factory.createGoToPreviousHighlightCommand(),
                type: 'TEXT_EDITOR'
            }, {
                name: `${Const.EXTENSION_ID}.toggleHighlight`,
                command: factory.createToggleHighlightCommand(),
                type: 'TEXT_EDITOR'
            }, {
                name: `${Const.EXTENSION_ID}.updateHighlight`,
                command: factory.createUpdateHighlightCommand(),
                type: 'TEXT_EDITOR'
            }
        ];
    }
}
