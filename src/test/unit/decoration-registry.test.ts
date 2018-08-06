import {mockMethods, mockType, stubReturns, when} from '../helpers/mock';

import DecorationRegistry from '../../lib/decoration-registry';
import PatternFactory from '../../lib/pattern-factory';
import MatchingModeRegistry from '../../lib/matching-mode-registry';
import * as vscode from 'vscode';
import ConfigStore from '../../lib/config-store';
import * as assert from 'assert';

suite('DecorationRegistry', () => {

    test('it registers a pattern and returns registry information', () => {
        const registry = createDecorationRegistry();

        const pattern = createPattern('PATTERN');
        assert.deepEqual(registry.issue(pattern), {
            id: 'UUID_1',
            colour: 'pink',
            decorationType: 'DECORATION_TYPE_1',
            pattern
        });
    });

    test('it does not register the same pattern multiple times', () => {
        const registry = createDecorationRegistry();

        const firstResult = registry.issue(createPattern('PATTERN'));
        const secondResult = registry.issue(createPattern('PATTERN'));

        assert.equal(firstResult!.colour, 'pink');
        assert.equal(secondResult, null);
    });

    test('it returns a registered decoration type for the passed decoration id', () => {
        const registry = createDecorationRegistry();

        const pattern = createPattern('PATTERN');
        registry.issue(createPattern('PATTERN'));

        assert.deepEqual(registry.inquireById('UUID_1'), {
            id: 'UUID_1',
            colour: 'pink',
            decorationType: 'DECORATION_TYPE_1',
            pattern
        });
    });

    test('it returns a registered decoration type for the passed regex', () => {
        const registry = createDecorationRegistry();

        const pattern = createPattern('PATTERN');
        registry.issue(pattern);

        assert.deepEqual(registry.inquireByPattern(pattern), {
            id: 'UUID_1',
            colour: 'pink',
            decorationType: 'DECORATION_TYPE_1',
            pattern: pattern
        });
    });

    test("it can remove given pattern and it's associated decoration type from the registry", () => {
        const registry = createDecorationRegistry();

        const pattern = createPattern('PATTERN');
        const decorationId = registry.issue(pattern)!.id;
        registry.revoke(decorationId);
        assert.equal(registry.inquireByPattern(pattern), null);
    });

    test('it can return all registered decorations at once', () => {
        const registry = createDecorationRegistry();
        const pattern1 = createPattern('PATTERN_1');
        const pattern2 = createPattern('PATTERN_2');
        registry.issue(pattern1);
        registry.issue(pattern2);
        assert.deepEqual(registry.retrieveAll(), [
            {
                id: 'UUID_1',
                colour: 'pink',
                pattern: pattern1,
                decorationType: 'DECORATION_TYPE_1'
            },
            {
                id: 'UUID_2',
                colour: 'yellow',
                pattern: pattern2,
                decorationType: 'DECORATION_TYPE_2'
            }
        ]);
    });

    test('it does not return revoked decorations', () => {
        const registry = createDecorationRegistry();
        const pattern1 = createPattern('PATTERN_1');
        const pattern2 = createPattern('PATTERN_2');
        registry.issue(pattern1);
        registry.issue(pattern2);
        registry.revoke('UUID_1');

        assert.deepEqual(registry.retrieveAll(), [
            {
                id: 'UUID_2',
                colour: 'yellow',
                pattern: pattern2,
                decorationType: 'DECORATION_TYPE_2'
            }
        ]);
    });

    test('it issues new decoration with new color', () => {
        const window = mockMethods<typeof vscode.window>(['createTextEditorDecorationType']);
        when(window.createTextEditorDecorationType({
            backgroundColor: 'pink',
            borderRadius: '.2em',
            overviewRulerColor: 'violet',
            overviewRulerLane: 2
        })).thenReturn('DECORATION_TYPE_1');
        when(window.createTextEditorDecorationType({
            backgroundColor: 'yellow',
            borderRadius: '.2em',
            overviewRulerColor: 'violet',
            overviewRulerLane: 2
        })).thenReturn('DECORATION_TYPE_2');
        const registry = createDecorationRegistry({window});

        const pattern1 = createPattern('TEXT_1');
        assert.equal(registry.issue(pattern1)!.decorationType, 'DECORATION_TYPE_1');
        const pattern2 = createPattern('TEXT_2');
        assert.equal(registry.issue(pattern2)!.decorationType, 'DECORATION_TYPE_2');
    });

    test('it toggles the case sensitivity of a pattern', () => {
        const registry = createDecorationRegistry();

        const oldPattern = createPattern('TEXT');
        const newPattern = createPattern('TEXT');
        registry.issue(oldPattern);

        assert.deepEqual(registry.updatePattern('UUID_1', newPattern), {
            id: 'UUID_1',
            colour: 'pink',
            decorationType: 'DECORATION_TYPE_1',
            pattern: newPattern
        });
    });

    test('it use the text highlight colour on the ruler', () => {
        const window = mockMethods<typeof vscode.window>(['createTextEditorDecorationType']);
        when(window.createTextEditorDecorationType({
            backgroundColor: 'pink',
            borderRadius: '.2em',
            overviewRulerColor: 'pink',
            overviewRulerLane: 2
        })).thenReturn('DECORATION_TYPE_1');

        const configStore = createConfigStore({useHighlightColorOnRuler: true});
        const registry = createDecorationRegistry({configStore, window});

        const pattern = createPattern('TEXT');
        assert.equal(registry.issue(pattern)!.decorationType, 'DECORATION_TYPE_1');
    });

    test('it use the high contrast colour for text with highlights', () => {
        const window = mockMethods<typeof vscode.window>(['createTextEditorDecorationType']);
        when(window.createTextEditorDecorationType({
            backgroundColor: 'pink',
            borderRadius: '.2em',
            color: '#545454',
            overviewRulerColor: 'violet',
            overviewRulerLane: 2
        })).thenReturn('DECORATION_TYPE_1');

        const configStore = createConfigStore({autoSelectDistinctiveTextColor: true});
        const registry = createDecorationRegistry({configStore, window});

        const pattern = createPattern('TEXT');
        assert.equal(registry.issue(pattern)!.decorationType, 'DECORATION_TYPE_1');
    });

    function createDecorationRegistry(options: any = {}) {
        const window = options.window || {
            createTextEditorDecorationType: stubReturns('DECORATION_TYPE_1', 'DECORATION_TYPE_2')
        };
        const generateUuid = createGenerateUuid();
        const configStore = options.configStore || createConfigStore();
        return new DecorationRegistry(configStore, window, generateUuid);
    }

    function createConfigStore({useHighlightColorOnRuler, autoSelectDistinctiveTextColor}: any = {}) {
        return mockType<ConfigStore>({
            useHighlightColorOnRuler: !!useHighlightColorOnRuler,
            autoSelectDistinctiveTextColor: !!autoSelectDistinctiveTextColor,
            highlightColors: ['pink', 'yellow']
        });
    }

    function createPattern(phrase: string) {
        const matchingModeRegistry = mockType<MatchingModeRegistry>({mode: {ignoreCase: false}});
        return new PatternFactory(matchingModeRegistry).create({phrase});
    }

    function createGenerateUuid() {
        let i = 1;
        return () => `UUID_${i++}`;
    }

});
