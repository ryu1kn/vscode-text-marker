
const RemoveAllHighlightsCommand = require('./commands/remove-all-highlights');
const UnhighlightCommand = require('./commands/unhighlight');
const ColourRegistry = require('./colour-registry');
const ConfigStore = require('./config-store');
const Debouncer = require('./debouncer');
const DecorationOperatorFactory = require('./decoration-operator-factory');
const DecorationRefresher = require('./decoration-refresher');
const DecorationRegistry = require('./decoration-registry');
const HighlightCommand = require('./commands/highlight');
const HighlightPatternPicker = require('./highlight-pattern-picker');
const HighlightUsingRegexCommand = require('./commands/highlight-using-regex');
const MatchingModeRegistry = require('./matching-mode-registry');
const ToggleHighlightCommand = require('./commands/toggle-highlight');
const ToggleCaseSensitivityCommand = require('./commands/toggle-case-sensitivity');
const ToggleCaseSensitivityModeCommand = require('./commands/toggle-case-sensitivity-mode');
const ToggleWholeMatchCommand = require('./commands/toggle-whole-match');
const ToggleWholeMatchModeCommand = require('./commands/toggle-whole-match-mode');
const PatternFactory = require('./pattern-factory');
const RegexReader = require('./regex-reader');
const TextDecorator = require('./text-decorator');
const TextEditorFactory = require('./text-editor-factory');
const ToggleCaseSensitivityModeButton = require('./statusbar-buttons/toggle-case-sensitivity-mode');
const ToggleWholeMatchModeButton = require('./statusbar-buttons/toggle-whole-match-mode');
const generateUuid = require('uuid/v4');
const EventEmitter = require('events');
const WindowComponent = require('./editor-components/window');

const BASE_STATUS_BAR_PRIORITY = 100;

class CommandFactory {

    constructor({vscode, logger}) {
        this._vscode = vscode;
        this._logger = logger;
    }

    createToggleHighlightCommand() {
        return new ToggleHighlightCommand({
            decorationOperatorFactory: this._getDecorationOperatorFactory(),
            logger: this._logger,
            patternFactory: this._getPatternFactory(),
            textEditorFactory: this._getTextEditorFactory(),
            windowComponent: this._getWindowComponent()
        });
    }

    createHighlightCommand() {
        return new HighlightCommand({
            decorationOperatorFactory: this._getDecorationOperatorFactory(),
            logger: this._logger,
            patternFactory: this._getPatternFactory(),
            textEditorFactory: this._getTextEditorFactory(),
            windowComponent: this._getWindowComponent()
        });
    }

    createHighlightUsingRegex() {
        return new HighlightUsingRegexCommand({
            decorationOperatorFactory: this._getDecorationOperatorFactory(),
            logger: this._logger,
            regexReader: new RegexReader({
                patternFactory: this._getPatternFactory(),
                vsWindow: this._vscode.window
            }),
            windowComponent: this._getWindowComponent()
        });
    }

    createUnhighlightCommand() {
        return new UnhighlightCommand({
            decorationOperatorFactory: this._getDecorationOperatorFactory(),
            logger: this._logger,
            highlightPatternPicker: this._getHighlightPatternPicker(),
            windowComponent: this._getWindowComponent()
        });
    }

    createRemoveAllHighlightsCommand() {
        return new RemoveAllHighlightsCommand({
            decorationOperatorFactory: this._getDecorationOperatorFactory(),
            logger: this._logger,
            windowComponent: this._getWindowComponent()
        });
    }

    createToggleCaseSensitivityCommand() {
        return new ToggleCaseSensitivityCommand({
            decorationOperatorFactory: this._getDecorationOperatorFactory(),
            logger: this._logger,
            highlightPatternPicker: this._getHighlightPatternPicker(),
            windowComponent: this._getWindowComponent()
        });
    }

    createToggleCaseSensitivityModeCommand() {
        return new ToggleCaseSensitivityModeCommand({
            logger: this._logger,
            matchingModeRegistry: this._getMatchingModeRegistry()
        });
    }

    createToggleWholeMatchCommand() {
        return new ToggleWholeMatchCommand({
            decorationOperatorFactory: this._getDecorationOperatorFactory(),
            logger: this._logger,
            highlightPatternPicker: this._getHighlightPatternPicker(),
            windowComponent: this._getWindowComponent()
        });
    }

    createToggleWholeMatchModeCommand() {
        return new ToggleWholeMatchModeCommand({
            logger: this._logger,
            matchingModeRegistry: this._getMatchingModeRegistry()
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

    _getDecorationOperatorFactory() {
        this._decorationOperatorFactory = this._decorationOperatorFactory || this._createDecorationOperatorFactory();
        return this._decorationOperatorFactory;
    }

    _getConfigStore() {
        this._configStore = this._configStore || new ConfigStore({workspace: this._vscode.workspace});
        return this._configStore;
    }

    _getDecorationRegistry() {
        this._decorationRegistry = this._decorationRegistry || this._createDecorationRegistry();
        return this._decorationRegistry;
    }

    _createDecorationOperatorFactory() {
        return new DecorationOperatorFactory({
            textDecorator: new TextDecorator(),
            decorationRegistry: this._getDecorationRegistry()
        });
    }

    _createDecorationRegistry() {
        const colourRegistry = new ColourRegistry({configStore: this._getConfigStore()});
        return new DecorationRegistry({
            colourRegistry,
            generateUuid,
            window: this._vscode.window
        });
    }

    _getHighlightPatternPicker() {
        this._highlightPatternPicker = this._highlightPatternPicker || this._createHighlightPatternPicker();
        return this._highlightPatternPicker;
    }

    _createHighlightPatternPicker() {
        return new HighlightPatternPicker({
            decorationRegistry: this._getDecorationRegistry(),
            vsWindow: this._vscode.window
        });
    }

    _getMatchingModeRegistry() {
        this._matchingModeRegistry = this._matchingModeRegistry || new MatchingModeRegistry({eventBus: this.getEventBus()});
        return this._matchingModeRegistry;
    }

    _getPatternFactory() {
        this._patternFactory = this._patternFactory || new PatternFactory({matchingModeRegistry: this._getMatchingModeRegistry()});
        return this._patternFactory;
    }

    _getTextEditorFactory() {
        this._textEditorFactory = this._textEditorFactory || this._createTextEditorFactory();
        return this._textEditorFactory;
    }

    _createTextEditorFactory() {
        return new TextEditorFactory({
            VsRange: this._vscode.Range
        });
    }

    _getWindowComponent() {
        this._windowComponent = this._windowComponent || this._createWindowComponent();
        return this._windowComponent;
    }

    _createWindowComponent() {
        return new WindowComponent({
            window: this._vscode.window,
            textEditorFactory: this._getTextEditorFactory()
        });
    }

}

module.exports = CommandFactory;
