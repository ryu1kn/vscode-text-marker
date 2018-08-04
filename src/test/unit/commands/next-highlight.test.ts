import TextEditor from '../../../lib/text-editor';
import {assertEqual, mockType} from '../../helpers/helper';
import TextLocationRegistry from '../../../lib/text-location-registry';
import {NextHighlightCommand} from '../../../lib/commands/next-highlight';

describe('Next-highlight command', function () {

    const editor = mockType<TextEditor>({id: 'EDITOR_ID', selection: {start: 11, end: 11}});

    const textLocationRegistry = new TextLocationRegistry();
    textLocationRegistry.register('EDITOR_ID', 'DECORATION_ID', [
        {start: 10, end: 15},
        {start: 30, end: 35}
    ]);

    const command = new NextHighlightCommand(textLocationRegistry);

    it('takes you to the next highlight of the pattern', async () => {
        await command.execute(editor);
        assertEqual(editor.selection, {start: 30, end: 30});
    });

});
