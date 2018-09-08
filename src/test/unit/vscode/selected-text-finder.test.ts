import {mockType} from '../../helpers/mock';

import SelectedTextFinder from '../../../lib/vscode/selected-text-finder';
import * as vscode from 'vscode';
import * as assert from 'assert';

suite('SelectedTextFinder', () => {

    test('it finds currently selected text in the editor', () => {
        const finder = new SelectedTextFinder();
        const editor = fakeEditor('SELECTED', 'STR1 SELECTED STR2 SELECTED');
        assert.deepEqual(finder.find(editor), 'SELECTED');
    });

    test('it selects a word where the cursor is currently on if no text is selected', () => {
        const finder = new SelectedTextFinder();
        const editor = fakeEditor('', 'ENTIRE TEXT', 'WORD');
        assert.deepEqual(finder.find(editor), 'WORD');
    });

    test('it selects nothing if no text is selected and there is no word under the cursor', () => {
        const finder = new SelectedTextFinder();
        const editor = fakeEditor('', 'ENTIRE TEXT', undefined);
        assert.equal(finder.find(editor), undefined);
    });

    function fakeEditor(selectedText: string, entireText: string, wordUnderCursor?: string) {
        const selection = {
            active: 'CURSOR_POSITION',
            text: selectedText
        };
        const document = {
            getText: (range: any) => {
                if (range === selection) return range.text;
                if (range === 'WORD_RANGE') return wordUnderCursor;
                return entireText;
            },
            getWordRangeAtPosition: (cursorAt: any) => {
                return 'WORD_RANGE';
            }
        };
        return mockType<vscode.TextEditor>({selection, document});
    }

});
