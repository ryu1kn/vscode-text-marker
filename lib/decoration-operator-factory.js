
const DecorationOperator = require('./decoration-operator');
const PatternConverter = require('./pattern-converter');

class DecorationOperatorFactory {

    constructor(params) {
        this._decorationRegistry = params.decorationRegistry;
        this._textDecorator = params.textDecorator;
        this._patternConverter = new PatternConverter();
    }

    create(editors) {
        return new DecorationOperator({
            editors,
            decorationRegistry: this._decorationRegistry,
            textDecorator: this._textDecorator,
            patternConverter: this._patternConverter
        });
    }

}

module.exports = DecorationOperatorFactory;
