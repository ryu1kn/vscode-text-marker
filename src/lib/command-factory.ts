import ColourRegistry from './colour-registry';
import CommandWrapper from './command-wrapper';
import ConfigStore from './config-store';
import ConfigTargetPicker from './config-target-picker';
import Debouncer from './debouncer';
import DecorationOperatorFactory from './decoration-operator-factory';
import DecorationRefresher from './decoration-refresher';
import DecorationRegistry from './decoration-registry';
import HighlightPatternPicker from './highlight-pattern-picker';
import HighlightUsingRegexCommand from './commands/highlight-using-regex';
import MatchingModeRegistry from './matching-mode-registry';
import PatternFactory from './pattern-factory';
import PatternVariationReader from './pattern-variation-reader';
import RegexReader from './regex-reader';
import RemoveAllHighlightsCommand from './commands/remove-all-highlights';
import SaveAllHighlightsCommand from './commands/save-all-highlights';
import SavedHighlightsRestorer from './saved-highlights-restorer';
import TextDecorator from './text-decorator';
import TextEditorFactory from './text-editor-factory';
import TextLocationRegistry from './text-location-registry';
import ToggleCaseSensitivityCommand from './commands/toggle-case-sensitivity';
import ToggleCaseSensitivityModeButton from './statusbar-buttons/toggle-case-sensitivity-mode';
import ToggleCaseSensitivityModeCommand from './commands/toggle-case-sensitivity-mode';
import ToggleHighlightCommand from './commands/toggle-highlight';
import ToggleWholeMatchCommand from './commands/toggle-whole-match';
import ToggleWholeMatchModeButton from './statusbar-buttons/toggle-whole-match-mode';
import ToggleWholeMatchModeCommand from './commands/toggle-whole-match-mode';
import UnhighlightCommand from './commands/unhighlight';
import UpdateHighlightCommand from './commands/update-highlight';
import WindowComponent from './editor-components/window';

const generateUuid = require('uuid/v4');
const EventEmitter = require('events');
const BASE_STATUS_BAR_PRIORITY = 100;

export default class CommandFactory {
    private readonly vscode: any;
    private readonly logger: any;
    private eventBus: any;
    private decorationOperatorFactory: any;
    private configStore: any;
    private configTargetPicker: any;
    private decorationRegistry: any;
    private highlightPatternPicker: any;
    private matchingModeRegistry: any;
    private patternFactory: any;
    private textEditorFactory: any;
    private textLocationRegistry: any;
    private windowComponent: any;

    constructor({vscode, logger}) {
        this.vscode = vscode;
        this.logger = logger;
    }

    createToggleHighlightCommand() {
        const command = new ToggleHighlightCommand({
            decorationOperatorFactory: this.getDecorationOperatorFactory(),
            patternFactory: this.getPatternFactory(),
            textEditorFactory: this.getTextEditorFactory(),
            textLocationRegistry: this.getTextLocationRegistry()
        });
        return this._wrapCommand(command);
    }

    createHighlightUsingRegex() {
        const command = new HighlightUsingRegexCommand({
            decorationOperatorFactory: this.getDecorationOperatorFactory(),
            regexReader: new RegexReader({
                patternFactory: this.getPatternFactory(),
                windowComponent: this.getWindowComponent()
            })
        });
        return this._wrapCommand(command);
    }

    createUnhighlightCommand() {
        const command = new UnhighlightCommand({
            decorationOperatorFactory: this.getDecorationOperatorFactory(),
            highlightPatternPicker: this.getHighlightPatternPicker()
        });
        return this._wrapCommand(command);
    }

    createRemoveAllHighlightsCommand() {
        const command = new RemoveAllHighlightsCommand({
            decorationOperatorFactory: this.getDecorationOperatorFactory()
        });
        return this._wrapCommand(command);
    }

    createSaveAllHighlightsCommand() {
        const command = new SaveAllHighlightsCommand({
            configStore: this.getConfigStore(),
            configTargetPicker: this.getConfigTargetPicker(),
            decorationRegistry: this.getDecorationRegistry()
        });
        return this._wrapCommand(command);
    }

    createToggleCaseSensitivityCommand() {
        const command = new ToggleCaseSensitivityCommand({
            decorationOperatorFactory: this.getDecorationOperatorFactory(),
            highlightPatternPicker: this.getHighlightPatternPicker()
        });
        return this._wrapCommand(command);
    }

    createToggleCaseSensitivityModeCommand() {
        const command = new ToggleCaseSensitivityModeCommand({
            matchingModeRegistry: this.getMatchingModeRegistry()
        });
        return this._wrapCommand(command);
    }

    createToggleWholeMatchCommand() {
        const command = new ToggleWholeMatchCommand({
            decorationOperatorFactory: this.getDecorationOperatorFactory(),
            highlightPatternPicker: this.getHighlightPatternPicker()
        });
        return this._wrapCommand(command);
    }

    createToggleWholeMatchModeCommand() {
        const command = new ToggleWholeMatchModeCommand({
            matchingModeRegistry: this.getMatchingModeRegistry()
        });
        return this._wrapCommand(command);
    }

