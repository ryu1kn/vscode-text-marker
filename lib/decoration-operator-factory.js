
const DecorationOperator = require('./decoration-operator');
const PatternConverter = require('./pattern-converter');

class DecorationOperatorFactory {

    constructor(params) {
        this._decorationRegistry = params.decorationRegistry;
        this._textDecorator = params.textDecorator;
        this._patternConverter = new PatternConverter();
        this._windowComponent = params.windowComponent;
    }

    createForVisibleEditors() {
        return this.create(this._windowComponent.visibleTextEditors);
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
