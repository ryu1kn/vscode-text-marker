import * as assert from 'assert';
import {EventEmitter} from 'events';
import * as O from 'fp-ts/lib/Option';
import ConfigStore from '../../lib/config-store';
import MatchingModeRegistry from '../../lib/matching-mode-registry';
import PatternFactory from '../../lib/pattern/pattern-factory';
import TextLocationRegistry from '../../lib/text-location-registry';
import DecorationRegistry from '../../lib/decoration/decoration-registry';
import {DecorationTypeRegistry} from '../../lib/decoration/decoration-type-registry';
import TextDecorator from '../../lib/decoration/text-decorator';
import DecorationOperator from '../../lib/decoration/decoration-operator';
import DecorationOperatorFactory from '../../lib/decoration/decoration-operator-factory';
import SetHighlightColourCommand from '../../lib/commands/set-highlight-colour';
import TextEditor from '../../lib/vscode/text-editor';
import WindowComponent from '../../lib/vscode/window';
import AppIntegrator from '../../lib/app-integrator';
import CommandFactory from '../../lib/command-factory';
import CommandComponent from '../../lib/vscode/command';
import {mockType} from '../helpers/mock';

const colors = ['#00BCD4', '#5C8DFF', '#FFEB3B', '#AB47BC', '#4CAF50',
    '#FF5252', '#FF80AB', '#CDDC39', '#26A69A', '#B0BEC5'];

function createHarness() {
    const config = mockType<ConfigStore>({highlightColors: colors, defaultHighlightColor: 'gray',
        defaultHighlightOpacity: 0.25, borderWidth: 1, borderStyle: 'solid', borderRadius: 999});
    const modes = new MatchingModeRegistry(false, false, new EventEmitter());
    const patterns = new PatternFactory(modes);
    let id = 0;
    let disposed = 0;
    const registry = new DecorationRegistry(config, () => String(++id));
    const locations = new TextLocationRegistry();
    const rendered = new Map<any, any>();
    const editor: any = {id: 'test.c', wholeText: 'au8_data[0] au8_data[1] au8_data[0] au8_data[0',
        selectedText: 'au8_data[0]', selection: {start: 0, end: 11},
        setDecorations: (type: any, ranges: any) => rendered.set(type, ranges),
        unsetDecorations: (type: any) => rendered.delete(type)};
    const types = new DecorationTypeRegistry(config, mockType<WindowComponent>({
        createTextEditorDecorationType: (options: any) => ({options, dispose() {disposed++;}})
    }));
    const operator = new DecorationOperator([editor], registry, new TextDecorator(locations, types));
    const factory = mockType<DecorationOperatorFactory>({createForVisibleEditors: () => operator});
    const choose = (color: string) => new SetHighlightColourCommand(color, modes, locations, registry, factory).execute(editor as TextEditor);
    return {config, patterns, registry, locations, types, editor, rendered, operator, choose, getDisposed: () => disposed};
}

