
const TextDecorator = require('../../lib/text-decorator');
const PatternFactory = require('../../lib/pattern-factory');

suite('TextDecorator', () => {

    test('it decorates the pattern in the editors', () => {
        const editors = [
            {
                wholeText: 'ENTIRE LONG LONG TEXT',
                setDecorations: sinon.spy()
            },
            {
                wholeText: 'ANOTHER ENTIRE LONG TEXT',
                setDecorations: sinon.spy()
            }
        ];
        const pattern = createPattern('LONG');
        const textDecorator = new TextDecorator();
        textDecorator.decorate(
            editors,
            [{
                pattern,
                decorationType: 'DECORATION_TYPE'
            }]
        );
        expect(editors[0].setDecorations).to.have.been.calledWith(
            'DECORATION_TYPE',
            [{start: 7, end: 11}, {start: 12, end: 16}]
        );
        expect(editors[1].setDecorations).to.have.been.calledWith(
            'DECORATION_TYPE',
            [{start: 15, end: 19}]
        );
    });

    test('it removes decorations from the pattern in the editors', () => {
        const editors = [{setDecorations: sinon.spy()}, {setDecorations: sinon.spy()}];
        const textDecorator = new TextDecorator();
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
        const editors = [{
            wholeText: 'ENTIRE LONG LONG TEXT',
            setDecorations: sinon.spy()
        }];
        const pattern = createPattern('LONG');
        const textDecorator = new TextDecorator();
        textDecorator.decorate(
            editors,
            [{
                pattern,
                decorationType: 'DECORATION_TYPE'
            }, {
                pattern,
                decorationType: null
            }]
        );
        expect(editors[0].setDecorations.args).to.eql([[
            'DECORATION_TYPE',
            [{start: 7, end: 11}, {start: 12, end: 16}]
        ]]);
    });

    function createPattern(phrase) {
        const matchingModeRegistry = {
            mode: {ignoreCase: false}
        };
        return new PatternFactory({matchingModeRegistry}).create({phrase});
    }

});
