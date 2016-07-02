
const TextDecorator = require('../../lib/text-decorator');

suite('TextDecorator', () => {

    test('it decorates the text in the editors', () => {
        const editors = [{setDecorations: sinon.spy()}, {setDecorations: sinon.spy()}];
        const textLocator = {
            locate: stubWithArgs(
                [editors[0], 'TEXT'], ['RANGE1-1', 'RANGE1-2'],
                [editors[1], 'TEXT'], ['RANGE2']
            )
        };
        const textDecorator = new TextDecorator({textLocator});
        textDecorator.decorate(editors, {TEXT: 'DECORATION_TYPE'});

        expect(editors[0].setDecorations)
            .to.have.been.calledWith('DECORATION_TYPE', ['RANGE1-1', 'RANGE1-2']);
        expect(editors[1].setDecorations)
            .to.have.been.calledWith('DECORATION_TYPE', ['RANGE2']);
    });

    test('it removes decorations from the text in the editors', () => {
        const editors = [{setDecorations: sinon.spy()}, {setDecorations: sinon.spy()}];
        const textDecorator = new TextDecorator({});
        textDecorator.undecorate(editors, 'DECORATION_TYPE');

        expect(editors[0].setDecorations)
            .to.have.been.calledWith('DECORATION_TYPE', []);
        expect(editors[1].setDecorations)
            .to.have.been.calledWith('DECORATION_TYPE', []);
    });
});
