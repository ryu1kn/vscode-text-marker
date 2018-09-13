import {mockMethods, mockType, stubReturns, when} from '../../helpers/mock';
import {assertOption} from '../../helpers/assertions';
import DecorationRegistry from '../../../lib/decoration/decoration-registry';
import PatternFactory from '../../../lib/pattern/pattern-factory';
import MatchingModeRegistry from '../../../lib/matching-mode-registry';
import * as vscode from 'vscode';
import ConfigStore from '../../../lib/config-store';
import * as assert from 'assert';
import {none, some} from 'fp-ts/lib/Option';

suite('DecorationRegistry', () => {
    const pink = 'rgba(255,192,203,1)';
    const yellow = 'rgba(255,255,0,1)';

    test('it registers a pattern and returns registry information', () => {
        const registry = createDecorationRegistry();

        const pattern = createPattern('PATTERN');
        assert.deepEqual(registry.issue(pattern), some({
            id: 'UUID_1',
            colour: pink,
            decorationType: 'DECORATION_TYPE_1',
            pattern
        }));
    });

    test('it does not register the same pattern multiple times', () => {
        const registry = createDecorationRegistry();

        const firstResult = registry.issue(createPattern('PATTERN'));
        const secondResult = registry.issue(createPattern('PATTERN'));

        assertOption(firstResult, d => {
            assert.equal(d.colour, pink);
        });
        assert.equal(secondResult, none);
    });

    test('it returns a registered decoration type for the passed decoration id', () => {
        const registry = createDecorationRegistry();

        const pattern = createPattern('PATTERN');
        registry.issue(createPattern('PATTERN'));

        assert.deepEqual(registry.inquireById('UUID_1'), some({
            id: 'UUID_1',
            colour: pink,
            decorationType: 'DECORATION_TYPE_1',
            pattern
        }));
    });

    test('it returns a registered decoration type for the passed regex', () => {
        const registry = createDecorationRegistry();

        const pattern = createPattern('PATTERN');
        registry.issue(pattern);

        assert.deepEqual(registry.inquireByPattern(pattern), some({
            id: 'UUID_1',
            colour: pink,
            decorationType: 'DECORATION_TYPE_1',
            pattern: pattern
        }));
    });

    test("it can remove given pattern and it's associated decoration type from the registry", () => {
        const registry = createDecorationRegistry();

        const pattern = createPattern('PATTERN');
        registry.issue(pattern).map(d => registry.revoke(d.id));
        assert.equal(registry.inquireByPattern(pattern), none);
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
                colour: pink,
                pattern: pattern1,
                decorationType: 'DECORATION_TYPE_1'
            },
            {
                id: 'UUID_2',
                colour: yellow,
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
                colour: yellow,
                pattern: pattern2,
                decorationType: 'DECORATION_TYPE_2'
            }
        ]);
    });

    test('it issues new decoration with new color', () => {
        const window = mockMethods<typeof vscode.window>(['createTextEditorDecorationType']);
        when(window.createTextEditorDecorationType({
            backgroundColor: pink,
            borderRadius: '.2em',
            overviewRulerColor: 'violet',
            overviewRulerLane: 2
        })).thenReturn('DECORATION_TYPE_1');
        when(window.createTextEditorDecorationType({
            backgroundColor: yellow,
            borderRadius: '.2em',
            overviewRulerColor: 'violet',
            overviewRulerLane: 2
        })).thenReturn('DECORATION_TYPE_2');
        const registry = createDecorationRegistry({window});

        const pattern1 = createPattern('TEXT_1');
        assertOption(registry.issue(pattern1), d => {
            assert.equal(d.decorationType, 'DECORATION_TYPE_1');
        });
        const pattern2 = createPattern('TEXT_2');
        assertOption(registry.issue(pattern2), d => {
            assert.equal(d.decorationType, 'DECORATION_TYPE_2');
        });
    });

    test('it toggles the case sensitivity of a pattern', () => {
        const registry = createDecorationRegistry();

        const oldPattern = createPattern('TEXT');
        const newPattern = createPattern('TEXT');
        const decoration = registry.issue(oldPattern);

        assertOption(decoration, d => {
            const id = d.id;
            const newDecoration = d.withPattern(newPattern);
            registry.update(d, newDecoration);
            assert.deepEqual(registry.inquireById(id), some(newDecoration));
        });
    });

    test('it use the text highlight colour on the ruler', () => {
        const window = mockMethods<typeof vscode.window>(['createTextEditorDecorationType']);
        when(window.createTextEditorDecorationType({
            backgroundColor: pink,
            borderRadius: '.2em',
            overviewRulerColor: pink,
            overviewRulerLane: 2
        })).thenReturn('DECORATION_TYPE_1');

        const configStore = createConfigStore({useHighlightColorOnRuler: true});
        const registry = createDecorationRegistry({configStore, window});

        const pattern = createPattern('TEXT');
        assertOption(registry.issue(pattern), d => {
            assert.equal(d.decorationType, 'DECORATION_TYPE_1');
        });
    });

    test('it use the high contrast colour for text with highlights', () => {
        const window = mockMethods<typeof vscode.window>(['createTextEditorDecorationType']);
        when(window.createTextEditorDecorationType({
            backgroundColor: pink,
            borderRadius: '.2em',
            color: '#545454',
            overviewRulerColor: 'violet',
            overviewRulerLane: 2
        })).thenReturn('DECORATION_TYPE_1');

        const configStore = createConfigStore({autoSelectDistinctiveTextColor: true});
        const registry = createDecorationRegistry({configStore, window});

        const pattern = createPattern('TEXT');
        assertOption(registry.issue(pattern), d => {
            assert.equal(d.decorationType, 'DECORATION_TYPE_1');
        });
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
            highlightColors: [pink, yellow]
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
