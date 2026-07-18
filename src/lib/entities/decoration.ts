import Pattern from '../pattern/pattern';

export class Decoration {
    public readonly id: string;
    public readonly pattern: Pattern;
    public readonly colour: string;
    public readonly label?: string;

    constructor(id: string, pattern: Pattern, colour: string, label?: string) {
        this.id = id;
        this.pattern = pattern;
        this.colour = colour;
        if (label !== undefined) {
            this.label = label;
        }
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
        return new Decoration(this.id, newPattern, this.colour, this.label);
    }

    withColour(colour: string): Decoration {
        return new Decoration(this.id, this.pattern, colour, this.label);
    }

    withLabel(label: string): Decoration {
        return new Decoration(this.id, this.pattern, this.colour, label);
    }
}
