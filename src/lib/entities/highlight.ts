
export enum PatternType {
    STRING = 'string',
    REGEX = 'regex'
}

export type Highlight = {
    pattern: {
        type: PatternType,
        expression: string;
        ignoreCase: boolean;
        wholeMatch: boolean;
    },
    color: string;
};
