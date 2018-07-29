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
    private readonly _vscode: any;
    private readonly _logger: any;
    private _eventBus: any;
    private _decorationOperatorFactory: any;
    private _configStore: any;
    private _configTargetPicker: any;
    private _decorationRegistry: any;
    private _highlightPatternPicker: any;
    private _matchingModeRegistry: any;
    private _patternFactory: any;
    private _textEditorFactory: any;
    private _textLocationRegistry: any;
    private _windowComponent: any;

    constructor({vscode, logger}) {
        this._vscode = vscode;
        this._logger = logger;
    }

    createToggleHighlightCommand() {
        const command = new ToggleHighlightCommand({
            decorationOperatorFactory: this._getDecorationOperatorFactory(),
            patternFactory: this._getPatternFactory(),
            textEditorFactory: this._getTextEditorFactory(),
            textLocationRegistry: this._getTextLocationRegistry()
        });
        return this._wrapCommand(command);
    }

    createHighlightUsingRegex() {
        const command = new HighlightUsingRegexCommand({
            decorationOperatorFactory: this._getDecorationOperatorFactory(),
            regexReader: new RegexReader({
                patternFactory: this._getPatternFactory(),
                windowComponent: this._getWindowComponent()
            })
        });
        return this._wrapCommand(command);
    }

    createUnhighlightCommand() {
        const command = new UnhighlightCommand({
            decorationOperatorFactory: this._getDecorationOperatorFactory(),
            highlightPatternPicker: this._getHighlightPatternPicker()
        });
        return this._wrapCommand(command);
    }

    createRemoveAllHighlightsCommand() {
        const command = new RemoveAllHighlightsCommand({
            decorationOperatorFactory: this._getDecorationOperatorFactory()
        });
        return this._wrapCommand(command);
    }

    createSaveAllHighlightsCommand() {
        const command = new SaveAllHighlightsCommand({
            configStore: this._getConfigStore(),
            configTargetPicker: this._getConfigTargetPicker(),
            decorationRegistry: this._getDecorationRegistry()
        });
        return this._wrapCommand(command);
    }

    createToggleCaseSensitivityCommand() {
        const command = new ToggleCaseSensitivityCommand({
            decorationOperatorFactory: this._getDecorationOperatorFactory(),
            highlightPatternPicker: this._getHighlightPatternPicker()
        });
        return this._wrapCommand(command);
    }

    createToggleCaseSensitivityModeCommand() {
        const command = new ToggleCaseSensitivityModeCommand({
            matchingModeRegistry: this._getMatchingModeRegistry()
        });
        return this._wrapCommand(command);
    }

    createToggleWholeMatchCommand() {
        const command = new ToggleWholeMatchCommand({
            decorationOperatorFactory: this._getDecorationOperatorFactory(),
            highlightPatternPicker: this._getHighlightPatternPicker()
        });
        return this._wrapCommand(command);
    }

    createToggleWholeMatchModeCommand() {
        const command = new ToggleWholeMatchModeCommand({
            matchingModeRegistry: this._getMatchingModeRegistry()
        });
        return this._wrapCommand(command);
    }

    createUpdateHighlightCommand() {
        const command = new UpdateHighlightCommand({
            decorationOperatorFactory: this._getDecorationOperatorFactory(),
            decorationRegistry: this._getDecorationRegistry(),
            patternVariationReader: new PatternVariationReader({
                windowComponent: this._getWindowComponent()
            }),
            textEditorFactory: this._getTextEditorFactory(),
            textLocationRegistry: this._getTextLocationRegistry()
        });
        return this._wrapCommand(command);
    }

    private _wrapCommand(command) {
        return new CommandWrapper({
            command,
            logger: this._logger
        });
    }

    createDecorationRefresher() {
        return new DecorationRefresher({
            debouncer: new Debouncer({configStore: this._getConfigStore()}),
            decorationOperatorFactory: this._getDecorationOperatorFactory(),
            logger: this._logger,
            textEditorFactory: this._getTextEditorFactory(),
            windowComponent: this._getWindowComponent()
        });
    }

    createSavedHighlightsRestorer() {
        return new SavedHighlightsRestorer({
            configStore: this._getConfigStore(),
            decorationOperatorFactory: this._getDecorationOperatorFactory(),
            eventBus: this.getEventBus(),
            patternFactory: this._getPatternFactory()
        });
    }

    createToggleCaseSensitivityModeButton() {
        const alignment = this._vscode.StatusBarAlignment.Right;
        const priority = BASE_STATUS_BAR_PRIORITY + 1;
        return new ToggleCaseSensitivityModeButton({
            eventBus: this.getEventBus(),
            statusBarItem: this._vscode.window.createStatusBarItem(alignment, priority)
        });
    }

    createToggleWholeMatchModeButton() {
        const alignment = this._vscode.StatusBarAlignment.Right;
        const priority = BASE_STATUS_BAR_PRIORITY;
        return new ToggleWholeMatchModeButton({
            eventBus: this.getEventBus(),
            statusBarItem: this._vscode.window.createStatusBarItem(alignment, priority)
        });
    }

    getEventBus() {
        this._eventBus = this._eventBus || new EventEmitter();
        return this._eventBus;
    }

    private _getDecorationOperatorFactory() {
        this._decorationOperatorFactory = this._decorationOperatorFactory || this._createDecorationOperatorFactory();
        return this._decorationOperatorFactory;
    }

    private _getConfigStore() {
        this._configStore = this._configStore || this._createConfigStore();
        return this._configStore;
    }

    private _createConfigStore() {
        return new ConfigStore({
            workspace: this._vscode.workspace,
            configTargetPicker: this._getConfigTargetPicker()
        });
    }

    private _getConfigTargetPicker() {
        this._configTargetPicker = this._configTargetPicker || this._createConfigTargetPicker();
        return this._configTargetPicker;
    }

    private _createConfigTargetPicker() {
        return new ConfigTargetPicker({windowComponent: this._getWindowComponent()});
    }

    private _getDecorationRegistry() {
        this._decorationRegistry = this._decorationRegistry || this._createDecorationRegistry();
        return this._decorationRegistry;
    }

    private _createDecorationOperatorFactory() {
        return new DecorationOperatorFactory({
            textDecorator: new TextDecorator({
                textLocationRegistry: this._getTextLocationRegistry()
            }),
            decorationRegistry: this._getDecorationRegistry(),
            windowComponent: this._getWindowComponent()
        });
    }

    private _createDecorationRegistry() {
        const configStore = this._getConfigStore();
        const colourRegistry = new ColourRegistry({configStore});
        return new DecorationRegistry({
            colourRegistry,
            configStore,
            generateUuid,
            window: this._vscode.window
        });
    }

    private _getHighlightPatternPicker() {
        this._highlightPatternPicker = this._highlightPatternPicker || this._createHighlightPatternPicker();
        return this._highlightPatternPicker;
    }

    private _createHighlightPatternPicker() {
        return new HighlightPatternPicker({
            decorationRegistry: this._getDecorationRegistry(),
            windowComponent: this._getWindowComponent()
        });
    }

    private _getMatchingModeRegistry() {
        this._matchingModeRegistry = this._matchingModeRegistry || this._createMatchingModeRegistry();
        return this._matchingModeRegistry;
    }

    private _createMatchingModeRegistry() {
        const configStore = this._getConfigStore();
        return new MatchingModeRegistry({
            eventBus: this.getEventBus(),
            ignoreCase: configStore.get('enableIgnoreCase'),
            wholeMatch: configStore.get('enableWholeMatch')
        });
    }

    private _getPatternFactory() {
        this._patternFactory = this._patternFactory || new PatternFactory({matchingModeRegistry: this._getMatchingModeRegistry()});
        return this._patternFactory;
    }

    private _getTextEditorFactory() {
        this._textEditorFactory = this._textEditorFactory || this._createTextEditorFactory();
        return this._textEditorFactory;
    }

    private _createTextEditorFactory() {
        return new TextEditorFactory({
            VsRange: this._vscode.Range
        });
    }

    private _getTextLocationRegistry() {
        this._textLocationRegistry = this._textLocationRegistry || new TextLocationRegistry();
        return this._textLocationRegistry;
    }

    private _getWindowComponent() {
        this._windowComponent = this._windowComponent || this._createWindowComponent();
        return this._windowComponent;
    }

    private _createWindowComponent() {
        return new WindowComponent({
            window: this._vscode.window,
            textEditorFactory: this._getTextEditorFactory()
        });
    }

}
