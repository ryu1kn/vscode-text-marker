
class TextLocator {

    constructor(params) {
        this._Range = params.Range;
    }

    locate(editor, pattern) {
        const entireText = editor.document.getText();
        const ranges = pattern instanceof RegExp ?
                this._locateWithRegex(entireText, pattern) :
                this._locateWithString(entireText, pattern);
        return ranges.map(range => this._getRangeFromOffset(range.startOffset, range.endOffset, editor));
    }

    _locateWithRegex(entireText, pattern) {
        const adjustedPattern = this._getAdjustedRegex(pattern);
        const ranges = [];

        entireText.replace(adjustedPattern, (match, ...args) => {
            const matchLength = match.length;
            if (matchLength > 0) {
                const offset = args[args.length - 2];
                ranges.push({
                    startOffset: offset,
                    endOffset: offset + matchLength
                });
            }
            return match;
        });
        return ranges;
    }

    _getAdjustedRegex(regex) {
        const flags = regex.flags;
        const flagsWithG = flags.includes('g') ? flags : `${flags}g`;
        return new RegExp(regex, flagsWithG);
    }

    _locateWithString(entireText, pattern) {
        const memo = {
            ranges: [],
            lastOffset: 0
        };
        const textInFrontOfSelectedText = entireText.split(pattern).slice(0, -1);
        const finalMemo = textInFrontOfSelectedText.reduce((memo, textInFront) => {
            const startOffset = memo.lastOffset + textInFront.length;
            const endOffset = startOffset + pattern.length;
            return {
                ranges: memo.ranges.concat({startOffset, endOffset}),
                lastOffset: endOffset
            };
        }, memo);
        return finalMemo.ranges;
    }

    _getRangeFromOffset(startOffset, endOffset, editor) {
        return new this._Range(
            editor.document.positionAt(startOffset),
            editor.document.positionAt(endOffset)
        );
    }

}

module.exports = TextLocator;
