
const TextDecorator = require('../../lib/text-decorator');
const PatternFactory = require('../../lib/pattern-factory');

suite('TextDecorator', () => {

    test('it decorates the pattern in the editors', () => {
        const editors = [
            fakeEditor('ENTIRE LONG LONG TEXT'),
            fakeEditor('ANOTHER ENTIRE LONG TEXT')
        ];
        const pattern = new PatternFactory().create({phrase: 'LONG'});
        const textDecorator = new TextDecorator({VsRange: FakeRange});
        textDecorator.decorate(
            editors,
            [{
                pattern,
                decorationType: 'DECORATION_TYPE'
            }]
        );
        expect(editors[0].setDecorations).to.have.been.calledWith(
            'DECORATION_TYPE',
            [new FakeRange('p:7', 'p:11'), new FakeRange('p:12', 'p:16')]
        );
        expect(editors[1].setDecorations).to.have.been.calledWith(
            'DECORATION_TYPE',
            [new FakeRange('p:15', 'p:19')]
        );
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
        const editors = [fakeEditor('ENTIRE LONG LONG TEXT')];
        const pattern = new PatternFactory().create({phrase: 'LONG'});
        const textDecorator = new TextDecorator({VsRange: FakeRange});
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
            [new FakeRange('p:7', 'p:11'), new FakeRange('p:12', 'p:16')]
        ]]);
    });

    function fakeEditor(entireText) {
        return {
            document: {
                getText: () => entireText,
                positionAt: offset => `p:${offset}`
            },
            setDecorations: sinon.spy()
        };
    }

    function FakeRange(position1, position2) {
        return {start: position1, end: position2};
    }
});
