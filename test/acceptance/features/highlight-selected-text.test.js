
const AppIntegrator = require('../../../lib/app-integrator');
const FakeEditorBuilder = require('../lib/fake-editor-builder');
const FakeVscodeBuilder = require('../lib/fake-vscode-builder');

suite('Highlight command', () => {

    let editor1;
    let editor2;
    let command;
    let fakeVscode;

    beforeEach(() => {
        const editorBuilder = new FakeEditorBuilder();
        const vscodeBuilder = new FakeVscodeBuilder();
        editor1 = editorBuilder.build({
            wholeText: 'A TEXT B TEXT C',
            selectedText: 'TEXT'
        });
        editor2 = editorBuilder.build({
            wholeText: 'a TEXT'
        });
        const fakeContext = {subscriptions: []};
        fakeVscode = vscodeBuilder.build({editors: [editor1, editor2]});

        AppIntegrator.create(fakeVscode, console).integrate(fakeContext);

        command = fakeVscode._commands['textmarker.toggleHighlight'];
    });

    test('highlights selected text', async () => {
        await command(editor1);

        expect(editor1.setDecorations.args).to.eql([[
            'DECORATION_TYPE_1',
            [
                new fakeVscode.Range('POSITION:2', 'POSITION:6'),
                new fakeVscode.Range('POSITION:9', 'POSITION:13')
            ]
        ]]);
        expect(editor2.setDecorations.args).to.eql([[
            'DECORATION_TYPE_1',
            [
                new fakeVscode.Range('POSITION:2', 'POSITION:6')
            ]
        ]]);
    });

    test.skip('unhighlight selected text if the exact text is already selected', async () => {
        await command(editor1);
        await command(editor1);

        expect(editor1.setDecorations.args[1]).to.eql([['DECORATION_TYPE_1', []]]);
        expect(editor2.setDecorations.args[1]).to.eql([['DECORATION_TYPE_1', []]]);
    });
});
