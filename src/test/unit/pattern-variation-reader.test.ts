import {expect, mockType} from '../helpers/helper';

import PatternVariationReader from '../../lib/pattern-variation-reader';
import PatternFactory from '../../lib/pattern-factory';
import WindowComponent from "../../lib/editor-components/window";
import MatchingModeRegistry from "../../lib/matching-mode-registry";

suite('PatternVariationReader', () => {

    test('it lets user to toggle case sensitivity', async () => {
        const windowComponent = mockType<WindowComponent>({
            showQuickPick: items =>
                Promise.resolve(items.find(item => item.label.includes('Case')))
        });
        const patternVariationReader = new PatternVariationReader(windowComponent);

        const currentPattern = createPattern();
        const newPattern = await patternVariationReader.read(currentPattern);

        expect(newPattern.equalTo(currentPattern.toggleCaseSensitivity())).to.be.true;
    });

    test('it lets user to toggle whole/partial match', async () => {
        const windowComponent = mockType<WindowComponent>({
            showQuickPick: items =>
                Promise.resolve(items.find(item => item.label.includes('Whole')))
        });
        const patternVariationReader = new PatternVariationReader(windowComponent);

        const currentPattern = createPattern();
        const newPattern = await patternVariationReader.read(currentPattern);

        expect(newPattern.equalTo(currentPattern.toggleWholeMatch())).to.be.true;
    });

    test('it lets user to update the phrase of pattern', async () => {
        const windowComponent = mockType<WindowComponent>({
            showQuickPick: items =>
                Promise.resolve(items.find(item => item.label.includes('Pattern'))),
            showInputBox: () => Promise.resolve('NEW_PHRASE')
        });
        const patternVariationReader = new PatternVariationReader(windowComponent);

        const currentPattern = createPattern();
        const newPattern = await patternVariationReader.read(currentPattern);

        const expectedPattern = createPattern({phrase: 'NEW_PHRASE'});
        expect(newPattern.equalTo(expectedPattern)).to.be.true;
    });

    test('it returns null if user selected nothing', async () => {
        const windowComponent = mockType<WindowComponent>({
            showQuickPick: _items => Promise.resolve()
        });
        const patternVariationReader = new PatternVariationReader(windowComponent);

        const currentPattern = createPattern();
        const newPattern = await patternVariationReader.read(currentPattern);

        expect(newPattern).to.be.null;
    });

    test('it returns null if user selected phrase-update but cancelled', async () => {
        const windowComponent = mockType<WindowComponent>({
            showQuickPick: items =>
                Promise.resolve(items.find(item => item.label.includes('Pattern'))),
            showInputBox: () => Promise.resolve()
        });
        const patternVariationReader = new PatternVariationReader(windowComponent);

        const currentPattern = createPattern();
        const newPattern = await patternVariationReader.read(currentPattern);

        expect(newPattern).to.be.null;
    });

    function createPattern({phrase}: any = {}) {
        const matchingModeRegistry = mockType<MatchingModeRegistry>({});
        const patternFactory = new PatternFactory(matchingModeRegistry);
        return patternFactory.create({
            phrase: phrase || 'PHRASE'
        });
    }

});
