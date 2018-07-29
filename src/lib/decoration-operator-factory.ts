import DecorationOperator from './decoration-operator';
import PatternConverter from './pattern-converter';

export default class DecorationOperatorFactory {
    private _decorationRegistry: any;
    private _textDecorator: any;
    private _patternConverter: any;
    private _windowComponent: any;

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
