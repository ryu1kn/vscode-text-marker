
const DecorationRegistry = require('../../lib/decoration-registry');

suite('DecorationRegistry', () => {

    test('it registers string patterns and returns registry information', () => {
        const window = {createTextEditorDecorationType: () => 'DECORATION_TYPE'};
        const colourRegistry = {issue: () => 'pink'};
        const generateUuid = createGenerateUuid();
        const registry = new DecorationRegistry({generateUuid, colourRegistry, window});
        expect(registry.issue('TEXT')).to.eql({
            id: 'UUID_1',
            decorationType: 'DECORATION_TYPE',
            pattern: 'TEXT'
        });
    });

    test('it registers regex patterns and returns registry information', () => {
        const window = {createTextEditorDecorationType: () => 'DECORATION_TYPE'};
        const colourRegistry = {issue: () => 'pink'};
        const generateUuid = createGenerateUuid();
        const registry = new DecorationRegistry({generateUuid, colourRegistry, window});
        expect(registry.issue(/REGEX/)).to.eql({
            id: 'UUID_1',
            decorationType: 'DECORATION_TYPE',
            pattern: /REGEX/
        });
    });

    test('it does not register the same pattern multiple times', () => {
        const window = {createTextEditorDecorationType: () => 'DECORATION_TYPE'};
        const colourRegistry = {issue: sinon.spy()};
        const generateUuid = createGenerateUuid();
        const registry = new DecorationRegistry({generateUuid, colourRegistry, window});

        registry.issue('PATTERN');
        const secondResult = registry.issue('PATTERN');

        expect(secondResult).to.be.null;
        expect(colourRegistry.issue).to.have.been.calledOnce;
    });

    test('it returns a registered decoration type for the passed decoration id', () => {
        const window = {createTextEditorDecorationType: () => 'DECORATION_TYPE'};
        const colourRegistry = {issue: () => 'pink'};
        const generateUuid = createGenerateUuid();
        const registry = new DecorationRegistry({generateUuid, colourRegistry, window});

        registry.issue('TEXT');

        expect(registry.inquireById('UUID_1')).to.eql({
            id: 'UUID_1',
            decorationType: 'DECORATION_TYPE',
            pattern: 'TEXT'
        });
    });

    test('it returns a registered decoration type for the passed regex', () => {
        const window = {createTextEditorDecorationType: () => 'DECORATION_TYPE'};
        const colourRegistry = {issue: () => 'pink'};
        const generateUuid = createGenerateUuid();
        const registry = new DecorationRegistry({generateUuid, colourRegistry, window});

        registry.issue('TEXT');

        expect(registry.inquireByPattern('TEXT')).to.eql({
            id: 'UUID_1',
            decorationType: 'DECORATION_TYPE',
            pattern: 'TEXT'
        });
    });

    test('it does not confuse with regex and text pattern', () => {
        const window = {createTextEditorDecorationType: () => 'DECORATION_TYPE'};
        const colourRegistry = {issue: () => 'pink'};
        const generateUuid = createGenerateUuid();
        const registry = new DecorationRegistry({generateUuid, colourRegistry, window});

        const textPattern = '/PATTERN/';
        const regexPattern = /PATTERN/;
        registry.issue(textPattern);
        expect(registry.inquireByPattern(regexPattern)).to.be.null;
    });

    test("it can remove given pattern and it's associated decoration type from the registry", () => {
        const window = {createTextEditorDecorationType: () => 'DECORATION_TYPE'};
        const colourRegistry = {
            issue: () => 'pink',
            revoke: () => {}
        };
        const generateUuid = createGenerateUuid();
        const registry = new DecorationRegistry({generateUuid, colourRegistry, window});
        const decorationId = registry.issue('TEXT').id;
        registry.revoke(decorationId);
        expect(registry.inquireByPattern('TEXT')).to.be.null;
    });

    test('it can return all registered decorations at once', () => {
        const decorationTypes = ['DECORATION_TYPE_1', 'DECORATION_TYPE_2'];
        const generateUuid = createGenerateUuid();
        const colourRegistry = {issue: () => 'pink'};
        const window = {createTextEditorDecorationType: () => decorationTypes.shift()};
        const registry = new DecorationRegistry({generateUuid, colourRegistry, window});
        registry.issue('TEXT_1');
        registry.issue(/TEXT_2/);
        expect(registry.retrieveAll()).to.eql([
            {
                id: 'UUID_1',
                pattern: 'TEXT_1',
                decorationType: 'DECORATION_TYPE_1'
            },
            {
                id: 'UUID_2',
                pattern: /TEXT_2/,
                decorationType: 'DECORATION_TYPE_2'
            }
        ]);
    });

    test('it issues new decoration with new color', () => {
        const window = {createTextEditorDecorationType: sinon.stub().returns('DECORATION_TYPE')};
        const colourRegistry = {issue: stubReturns('pink', 'yellow')};
        const registry = new DecorationRegistry({
            generateUuid: createGenerateUuid(),
            colourRegistry,
            window
        });
        registry.issue('TEXT_1');
        registry.issue('TEXT_2');

        expect(window.createTextEditorDecorationType.args).to.eql([
            [{
                backgroundColor: 'pink',
                overviewRulerColor: 'violet',
                overviewRulerLane: 2
            }],
            [{
                backgroundColor: 'yellow',
                overviewRulerColor: 'violet',
                overviewRulerLane: 2
            }]
        ]);
    });

    test('it toggles the case sensitivity of a pattern', () => {
        const window = {createTextEditorDecorationType: () => 'DECORATION_TYPE'};
        const colourRegistry = {issue: () => 'pink'};
        const generateUuid = createGenerateUuid();
        const registry = new DecorationRegistry({generateUuid, colourRegistry, window});

        registry.issue('TEXT');

        expect(registry.updatePattern('UUID_1', 'TEXT')).to.eql({
            id: 'UUID_1',
            decorationType: 'DECORATION_TYPE',
            pattern: 'TEXT'
        });
    });

    function createGenerateUuid() {
        let i = 1;
        return () => `UUID_${i++}`;
    }

    function stubReturns() {
        const args = Array.prototype.slice.call(arguments);
        return args.reduce((stub, arg, index) => {
            stub.onCall(index).returns(arg);
            return stub;
        }, sinon.stub());
    }
});
