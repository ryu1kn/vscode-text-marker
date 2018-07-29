import DecorationOperator from './decoration-operator';
import PatternConverter from './pattern-converter';

export default class DecorationOperatorFactory {
    private readonly decorationRegistry: any;
    private readonly textDecorator: any;
    private readonly patternConverter: any;
    private readonly windowComponent: any;

    constructor(params) {
        this.decorationRegistry = params.decorationRegistry;
        this.textDecorator = params.textDecorator;
        this.patternConverter = new PatternConverter();
        this.windowComponent = params.windowComponent;
    }

    createForVisibleEditors() {
        return this.create(this.windowComponent.visibleTextEditors);
    }

    create(editors) {
        return new DecorationOperator({
            editors,
            decorationRegistry: this.decorationRegistry,
            textDecorator: this.textDecorator,
            patternConverter: this.patternConverter
        });
    }

}
