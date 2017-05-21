
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

        let endOffsetInEntireText = 0;
        let remainingText = entireText;
        let match = remainingText.match(adjustedPattern);

        let startOffsetInEntireText;
        let startOffsetInRemainingText;
        let matchTextLength;
        while (match) {
            startOffsetInRemainingText = match.index;
            matchTextLength = match[0].length;
            startOffsetInEntireText = endOffsetInEntireText + startOffsetInRemainingText;
            endOffsetInEntireText = startOffsetInEntireText + matchTextLength;
            ranges.push({
                startOffset: startOffsetInEntireText,
                endOffset: endOffsetInEntireText
            });

            remainingText = remainingText.substring(startOffsetInRemainingText + matchTextLength);
            match = remainingText.match(adjustedPattern);
        }
        return ranges;
    }

    _getAdjustedRegex(regex) {
        const flagsWithoutG = regex.flags.replace('g', '');
        return new RegExp(regex, flagsWithoutG);
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
