
const DecorationOperator = require('../../lib/decoration-operator');
const PatternAction = require('../../lib/const').PatternAction;
const PatternConverter = require('../../lib/pattern-converter');

suite('DecorationOperator', () => {

    suite('#toggleDecoration', () => {

        test('it highlights all the strings equal to the selected string', () => {
            const editors = ['EDITOR'];
            const decorationRegistry = {
                inquireByPattern: () => null,
                issue: stubWithArgs(['SELECTED_TEXT'], {
                    id: 'DECORATION_ID',
                    decorationType: 'DECORATION_TYPE'
                })
            };
            const textDecorator = {decorate: sinon.spy()};
            const operator = new DecorationOperator({editors, decorationRegistry, textDecorator});
            operator.toggleDecoration('SELECTED_TEXT');

            expect(textDecorator.decorate).to.have.been.calledWith(
                editors,
                [{
                    pattern: 'SELECTED_TEXT',
                    decorationType: 'DECORATION_TYPE'
                }]
            );
        });

        test('Selecting already selected text is de-highlights the selected strings', () => {
            const editors = ['EDITOR_1', 'EDITOR_2'];
            const decorationRegistry = {
                inquireByPattern: stubWithArgs(['SELECTED_TEXT'], {
                    id: 'DECORATION_ID',
                    decorationType: 'DECORATION_TYPE'
                }),
                revoke: sinon.spy()
            };
            const textDecorator = {undecorate: sinon.spy()};
            const operator = new DecorationOperator({editors, decorationRegistry, textDecorator});
            operator.toggleDecoration('SELECTED_TEXT');

            expect(decorationRegistry.revoke).to.have.been.calledWith('DECORATION_ID');
            expect(textDecorator.undecorate).to.have.been.calledWith(
                editors, ['DECORATION_TYPE']
            );
        });
    });

    suite('#addDecoration', () => {

        test('it highlights all the strings match to the given pattern', () => {
            const editors = ['EDITOR'];
            const decorationRegistry = {
                issue: stubWithArgs(['SELECTED_TEXT'], {
                    id: 'DECORATION_ID',
                    decorationType: 'DECORATION_TYPE'
                })
            };
            const textDecorator = {decorate: sinon.spy()};
            const operator = new DecorationOperator({editors, decorationRegistry, textDecorator});
            operator.addDecoration('SELECTED_TEXT');

            expect(textDecorator.decorate).to.have.been.calledWith(
                editors,
                [{
                    pattern: 'SELECTED_TEXT',
                    decorationType: 'DECORATION_TYPE'
                }]
            );
        });

        test('it does nothing if given pattern is already registered for highlight', () => {
            const editors = ['EDITOR'];
            const decorationRegistry = {
                issue: stubWithArgs(['SELECTED_TEXT'], null)
            };
            const textDecorator = {decorate: sinon.spy()};
            const operator = new DecorationOperator({editors, decorationRegistry, textDecorator});
            operator.addDecoration('SELECTED_TEXT');

            expect(textDecorator.decorate).to.have.been.not.called;
        });
    });

    suite('#removeDecoration', () => {

        test('it removes a decoration', () => {
            const editors = ['EDITOR_1', 'EDITOR_2'];
            const decorationRegistry = {
                inquireById: stubWithArgs(['DECORATION_ID'], {
                    id: 'DECORATION_ID',
                    decorationType: 'DECORATION_TYPE'
                }),
                revoke: sinon.spy()
            };
            const textDecorator = {undecorate: sinon.spy()};
            const operator = new DecorationOperator({editors, decorationRegistry, textDecorator});
            operator.removeDecoration('DECORATION_ID');

            expect(decorationRegistry.revoke).to.have.been.calledWith('DECORATION_ID');
            expect(textDecorator.undecorate).to.have.been.calledWith(
                editors, ['DECORATION_TYPE']
            );
        });
    });

    suite('#updateDecoration', () => {

        test('it toggles a case sensitivity of a decoration pattern', () => {
            const editors = ['EDITOR_1', 'EDITOR_2'];
            const decorationRegistry = {
                updatePattern: sinon.stub().returns({
                    id: 'DECORATION_ID',
                    decorationType: 'DECORATION_TYPE',
                    pattern: 'NEW_PATTERN'
                }),
                inquireById: stubWithArgs(['DECORATION_ID'], {
                    id: 'DECORATION_ID',
                    decorationType: 'DECORATION_TYPE',
                    pattern: {toggleCaseSensitivity: () => 'NEW_PATTERN'}
                })
            };
            const textDecorator = {
                decorate: sinon.spy(),
                undecorate: sinon.spy()
            };
            const operator = new DecorationOperator({
                editors,
                decorationRegistry,
                textDecorator,
                patternConverter: new PatternConverter()
            });
            operator.updateDecoration('DECORATION_ID', PatternAction.TOGGLE_CASE_SENSITIVITY);

            expect(decorationRegistry.updatePattern).to.have.been.calledWith('DECORATION_ID', 'NEW_PATTERN');
            expect(textDecorator.undecorate).to.have.been.calledWith(editors, ['DECORATION_TYPE']);
            expect(textDecorator.decorate).to.have.been.calledWith(
                editors,
                [{
                    pattern: 'NEW_PATTERN',
                    decorationType: 'DECORATION_TYPE'
                }]
            );
        });
    });

    suite('#refreshDecorations', () => {

        test('it sets all currently active decorations to visible the given editor', () => {
            const editors = ['EDITOR'];
            const decorationRegistry = {retrieveAll: () => 'DECORATIONS'};
            const textDecorator = {decorate: sinon.spy()};
            const operator = new DecorationOperator({editors, decorationRegistry, textDecorator});
            operator.refreshDecorations();

            expect(textDecorator.decorate.args).to.eql([[editors, 'DECORATIONS']]);
        });
    });

    suite('#removeAllDecorations', () => {

        test('it removes all currently active decorations', () => {
            const editors = ['EDITOR_1', 'EDITOR_2'];
            const decorationRegistry = {
                revoke: sinon.spy(),
                retrieveAll: () => [{
                    id: 'DECORATION_ID_1',
                    decorationType: 'DECORATION_TYPE_1'
                }, {
                    id: 'DECORATION_ID_2',
                    decorationType: 'DECORATION_TYPE_2'
                }]
            };
            const textDecorator = {undecorate: sinon.spy()};
            const operator = new DecorationOperator({decorationRegistry, textDecorator, editors});
            operator.removeAllDecorations();

            expect(decorationRegistry.revoke.args).to.eql([
                ['DECORATION_ID_1'], ['DECORATION_ID_2']
            ]);
            expect(textDecorator.undecorate).to.have.been.calledWith(
                ['EDITOR_1', 'EDITOR_2'],
                ['DECORATION_TYPE_1', 'DECORATION_TYPE_2']
            );
        });
    });
});
