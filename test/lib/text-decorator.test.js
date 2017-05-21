
const TextDecorator = require('../../lib/text-decorator');

suite('TextDecorator', () => {

    test('it decorates the pattern in the editors', () => {
        const editors = [{setDecorations: sinon.spy()}, {setDecorations: sinon.spy()}];
        const textLocator = {
            locate: stubWithArgs(
                [editors[0], 'PATTERN'], ['RANGE1-1', 'RANGE1-2'],
                [editors[1], 'PATTERN'], ['RANGE2']
            )
        };
        const textDecorator = new TextDecorator({textLocator});
        textDecorator.decorate(
            editors,
            [{
                pattern: 'PATTERN',
                decorationType: 'DECORATION_TYPE'
            }]
        );

        expect(editors[0].setDecorations)
            .to.have.been.calledWith('DECORATION_TYPE', ['RANGE1-1', 'RANGE1-2']);
        expect(editors[1].setDecorations)
            .to.have.been.calledWith('DECORATION_TYPE', ['RANGE2']);
    });

    test('it removes decorations from the pattern in the editors', () => {
        const editors = [{setDecorations: sinon.spy()}, {setDecorations: sinon.spy()}];
        const textDecorator = new TextDecorator({});
        textDecorator.undecorate(editors, ['DECORATION_TYPE_1', 'DECORATION_TYPE_2']);

        expect(editors[0].setDecorations.args).to.eql([
            ['DECORATION_TYPE_1', []],
            ['DECORATION_TYPE_2', []]
        ]);
        expect(editors[1].setDecorations.args).to.eql([
            ['DECORATION_TYPE_1', []],
            ['DECORATION_TYPE_2', []]
        ]);
    });

    test("it doesn't apply decorations if decorationType is not valid", () => {
        const editors = [{setDecorations: sinon.spy()}];
        const textLocator = {
            locate: stubWithArgs(
                [editors[0], 'PATTERN_1'], ['RANGE1-1', 'RANGE1-2'],
                [editors[0], 'PATTERN_2'], ['RANGE2']
            )
        };
        const textDecorator = new TextDecorator({textLocator});
        textDecorator.decorate(
            editors,
            [{
                pattern: 'PATTERN_1',
                decorationType: 'DECORATION_TYPE'
            }, {
                pattern: 'PATTERN_2',
                decorationType: null
            }]
        );

        expect(editors[0].setDecorations.args).to.eql([
            ['DECORATION_TYPE', ['RANGE1-1', 'RANGE1-2']]
        ]);
    });
});
