import ConfigStore from './config-store';
import ConfigTargetPicker from './config-target-picker';
import Debouncer from './debouncer';
import DecorationOperatorFactory from './decoration/decoration-operator-factory';
import DecorationRegistry from './decoration/decoration-registry';
import DecorationPicker from './decoration/decoration-picker';
import HighlightUsingRegexCommand from './commands/highlight-using-regex';
import MatchingModeRegistry from './matching-mode-registry';
import PatternVariationReader from './pattern/pattern-variation-reader';
import RemoveAllHighlightsCommand from './commands/remove-all-highlights';
import SaveAllHighlightsCommand from './commands/save-all-highlights';
import SavedHighlightsRestorer from './saved-highlights-restorer';
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
import WindowComponent from './vscode/window';
import {EventEmitter} from 'events';
import {Logger} from './Logger';
import {CommandLike} from './vscode/vscode';
import AutoRefreshDecoration from './commands/auto-refresh-decoration';
import AutoRefreshDecorationWithDelay from './commands/auto-refresh-decoration-with-delay';
import {GoToNextHighlightCommand} from './commands/go-to-next-highlight';
import {GoToPreviousHighlightCommand} from './commands/go-to-previous-highlight';
import {AutoTriggerCommand} from './commands/command';

const generateUuid = require('uuid/v4');
const BASE_STATUS_BAR_PRIORITY = 100;

export default class CommandFactory {
    private readonly vscode: any;
    private readonly logger: Logger;
    private eventBus?: EventEmitter;
    private decorationOperatorFactory?: DecorationOperatorFactory;
    private configStore?: ConfigStore;
    private configTargetPicker?: ConfigTargetPicker;
    private decorationRegistry?: DecorationRegistry;
    private decorationPicker?: DecorationPicker;
    private matchingModeRegistry?: MatchingModeRegistry;
    private textLocationRegistry?: TextLocationRegistry;
    private windowComponent?: WindowComponent;

    constructor(vscode: any, logger: Logger) {
        this.vscode = vscode;
        this.logger = logger;
    }

    createToggleHighlightCommand() {
        return new ToggleHighlightCommand(
            this.getMatchingModeRegistry(),
            this.getTextLocationRegistry(),
            this.getDecorationRegistry(),
            this.getWindowComponent()
        );
    }

    createHighlightUsingRegex() {
        return new HighlightUsingRegexCommand(this.getDecorationOperatorFactory(), this.getMatchingModeRegistry(), this.getWindowComponent());
    }

    createUnhighlightCommand() {
        return new UnhighlightCommand(this.getDecorationOperatorFactory(), this.getDecorationPicker());
    }

    createRemoveAllHighlightsCommand() {
        return new RemoveAllHighlightsCommand(this.getDecorationOperatorFactory());
    }

    createSaveAllHighlightsCommand() {
        return new SaveAllHighlightsCommand(this.getConfigStore(), this.getDecorationRegistry());
    }

    createToggleCaseSensitivityCommand() {
        return new ToggleCaseSensitivityCommand(this.getDecorationOperatorFactory(), this.getDecorationPicker());
    }

    createToggleCaseSensitivityModeCommand() {
        return new ToggleCaseSensitivityModeCommand(this.getMatchingModeRegistry());
    }

    createToggleWholeMatchCommand() {
        return new ToggleWholeMatchCommand(this.getDecorationOperatorFactory(), this.getDecorationPicker());
    }

    createToggleWholeMatchModeCommand() {
        return new ToggleWholeMatchModeCommand(this.getMatchingModeRegistry());
    }

    createUpdateHighlightCommand() {
        return new UpdateHighlightCommand(
            this.getDecorationOperatorFactory(),
            this.getDecorationRegistry(),
            new PatternVariationReader(this.getWindowComponent()),
            this.getTextLocationRegistry()
        );
    }

    createGoToNextHighlightCommand() {
        return new GoToNextHighlightCommand(
            this.getMatchingModeRegistry(),
            this.getTextLocationRegistry(),
            this.getDecorationRegistry(),
            this.getWindowComponent()
        );
    }

    createGoToPreviousHighlightCommand() {
        return new GoToPreviousHighlightCommand(
            this.getMatchingModeRegistry(),
            this.getTextLocationRegistry(),
            this.getDecorationRegistry(),
            this.getWindowComponent()
        );
    }

    createAutoRefreshDecoration() {
        const command = new AutoRefreshDecoration(this.getDecorationOperatorFactory());
        return this._wrapCommand(command);
    }

    createAutoRefreshDecorationWithDelay() {
        const command = new AutoRefreshDecorationWithDelay(
            this.getDecorationOperatorFactory(),
            new Debouncer(this.getConfigStore()),
            this.getWindowComponent(),
            this.logger
        );
        return this._wrapCommand(command);
    }

    private _wrapCommand(command: CommandLike) {
        return new AutoTriggerCommand(command, this.logger);
    }

    createSavedHighlightsRestorer() {
        return new SavedHighlightsRestorer(
            this.getConfigStore(),
            this.getDecorationOperatorFactory(),
            this.getMatchingModeRegistry(),
            this.getEventBus()
        );
    }

    createToggleCaseSensitivityModeButton() {
        const alignment = this.vscode.StatusBarAlignment.Right;
        const priority = BASE_STATUS_BAR_PRIORITY + 1;
        return new ToggleCaseSensitivityModeButton(this.getEventBus(), this.vscode.window.createStatusBarItem(alignment, priority));
    }

    createToggleWholeMatchModeButton() {
        const alignment = this.vscode.StatusBarAlignment.Right;
        const priority = BASE_STATUS_BAR_PRIORITY;
        return new ToggleWholeMatchModeButton(this.getEventBus(), this.vscode.window.createStatusBarItem(alignment, priority));
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
        return new ConfigStore(this.vscode.workspace, this.getConfigTargetPicker());
    }

    private getConfigTargetPicker() {
        this.configTargetPicker = this.configTargetPicker || this.createConfigTargetPicker();
        return this.configTargetPicker;
    }

    private createConfigTargetPicker() {
        return new ConfigTargetPicker(this.getWindowComponent());
    }

    private getDecorationRegistry() {
        this.decorationRegistry = this.decorationRegistry || this.createDecorationRegistry();
        return this.decorationRegistry;
    }

    private createDecorationOperatorFactory() {
        return new DecorationOperatorFactory(
            this.getDecorationRegistry(),
            this.getTextLocationRegistry(),
            this.getWindowComponent()
        );
    }

    private createDecorationRegistry() {
        const configStore = this.getConfigStore();
        return new DecorationRegistry(configStore, this.vscode.window, generateUuid);
    }

    private getDecorationPicker() {
        this.decorationPicker = this.decorationPicker || this.createDecorationPicker();
        return this.decorationPicker;
    }

    private createDecorationPicker() {
        return new DecorationPicker(this.getDecorationRegistry(), this.getWindowComponent());
    }

    private getMatchingModeRegistry() {
        this.matchingModeRegistry = this.matchingModeRegistry || this.createMatchingModeRegistry();
        return this.matchingModeRegistry;
    }

    private createMatchingModeRegistry() {
        const configStore = this.getConfigStore();
        return new MatchingModeRegistry(configStore.enableIgnoreCase, configStore.enableWholeMatch, this.getEventBus());
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
        return new WindowComponent(this.vscode.window);
    }

}
