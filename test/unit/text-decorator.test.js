const {expect, sinon} = require('../helpers/helper');

const TextDecorator = require('../../lib/text-decorator');
const PatternFactory = require('../../lib/pattern-factory');

suite('TextDecorator', () => {

    test('it decorates the pattern in the editors', () => {
        const editors = [{
            id: 'EDITOR_ID_1',
            wholeText: 'ENTIRE LONG LONG TEXT',
            setDecorations: sinon.spy()
        }, {
            id: 'EDITOR_ID_2',
            wholeText: 'ANOTHER ENTIRE LONG TEXT',
            setDecorations: sinon.spy()
        }];
        const pattern = createPattern('LONG');
        const textLocationRegistry = {register: sinon.spy()};
        const textDecorator = new TextDecorator({textLocationRegistry});
        textDecorator.decorate(
            editors,
            [{
                pattern,
                decorationType: 'DECORATION_TYPE',
                id: 'DECORATION_ID'
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
        expect(textLocationRegistry.register.args).to.eql([
            [{
                decorationId: 'DECORATION_ID',
                editorId: 'EDITOR_ID_1',
                ranges: [{end: 11, start: 7}, {end: 16, start: 12}]
            }],
            [{
                decorationId: 'DECORATION_ID',
                editorId: 'EDITOR_ID_2',
                ranges: [{end: 19, start: 15}]
            }]
        ]);
    });

    test('it removes decorations from the pattern in the editors', () => {
        const editors = [{unsetDecorations: sinon.spy()}, {unsetDecorations: sinon.spy()}];
        const textLocationRegistry = {deregister: sinon.spy()};
        const textDecorator = new TextDecorator({textLocationRegistry});
        textDecorator.undecorate(editors, [{
            id: 'DECORATION_ID_1',
            decorationType: 'DECORATION_TYPE_1'
        }, {
            id: 'DECORATION_ID_2',
            decorationType: 'DECORATION_TYPE_2'
        }]);

        expect(editors[0].unsetDecorations.args).to.eql([
            ['DECORATION_TYPE_1'],
            ['DECORATION_TYPE_2']
        ]);
        expect(editors[1].unsetDecorations.args).to.eql([
            ['DECORATION_TYPE_1'],
            ['DECORATION_TYPE_2']
        ]);
        expect(textLocationRegistry.deregister.args).to.eql([
            ['DECORATION_ID_1'], ['DECORATION_ID_2']
        ]);
    });

    test("it doesn't apply decorations if decorationType is not valid", () => {
        const editors = [{
            wholeText: 'ENTIRE LONG LONG TEXT',
            setDecorations: sinon.spy()
        }];
        const pattern = createPattern('LONG');
        const textLocationRegistry = {register: () => {}};
        const textDecorator = new TextDecorator({textLocationRegistry});
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
