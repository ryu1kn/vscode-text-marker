import {TextEditorDecorationType} from 'vscode';
import Pattern from '../pattern/pattern';

export class Decoration {
    public readonly id: string;
    public readonly pattern: Pattern;
    public readonly colour: string;
    public readonly decorationType: TextEditorDecorationType;

    constructor(id: string, pattern: Pattern, colour: string, decorationType: TextEditorDecorationType) {
        this.id = id;
        this.pattern = pattern;
        this.colour = colour;
        this.decorationType = decorationType;
    }

    withPattern(newPattern: Pattern): Decoration {
        return new Decoration(this.id, newPattern, this.colour, this.decorationType);
    }
}
