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

    withCaseSensitivityToggled(): Decoration {
        return this.withPattern(this.pattern.toggleCaseSensitivity());
    }

    withWholeMatchToggled(): Decoration {
        return this.withPattern(this.pattern.toggleWholeMatch());
    }

    withPhrase(phrase: string): Decoration {
        return this.withPattern(this.pattern.updatePhrase(phrase));
    }

    private withPattern(newPattern: Pattern): Decoration {
        return new Decoration(this.id, newPattern, this.colour, this.decorationType);
    }

    withColour(colour: string): Decoration {
        return new Decoration(this.id, this.pattern, colour, this.decorationType);
    }
}
