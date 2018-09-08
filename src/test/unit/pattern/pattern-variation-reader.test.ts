import {mockType} from '../../helpers/mock';

import PatternVariationReader from '../../../lib/pattern/pattern-variation-reader';
import PatternFactory from '../../../lib/pattern/pattern-factory';
import WindowComponent from '../../../lib/vscode/window';
import MatchingModeRegistry from '../../../lib/matching-mode-registry';
import {QuickPickItem} from 'vscode';
import * as assert from 'assert';
import {none, some} from 'fp-ts/lib/Option';

suite('PatternVariationReader', () => {

    test('it lets user to toggle case sensitivity', async () => {
        const windowComponent = mockType<WindowComponent>({
            showQuickPick: (items: QuickPickItem[]) =>
                Promise.resolve(items.find(item => item.label.includes('Case')))
        });
        const patternVariationReader = new PatternVariationReader(windowComponent);

        const currentPattern = createPattern();
        const newPatternOpt = await patternVariationReader.read(currentPattern);

        assert.deepEqual(newPatternOpt.map(p => p.equalTo(currentPattern.toggleCaseSensitivity())), some(true));
    });

    test('it lets user to toggle whole/partial match', async () => {
        const windowComponent = mockType<WindowComponent>({
            showQuickPick: (items: QuickPickItem[]) =>
                Promise.resolve(items.find(item => item.label.includes('Whole')))
        });
        const patternVariationReader = new PatternVariationReader(windowComponent);

        const currentPattern = createPattern();
        const newPatternOpt = await patternVariationReader.read(currentPattern);

        assert.deepEqual(newPatternOpt.map(p => p.equalTo(currentPattern.toggleWholeMatch())), some(true));
    });

    test('it lets user to update the phrase of pattern', async () => {
        const windowComponent = mockType<WindowComponent>({
            showQuickPick: (items: QuickPickItem[]) =>
                Promise.resolve(items.find(item => item.label.includes('Pattern'))),
            showInputBox: () => Promise.resolve(some('NEW_PHRASE'))
        });
        const patternVariationReader = new PatternVariationReader(windowComponent);

        const currentPattern = createPattern();
        const newPatternOpt = await patternVariationReader.read(currentPattern);

        const expectedPattern = createPattern({phrase: 'NEW_PHRASE'});
        assert.deepEqual(newPatternOpt.map(p => p.equalTo(expectedPattern)), some(true));
    });

    test('it returns null if user selected nothing', async () => {
        const windowComponent = mockType<WindowComponent>({
            showQuickPick: (_items: QuickPickItem[]) => Promise.resolve()
        });
        const patternVariationReader = new PatternVariationReader(windowComponent);

        const currentPattern = createPattern();
        const newPattern = await patternVariationReader.read(currentPattern);

        assert.deepEqual(newPattern, none);
    });

    test('it returns null if user selected phrase-update but cancelled', async () => {
        const windowComponent = mockType<WindowComponent>({
            showQuickPick: (items: QuickPickItem[]) =>
                Promise.resolve(items.find(item => item.label.includes('Pattern'))),
            showInputBox: () => Promise.resolve(none)
        });
        const patternVariationReader = new PatternVariationReader(windowComponent);

        const currentPattern = createPattern();
        const newPattern = await patternVariationReader.read(currentPattern);

        assert.deepEqual(newPattern, none);
    });

    function createPattern({phrase}: any = {}) {
        const matchingModeRegistry = mockType<MatchingModeRegistry>({});
        const patternFactory = new PatternFactory(matchingModeRegistry);
        return patternFactory.create({
            phrase: phrase || 'PHRASE'
        });
    }

});
