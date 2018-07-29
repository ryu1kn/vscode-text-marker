import {expect} from '../../helpers/helper';

import AppIntegrator from '../../../lib/app-integrator';
import {createFakeEditor} from '../helpers/fake-editor';
import {createFakeVsCode, EXECUTION_CONTEXT} from '../helpers/fake-vscode';

suite('Highlight command', () => {

    let editor1;
    let editor2;
    let editor3;
    let command;
    let fakeVscode;

    setup(() => {
        editor1 = createFakeEditor({wholeText: 'A TEXT B TEXT C', selectedText: 'TEXT'});
        editor2 = createFakeEditor({wholeText: 'a TEXT'});
        editor3 = createFakeEditor({wholeText: 'a TEXT', selectedText: 'TEX'});
        fakeVscode = createFakeVsCode({editors: [editor1, editor2, editor3]});

        AppIntegrator.create(fakeVscode, console).integrate(EXECUTION_CONTEXT);

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

    test('add another highlight to the substring of already selected text', async () => {
        await command(editor1);
        await command(editor3);

        expect(editor1.setDecorations.args[1]).to.eql([
            'DECORATION_TYPE_2',
            [
                new fakeVscode.Range('POSITION:2', 'POSITION:5'),
                new fakeVscode.Range('POSITION:9', 'POSITION:12')
            ]
        ]);
        expect(editor3.setDecorations.args[1]).to.eql([
            'DECORATION_TYPE_2',
            [
                new fakeVscode.Range('POSITION:2', 'POSITION:5')
            ]
        ]);
    });

    test('unhighlight selected text if the exact text is already selected', async () => {
        await command(editor1);
        await command(editor1);

        expect(editor1.setDecorations.args[1]).to.eql(['DECORATION_TYPE_1', []]);
        expect(editor2.setDecorations.args[1]).to.eql(['DECORATION_TYPE_1', []]);
    });
});
