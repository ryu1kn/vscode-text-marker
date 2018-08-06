import {mockType} from '../helpers/helper';

import PatternVariationReader from '../../lib/pattern-variation-reader';
import PatternFactory from '../../lib/pattern-factory';
import WindowComponent from '../../lib/editor-components/window';
import MatchingModeRegistry from '../../lib/matching-mode-registry';
import {QuickPickItem} from 'vscode';
import * as assert from 'assert';

suite('PatternVariationReader', () => {

    test('it lets user to toggle case sensitivity', async () => {
        const windowComponent = mockType<WindowComponent>({
            showQuickPick: (items: QuickPickItem[]) =>
                Promise.resolve(items.find(item => item.label.includes('Case')))
        });
        const patternVariationReader = new PatternVariationReader(windowComponent);

        const currentPattern = createPattern();
        const newPattern = await patternVariationReader.read(currentPattern);

        assert.equal(newPattern!.equalTo(currentPattern.toggleCaseSensitivity()), true);
    });

    test('it lets user to toggle whole/partial match', async () => {
        const windowComponent = mockType<WindowComponent>({
            showQuickPick: (items: QuickPickItem[]) =>
                Promise.resolve(items.find(item => item.label.includes('Whole')))
        });
        const patternVariationReader = new PatternVariationReader(windowComponent);

        const currentPattern = createPattern();
        const newPattern = await patternVariationReader.read(currentPattern);

        assert.equal(newPattern!.equalTo(currentPattern.toggleWholeMatch()), true);
    });

    test('it lets user to update the phrase of pattern', async () => {
        const windowComponent = mockType<WindowComponent>({
            showQuickPick: (items: QuickPickItem[]) =>
                Promise.resolve(items.find(item => item.label.includes('Pattern'))),
            showInputBox: () => Promise.resolve('NEW_PHRASE')
        });
        const patternVariationReader = new PatternVariationReader(windowComponent);

        const currentPattern = createPattern();
        const newPattern = await patternVariationReader.read(currentPattern);

        const expectedPattern = createPattern({phrase: 'NEW_PHRASE'});
        assert.equal(newPattern!.equalTo(expectedPattern), true);
    });

    test('it returns null if user selected nothing', async () => {
        const windowComponent = mockType<WindowComponent>({
            showQuickPick: (_items: QuickPickItem[]) => Promise.resolve()
        });
        const patternVariationReader = new PatternVariationReader(windowComponent);

        const currentPattern = createPattern();
        const newPattern = await patternVariationReader.read(currentPattern);

        assert.equal(newPattern, null);
    });

    test('it returns null if user selected phrase-update but cancelled', async () => {
        const windowComponent = mockType<WindowComponent>({
            showQuickPick: (items: QuickPickItem[]) =>
                Promise.resolve(items.find(item => item.label.includes('Pattern'))),
            showInputBox: () => Promise.resolve()
        });
        const patternVariationReader = new PatternVariationReader(windowComponent);

        const currentPattern = createPattern();
        const newPattern = await patternVariationReader.read(currentPattern);

        assert.equal(newPattern, null);
    });

    function createPattern({phrase}: any = {}) {
        const matchingModeRegistry = mockType<MatchingModeRegistry>({});
        const patternFactory = new PatternFactory(matchingModeRegistry);
        return patternFactory.create({
            phrase: phrase || 'PHRASE'
        });
    }

});
