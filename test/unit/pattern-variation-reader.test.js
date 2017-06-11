
const PatternVariationReader = require('../../lib/pattern-variation-reader');
const PatternFactory = require('../../lib/pattern-factory');

suite('PatternVariationReader', () => {

    test('it lets user to toggle case sensitivity', () => {
        const windowComponent = {
            showQuickPick: items =>
                Promise.resolve(items.find(item => item.label.includes('Case')))
        };
        const patternVariationReader = new PatternVariationReader({windowComponent});

        const currentPattern = createPattern();
        return patternVariationReader.read(currentPattern).then(newPattern => {
            expect(newPattern.equalTo(currentPattern.toggleCaseSensitivity())).to.be.true;
        });
    });

    test('it lets user to toggle whole/partial match', () => {
        const windowComponent = {
            showQuickPick: items =>
                Promise.resolve(items.find(item => item.label.includes('Whole')))
        };
        const patternVariationReader = new PatternVariationReader({windowComponent});

        const currentPattern = createPattern();
        return patternVariationReader.read(currentPattern).then(newPattern => {
            expect(newPattern.equalTo(currentPattern.toggleWholeMatch())).to.be.true;
        });
    });

    test('it lets user to update the phrase of pattern', () => {
        const windowComponent = {
            showQuickPick: items =>
                Promise.resolve(items.find(item => item.label.includes('Pattern'))),
            showInputBox: () => Promise.resolve('NEW_PHRASE')
        };
        const patternVariationReader = new PatternVariationReader({windowComponent});

        const currentPattern = createPattern();
        return patternVariationReader.read(currentPattern).then(newPattern => {
            const expectedPattern = createPattern({phrase: 'NEW_PHRASE'});
            expect(newPattern.equalTo(expectedPattern)).to.be.true;
        });
    });

    test('it returns null if user selected nothing', () => {
        const windowComponent = {
            showQuickPick: _items => Promise.resolve()
        };
        const patternVariationReader = new PatternVariationReader({windowComponent});

        const currentPattern = createPattern();
        return patternVariationReader.read(currentPattern).then(newPattern => {
            expect(newPattern).to.be.null;
        });
    });

    test('it returns null if user selected phrase-update but cancelled', () => {
        const windowComponent = {
            showQuickPick: items =>
                Promise.resolve(items.find(item => item.label.includes('Pattern'))),
            showInputBox: () => Promise.resolve()
        };
        const patternVariationReader = new PatternVariationReader({windowComponent});

        const currentPattern = createPattern();
        return patternVariationReader.read(currentPattern).then(newPattern => {
            expect(newPattern).to.be.null;
        });
    });

    function createPattern({phrase} = {}) {
        const patternFactory = new PatternFactory({matchingModeRegistry: {}});
        return patternFactory.create({
            phrase: phrase || 'PHRASE'
        });
    }

});
