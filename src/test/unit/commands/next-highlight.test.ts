import TextEditor from '../../../lib/text-editor';
import {assertEqual, mockType} from '../../helpers/helper';
import TextLocationRegistry from '../../../lib/text-location-registry';
import {NextHighlightCommand} from '../../../lib/commands/next-highlight';

describe('Next-highlight command', function () {

    const textLocationRegistry = new TextLocationRegistry();
    textLocationRegistry.register('EDITOR_ID', 'DECORATION_ID', [
        {start: 10, end: 15},
        {start: 30, end: 35}
    ]);

    const command = new NextHighlightCommand(textLocationRegistry);

    describe('when the cursor is on highlight', () => {

        const editor = mockType<TextEditor>({id: 'EDITOR_ID', selection: {start: 11, end: 11}});

        it('takes you to the next highlight of the pattern', async () => {
            await command.execute(editor);
            assertEqual(editor.selection, {start: 30, end: 35});
        });
    });

    describe.skip('when the cursor is NOT on highlight', () => {

        const editor = mockType<TextEditor>({
            id: 'EDITOR_ID',
            selection: {start: 5, end: 5},
            selectedText: 'TEXT',
            wholeText: 'abc TEXT defgh TEXT'
        });
        // const windowComponent = mockType<WindowComponent>({
        //     visibleTextEditors: [editor]
        // });
        // const configStore = mockType<ConfigStore>();
        const command = new NextHighlightCommand(textLocationRegistry);

        it('highlights and take you to the next highlight', async () => {
            await command.execute(editor);
            assertEqual(editor.selection, {start: 15, end: 19});
        });
    });
});
