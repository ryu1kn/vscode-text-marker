
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
const SelectedTextFinder = require('./selected-text-finder');
const TextDecorator = require('./text-decorator');
const ToggleCaseSensitivityModeButton = require('./toggle-case-sensitivity-mode-button');
const ToggleWholeMatchModeButton = require('./toggle-whole-match-mode-button');
const generateUuid = require('uuid/v4');
const EventEmitter = require('events');

const BASE_STATUS_BAR_PRIORITY = 100;

class CommandFactory {

    constructor({vscode, logger}) {
        this._vscode = vscode;
        this._logger = logger;
    }

    createToggleHighlightCommand() {
        return new ToggleHighlightCommand({
            decorationOperatorFactory: this._getDecorationOperatorFactory(),
            selectedTextFinder: this._getSelectedTextFinder(),
            logger: this._logger,
            vsWindow: this._vscode.window,
            patternFactory: this._getPatternFactory()
        });
    }

    createHighlightCommand() {
        return new HighlightCommand({
            decorationOperatorFactory: this._getDecorationOperatorFactory(),
            selectedTextFinder: this._getSelectedTextFinder(),
            logger: this._logger,
            vsWindow: this._vscode.window,
            patternFactory: this._getPatternFactory()
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
            vsWindow: this._vscode.window
        });
    }

    createUnhighlightCommand() {
        return new UnhighlightCommand({
            decorationOperatorFactory: this._getDecorationOperatorFactory(),
            logger: this._logger,
            vsWindow: this._vscode.window,
            highlightPatternPicker: this._getHighlightPatternPicker()
        });
    }

    createRemoveAllHighlightsCommand() {
        return new RemoveAllHighlightsCommand({
            decorationOperatorFactory: this._getDecorationOperatorFactory(),
            logger: this._logger,
            vsWindow: this._vscode.window
        });
    }

    createToggleCaseSensitivityCommand() {
        return new ToggleCaseSensitivityCommand({
            decorationOperatorFactory: this._getDecorationOperatorFactory(),
            logger: this._logger,
            vsWindow: this._vscode.window,
            highlightPatternPicker: this._getHighlightPatternPicker()
        });
    }

    createToggleCaseSensitivityModeCommand() {
        return new ToggleCaseSensitivityModeCommand({
            logger: this._logger,
            vsWindow: this._vscode.window,
            matchingModeRegistry: this._getMatchingModeRegistry()
        });
    }

    createToggleWholeMatchCommand() {
        return new ToggleWholeMatchCommand({
            decorationOperatorFactory: this._getDecorationOperatorFactory(),
            logger: this._logger,
            vsWindow: this._vscode.window,
            highlightPatternPicker: this._getHighlightPatternPicker()
        });
    }

    createToggleWholeMatchModeCommand() {
        return new ToggleWholeMatchModeCommand({
            logger: this._logger,
            vsWindow: this._vscode.window,
            matchingModeRegistry: this._getMatchingModeRegistry()
        });
    }

    createDecorationRefresher() {
        return new DecorationRefresher({
            debouncer: new Debouncer({configStore: this._getConfigStore()}),
            decorationOperatorFactory: this._getDecorationOperatorFactory(),
            logger: this._logger,
            vsWindow: this._vscode.window
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

    _getSelectedTextFinder() {
        this._selectedTextFinder = this._selectedTextFinder || new SelectedTextFinder();
        return this._selectedTextFinder;
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
            textDecorator: new TextDecorator({VsRange: this._vscode.Range}),
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

}

module.exports = CommandFactory;
