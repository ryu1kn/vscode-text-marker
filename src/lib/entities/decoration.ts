import {TextEditorDecorationType} from 'vscode';
import Pattern from '../patterns/pattern';

export interface PreRegisteredDecoration {
    pattern: Pattern;
    colour: string;
    decorationType: TextEditorDecorationType;
}

export interface Decoration extends PreRegisteredDecoration {
    id: string;
}
