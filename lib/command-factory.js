
const ColourRegistry = require('./colour-registry');
const CommandWrapper = require('./command-wrapper');
const ConfigStore = require('./config-store');
const ConfigTargetPicker = require('./config-target-picker');
const Debouncer = require('./debouncer');
const DecorationOperatorFactory = require('./decoration-operator-factory');
const DecorationRefresher = require('./decoration-refresher');
const DecorationRegistry = require('./decoration-registry');
const EventEmitter = require('events');
const HighlightPatternPicker = require('./highlight-pattern-picker');
const HighlightUsingRegexCommand = require('./commands/highlight-using-regex');
const MatchingModeRegistry = require('./matching-mode-registry');
const PatternFactory = require('./pattern-factory');
const PatternVariationReader = require('./pattern-variation-reader');
const RegexReader = require('./regex-reader');
const RemoveAllHighlightsCommand = require('./commands/remove-all-highlights');
const SaveAllHighlightsCommand = require('./commands/save-all-highlights');
const SavedHighlightsRestorer = require('./saved-highlights-restorer');
const TextDecorator = require('./text-decorator');
const TextEditorFactory = require('./text-editor-factory');
const TextLocationRegistry = require('./text-location-registry');
const ToggleCaseSensitivityCommand = require('./commands/toggle-case-sensitivity');
const ToggleCaseSensitivityModeButton = require('./statusbar-buttons/toggle-case-sensitivity-mode');
const ToggleCaseSensitivityModeCommand = require('./commands/toggle-case-sensitivity-mode');
const ToggleHighlightCommand = require('./commands/toggle-highlight');
const ToggleWholeMatchCommand = require('./commands/toggle-whole-match');
const ToggleWholeMatchModeButton = require('./statusbar-buttons/toggle-whole-match-mode');
const ToggleWholeMatchModeCommand = require('./commands/toggle-whole-match-mode');
const UnhighlightCommand = require('./commands/unhighlight');
const UpdateHighlightCommand = require('./commands/update-highlight');
const WindowComponent = require('./editor-components/window');
const generateUuid = require('uuid/v4');

const BASE_STATUS_BAR_PRIORITY = 100;

class CommandFactory {

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

    _wrapCommand(command) {
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

    _getDecorationOperatorFactory() {
        this._decorationOperatorFactory = this._decorationOperatorFactory || this._createDecorationOperatorFactory();
        return this._decorationOperatorFactory;
    }

    _getConfigStore() {
        this._configStore = this._configStore || this._createConfigStore();
        return this._configStore;
    }

    _createConfigStore() {
        return new ConfigStore({
            workspace: this._vscode.workspace,
            configTargetPicker: this._getConfigTargetPicker()
        });
    }

    _getConfigTargetPicker() {
        this._configTargetPicker = this._configTargetPicker || this._createConfigTargetPicker();
        return this._configTargetPicker;
    }

    _createConfigTargetPicker() {
        return new ConfigTargetPicker({windowComponent: this._getWindowComponent()});
    }

    _getDecorationRegistry() {
        this._decorationRegistry = this._decorationRegistry || this._createDecorationRegistry();
        return this._decorationRegistry;
    }

    _createDecorationOperatorFactory() {
        return new DecorationOperatorFactory({
            textDecorator: new TextDecorator({
                textLocationRegistry: this._getTextLocationRegistry()
            }),
            decorationRegistry: this._getDecorationRegistry(),
            windowComponent: this._getWindowComponent()
        });
    }

    _createDecorationRegistry() {
        const configStore = this._getConfigStore();
        const colourRegistry = new ColourRegistry({configStore});
        return new DecorationRegistry({
            colourRegistry,
            configStore,
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
            windowComponent: this._getWindowComponent()
        });
    }

    _getMatchingModeRegistry() {
        this._matchingModeRegistry = this._matchingModeRegistry || this._createMatchingModeRegistry();
        return this._matchingModeRegistry;
    }

    _createMatchingModeRegistry() {
        const configStore = this._getConfigStore();
        return new MatchingModeRegistry({
            eventBus: this.getEventBus(),
            ignoreCase: configStore.get('enableIgnoreCase'),
            wholeMatch: configStore.get('enableWholeMatch')
        });
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

    _getTextLocationRegistry() {
        this._textLocationRegistry = this._textLocationRegistry || new TextLocationRegistry();
        return this._textLocationRegistry;
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