suite('Custom highlight controls', () => {
    test('matches full array expressions and changes their color without duplication', () => {
        const h = createHarness();
        h.choose(colors[0]);
        const first = h.registry.retrieveAll()[0];
        assert.equal(first.pattern.phrase, 'au8_data[0]');
        assert.deepEqual(first.pattern.locateIn(h.editor.wholeText), [{start: 0, end: 11}, {start: 24, end: 35}]);
        for (const color of colors) {
            h.choose(color);
            assert.equal(h.registry.retrieveAll().length, 1);
            assert.equal(h.registry.retrieveAll()[0].id, first.id);
            assert.equal(h.registry.retrieveAll()[0].colour, color);
        }
        assert.ok(h.getDisposed() > 0);
    });
    test('recolors an existing pattern in an editor without cached locations', () => {
        const h = createHarness();
        h.choose(colors[0]);
        h.editor.id = 'other.c';
        h.choose(colors[1]);
        assert.equal(h.registry.retrieveAll().length, 1);
        assert.equal(h.registry.retrieveAll()[0].colour, colors[1]);
    });
    test('preserves regex matching when recoloring an existing highlight', () => {
        const h = createHarness();
        h.operator.addDecoration(h.patterns.create({type: 'RegExp', phrase: 'au8_data\\[\\d+\\]'}), colors[0]);
        h.choose(colors[1]);
        const d = h.registry.retrieveAll()[0];
        assert.equal(d.pattern.type, 'RegExp');
        assert.equal(d.pattern.phrase, 'au8_data\\[\\d+\\]');
        assert.equal(d.pattern.locateIn(h.editor.wholeText).length, 3);
    });
    test('keeps shared colors reserved until their final highlight is removed or recolored', () => {
        const h = createHarness();
        h.registry.issue(h.patterns.create({phrase: 'first'}), colors[0]);
        h.registry.issue(h.patterns.create({phrase: 'second'}), colors[0]);
        const [first, second] = h.registry.retrieveAll();
        h.registry.revoke(first.id);
        const third = h.registry.issue(h.patterns.create({phrase: 'third'}));
        assert.ok(O.isSome(third));
        if (O.isSome(third)) assert.equal(third.value.colour, colors[1]);
        h.registry.update(second, second.withColour(colors[2]));
        const fourth = h.registry.issue(h.patterns.create({phrase: 'fourth'}));
        assert.ok(O.isSome(fourth));
        if (O.isSome(fourth)) assert.equal(fourth.value.colour, colors[0]);
    });
    test('refreshes border and opacity styles, including zero values, and disposes old resources', () => {
        const h = createHarness();
        h.choose(colors[0]);
        Object.assign(h.config, {borderWidth: 0, borderRadius: 0, borderStyle: 'dashed', defaultHighlightOpacity: 0});
        h.operator.refreshStyles();
        const type: any = h.types.provideFor(h.registry.retrieveAll()[0]);
        assert.equal(type.options.border, '0px dashed');
        assert.equal(type.options.borderRadius, '0px');
        assert.equal(type.options.borderColor, colors[0]);
        assert.equal(type.options.backgroundColor, 'rgba(0,188,212,0)');
        assert.equal(type.options.color, undefined);
        assert.equal(h.getDisposed(), 1);
        h.operator.removeAllDecorations();
        assert.equal(h.getDisposed(), 2);
        assert.equal(h.rendered.size, 0);
    });
    test('does nothing for an empty selection outside an existing highlight', () => {
        const h = createHarness();
        h.editor.selectedText = '';
        h.choose(colors[0]);
        assert.equal(h.registry.retrieveAll().length, 0);
    });
    test('registers all ten menu commands and refreshes only relevant style changes', () => {
        const h = createHarness();
        const manifest = require('../../../package.json');
        const commands: any[] = [];
        let listener: (event: any) => void;
        const factory: any = new Proxy({
            getDecorationOperatorFactory: () => ({createForVisibleEditors: () => h.operator}),
            createSetHighlightColourCommand: (colour: string) => ({colour}),
            getConfigStore: () => ({hideStatusBarItems: true}),
            getEventBus: () => new EventEmitter()
        }, {get: (target: any, key: string) => key in target ? target[key] : () => ({})});
        const vscode = {window: {onDidChangeActiveTextEditor() {}}, workspace: {
            onDidChangeTextDocument() {},
            onDidChangeConfiguration(fn: (event: any) => void) {listener = fn;}
        }};
        const component = mockType<CommandComponent>({registerCommand: (item: any) => {commands.push(item);return {dispose() {}};}});
        new AppIntegrator(factory as CommandFactory, vscode, component).integrate({subscriptions: []});
        const menu = manifest.contributes.menus['textmarker.highlightColours'];
        assert.deepEqual(menu.map((item: any) => commands.find(c => c.name === item.command).command.colour), colors);
        h.choose(colors[0]);
        listener!({affectsConfiguration: (key: string) => key === 'editor.fontSize'});
        assert.equal(h.getDisposed(), 0);
        listener!({affectsConfiguration: (key: string) => key === 'textmarker.borderWidth'});
        assert.equal(h.getDisposed(), 1);
    });
});
