
'use strict';

const DecorationOperator = require('./decoration-operator');

class DecorationOperatorFactory {

    constructor(params) {
        this._decorationRegistry = params.decorationRegistry;
        this._textDecorator = params.textDecorator;
    }

    create(editors) {
        return new DecorationOperator({
            editors,
            decorationRegistry: this._decorationRegistry,
            textDecorator: this._textDecorator
        });
    }

}

module.exports = DecorationOperatorFactory;