    createUpdateHighlightCommand() {
        const command = new UpdateHighlightCommand({
            decorationOperatorFactory: this.getDecorationOperatorFactory(),
            decorationRegistry: this.getDecorationRegistry(),
            patternVariationReader: new PatternVariationReader({
                windowComponent: this.getWindowComponent()
            }),
            textEditorFactory: this.getTextEditorFactory(),
            textLocationRegistry: this.getTextLocationRegistry()
        });
        return this._wrapCommand(command);
    }

    private _wrapCommand(command) {
        return new CommandWrapper({
            command,
            logger: this.logger
        });
    }

    createDecorationRefresher() {
        return new DecorationRefresher({
            debouncer: new Debouncer({configStore: this.getConfigStore()}),
            decorationOperatorFactory: this.getDecorationOperatorFactory(),
            logger: this.logger,
            textEditorFactory: this.getTextEditorFactory(),
            windowComponent: this.getWindowComponent()
        });
    }

    createSavedHighlightsRestorer() {
        return new SavedHighlightsRestorer({
            configStore: this.getConfigStore(),
            decorationOperatorFactory: this.getDecorationOperatorFactory(),
            eventBus: this.getEventBus(),
            patternFactory: this.getPatternFactory()
        });
    }

    createToggleCaseSensitivityModeButton() {
        const alignment = this.vscode.StatusBarAlignment.Right;
        const priority = BASE_STATUS_BAR_PRIORITY + 1;
        return new ToggleCaseSensitivityModeButton({
            eventBus: this.getEventBus(),
            statusBarItem: this.vscode.window.createStatusBarItem(alignment, priority)
        });
    }

    createToggleWholeMatchModeButton() {
        const alignment = this.vscode.StatusBarAlignment.Right;
        const priority = BASE_STATUS_BAR_PRIORITY;
        return new ToggleWholeMatchModeButton({
            eventBus: this.getEventBus(),
            statusBarItem: this.vscode.window.createStatusBarItem(alignment, priority)
        });
    }

    getEventBus() {
        this.eventBus = this.eventBus || new EventEmitter();
        return this.eventBus;
    }

    private getDecorationOperatorFactory() {
        this.decorationOperatorFactory = this.decorationOperatorFactory || this.createDecorationOperatorFactory();
        return this.decorationOperatorFactory;
    }

    private getConfigStore() {
        this.configStore = this.configStore || this.createConfigStore();
        return this.configStore;
    }

    private createConfigStore() {
        return new ConfigStore({
            workspace: this.vscode.workspace,
            configTargetPicker: this.getConfigTargetPicker()
        });
    }

    private getConfigTargetPicker() {
        this.configTargetPicker = this.configTargetPicker || this.createConfigTargetPicker();
        return this.configTargetPicker;
    }

    private createConfigTargetPicker() {
        return new ConfigTargetPicker({windowComponent: this.getWindowComponent()});
    }

    private getDecorationRegistry() {
        this.decorationRegistry = this.decorationRegistry || this.createDecorationRegistry();
        return this.decorationRegistry;
    }

    private createDecorationOperatorFactory() {
        return new DecorationOperatorFactory({
            textDecorator: new TextDecorator({
                textLocationRegistry: this.getTextLocationRegistry()
            }),
            decorationRegistry: this.getDecorationRegistry(),
            windowComponent: this.getWindowComponent()
        });
    }

    private createDecorationRegistry() {
        const configStore = this.getConfigStore();
        const colourRegistry = new ColourRegistry({configStore});
        return new DecorationRegistry({
            colourRegistry,
            configStore,
            generateUuid,
            window: this.vscode.window
        });
    }

    private getHighlightPatternPicker() {
        this.highlightPatternPicker = this.highlightPatternPicker || this.createHighlightPatternPicker();
        return this.highlightPatternPicker;
    }

    private createHighlightPatternPicker() {
        return new HighlightPatternPicker({
            decorationRegistry: this.getDecorationRegistry(),
            windowComponent: this.getWindowComponent()
        });
    }

    private getMatchingModeRegistry() {
        this.matchingModeRegistry = this.matchingModeRegistry || this.createMatchingModeRegistry();
        return this.matchingModeRegistry;
    }

    private createMatchingModeRegistry() {
        const configStore = this.getConfigStore();
        return new MatchingModeRegistry({
            eventBus: this.getEventBus(),
            ignoreCase: configStore.get('enableIgnoreCase'),
            wholeMatch: configStore.get('enableWholeMatch')
        });
    }

    private getPatternFactory() {
        this.patternFactory = this.patternFactory || new PatternFactory({matchingModeRegistry: this.getMatchingModeRegistry()});
        return this.patternFactory;
    }

    private getTextEditorFactory() {
        this.textEditorFactory = this.textEditorFactory || this.createTextEditorFactory();
        return this.textEditorFactory;
    }

    private createTextEditorFactory() {
        return new TextEditorFactory({
            VsRange: this.vscode.Range
        });
    }

    private getTextLocationRegistry() {
        this.textLocationRegistry = this.textLocationRegistry || new TextLocationRegistry();
        return this.textLocationRegistry;
    }

    private getWindowComponent() {
        this.windowComponent = this.windowComponent || this.createWindowComponent();
        return this.windowComponent;
    }

    private createWindowComponent() {
        return new WindowComponent({
            window: this.vscode.window,
            textEditorFactory: this.getTextEditorFactory()
        });
    }

}
