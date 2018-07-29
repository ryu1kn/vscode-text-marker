import {expect, mock, sinon, stubWithArgs} from '../helpers/helper';

import DecorationOperator from '../../lib/decoration-operator';
import PatternConverter from '../../lib/pattern-converter';

suite('DecorationOperator', () => {

    const patternConverter = mock(PatternConverter);

    suite('#toggleDecoration', () => {

        test('it highlights all the strings equal to the selected string', () => {
            const editors = ['EDITOR'];
            const decorationRegistry = {
                inquireByPattern: () => null,
                issue: stubWithArgs(['PATTERN'], 'DECORATION')
            };
            const textDecorator = {decorate: sinon.spy()};
            const operator = new DecorationOperator(editors, decorationRegistry, textDecorator, patternConverter);
            operator.toggleDecoration('PATTERN');

            expect(textDecorator.decorate).to.have.been.calledWith(
                editors,
                ['DECORATION']
            );
        });

        test('Selecting already selected text is de-highlights the selected strings', () => {
            const editors = ['EDITOR_1', 'EDITOR_2'];
            const decorationRegistry = {
                inquireByPattern: stubWithArgs(['PATTERN'], {
                    id: 'DECORATION_ID',
                    decorationType: 'DECORATION_TYPE'
                }),
                revoke: sinon.spy()
            };
            const textDecorator = {undecorate: sinon.spy()};
            const operator = new DecorationOperator(editors, decorationRegistry, textDecorator, patternConverter);
            operator.toggleDecoration('PATTERN');

            expect(decorationRegistry.revoke).to.have.been.calledWith('DECORATION_ID');
            expect(textDecorator.undecorate).to.have.been.calledWith(
                editors,
                [{
                    id: 'DECORATION_ID',
                    decorationType: 'DECORATION_TYPE'
                }]
            );
        });
    });

    suite('#addDecoration', () => {

        test('it highlights all the strings match to the given pattern', () => {
            const editors = ['EDITOR'];
            const decorationRegistry = {
                issue: stubWithArgs(['PATTERN'], 'DECORATION')
            };
            const textDecorator = {decorate: sinon.spy()};
            const operator = new DecorationOperator(editors, decorationRegistry, textDecorator, patternConverter);
            operator.addDecoration('PATTERN');

            expect(textDecorator.decorate).to.have.been.calledWith(
                editors,
                ['DECORATION']
            );
        });

        test('it does nothing if given pattern is already registered for highlight', () => {
            const editors = ['EDITOR'];
            const decorationRegistry = {
                issue: stubWithArgs(['PATTERN'], null)
            };
            const textDecorator = {decorate: sinon.spy()};
            const operator = new DecorationOperator(editors, decorationRegistry, textDecorator, patternConverter);
            operator.addDecoration('PATTERN');

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
            const operator = new DecorationOperator(editors, decorationRegistry, textDecorator, patternConverter);
            operator.removeDecoration('DECORATION_ID');

            expect(decorationRegistry.revoke).to.have.been.calledWith('DECORATION_ID');
            expect(textDecorator.undecorate).to.have.been.calledWith(
                editors,
                [{
                    id: 'DECORATION_ID',
                    decorationType: 'DECORATION_TYPE'
                }]
            );
        });
    });

    suite('#updateDecorationWithPatternAction', () => {

        test('it toggles a case sensitivity of a decoration pattern', () => {
            const editors = ['EDITOR_1', 'EDITOR_2'];
            const decorationRegistry = {
                updatePattern: sinon.stub().returns('NEW_DECORATION'),
                inquireById: stubWithArgs(['DECORATION_ID'], {
                    id: 'DECORATION_ID',
                    decorationType: 'DECORATION_TYPE',
                    pattern: 'OLD_PATTERN'
                })
            };
            const textDecorator = {
                decorate: sinon.spy(),
                undecorate: sinon.spy()
            };
            const patternConverter = {
                convert: sinon.stub().returns('NEW_PATTERN')
            };
            const operator = new DecorationOperator(editors, decorationRegistry, textDecorator, patternConverter);
            operator.updateDecorationWithPatternAction('DECORATION_ID', 'PATTERN_CONVERT_ACTION');

            expect(patternConverter.convert).to.have.been.calledWith('OLD_PATTERN', 'PATTERN_CONVERT_ACTION');
            expect(decorationRegistry.updatePattern).to.have.been.calledWith('DECORATION_ID', 'NEW_PATTERN');
            expect(textDecorator.undecorate).to.have.been.calledWith(editors, [{
                id: 'DECORATION_ID',
                decorationType: 'DECORATION_TYPE',
                pattern: 'OLD_PATTERN'
            }]);
            expect(textDecorator.decorate).to.have.been.calledWith(
                editors,
                ['NEW_DECORATION']
            );
        });
    });

    suite('#updateDecorationPattern', () => {

        test('it updates a pattern of a decoration', () => {
            const editors = ['EDITOR_1', 'EDITOR_2'];
            const decorationRegistry = {
                updatePattern: sinon.stub().returns('NEW_DECORATION'),
                inquireById: stubWithArgs(['DECORATION_ID'], {
                    id: 'DECORATION_ID',
                    decorationType: 'DECORATION_TYPE',
                    pattern: 'OLD_PATTERN'
                })
            };
            const textDecorator = {
                decorate: sinon.spy(),
                undecorate: sinon.spy()
            };
            const operator = new DecorationOperator(editors, decorationRegistry, textDecorator, patternConverter);
            operator.updateDecorationPattern('DECORATION_ID', 'NEW_PATTERN');

            expect(decorationRegistry.updatePattern).to.have.been.calledWith('DECORATION_ID', 'NEW_PATTERN');
            expect(textDecorator.undecorate).to.have.been.calledWith(editors, [{
                id: 'DECORATION_ID',
                decorationType: 'DECORATION_TYPE',
                pattern: 'OLD_PATTERN'
            }]);
            expect(textDecorator.decorate).to.have.been.calledWith(
                editors,
                ['NEW_DECORATION']
            );
        });
    });

    suite('#refreshDecorations', () => {

        test('it sets all currently active decorations to visible the given editor', () => {
            const editors = ['EDITOR'];
            const decorationRegistry = {retrieveAll: () => 'DECORATIONS'};
            const textDecorator = {decorate: sinon.spy()};
            const operator = new DecorationOperator(editors, decorationRegistry, textDecorator, patternConverter);
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
            const operator = new DecorationOperator(editors, decorationRegistry, textDecorator, patternConverter);
            operator.removeAllDecorations();

            expect(decorationRegistry.revoke.args).to.eql([
                ['DECORATION_ID_1'], ['DECORATION_ID_2']
            ]);
            expect(textDecorator.undecorate).to.have.been.calledWith(
                ['EDITOR_1', 'EDITOR_2'],
                [{
                    id: 'DECORATION_ID_1',
                    decorationType: 'DECORATION_TYPE_1'
                }, {
                    id: 'DECORATION_ID_2',
                    decorationType: 'DECORATION_TYPE_2'
                }]
            );
        });
    });
});
