
const AppIntegrator = require('../../../lib/app-integrator');
const CommandFactory = require('../../../lib/command-factory');
const FakeEditorBuilder = require('../lib/fake-editor-builder');
const FakeVscodeBuilder = require('../lib/fake-vscode-builder');

suite('Highlight command', () => {

    const editorBuilder = new FakeEditorBuilder();
    const vscodeBuilder = new FakeVscodeBuilder();

    test('highlights selected text', () => {
        const editors = [
            editorBuilder.build({
                wholeText: 'A TEXT B TEXT C',
                selectedText: 'TEXT'
            }),
            editorBuilder.build({
                wholeText: 'a TEXT'
            })
        ];
        const fakeContext = {subscriptions: []};
        const fakeVscode = vscodeBuilder.build({editors: editors});
        const commandFactory = new CommandFactory({
            vscode: fakeVscode,
            logger: console
        });
        new AppIntegrator({commandFactory, vscode: fakeVscode}).integrate(fakeContext);
        const command = fakeVscode._commands['textmarker.highlight'];

        return command(editors[0]).then(() => {
            expect(editors[0].setDecorations).to.have.been.calledWith(
                'DECORATION_TYPE_1',
                [
                    new fakeVscode.Range('POSITION:2', 'POSITION:6'),
                    new fakeVscode.Range('POSITION:9', 'POSITION:13')
                ]
            );
            expect(editors[1].setDecorations).to.have.been.calledWith(
                'DECORATION_TYPE_1',
                [
                    new fakeVscode.Range('POSITION:2', 'POSITION:6')
                ]
            );
        });
    });

});
