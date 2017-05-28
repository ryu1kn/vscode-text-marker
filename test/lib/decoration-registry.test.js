
const DecorationRegistry = require('../../lib/decoration-registry');
const PatternFactory = require('../../lib/pattern-factory');

suite('DecorationRegistry', () => {

    test('it registers a pattern and returns registry information', () => {
        const window = {createTextEditorDecorationType: () => 'DECORATION_TYPE'};
        const colourRegistry = {issue: () => 'pink'};
        const generateUuid = createGenerateUuid();
        const registry = new DecorationRegistry({generateUuid, colourRegistry, window});

        const pattern = createPattern('PATTERN');
        expect(registry.issue(pattern)).to.eql({
            id: 'UUID_1',
            decorationType: 'DECORATION_TYPE',
            pattern
        });
    });

    test('it does not register the same pattern multiple times', () => {
        const window = {createTextEditorDecorationType: () => 'DECORATION_TYPE'};
        const colourRegistry = {issue: sinon.spy()};
        const generateUuid = createGenerateUuid();
        const registry = new DecorationRegistry({generateUuid, colourRegistry, window});

        registry.issue(createPattern('PATTERN'));
        const secondResult = registry.issue(createPattern('PATTERN'));

        expect(secondResult).to.be.null;
        expect(colourRegistry.issue).to.have.been.calledOnce;
    });

    test('it returns a registered decoration type for the passed decoration id', () => {
        const window = {createTextEditorDecorationType: () => 'DECORATION_TYPE'};
        const colourRegistry = {issue: () => 'pink'};
        const generateUuid = createGenerateUuid();
        const registry = new DecorationRegistry({generateUuid, colourRegistry, window});

        const pattern = createPattern('PATTERN');
        registry.issue(createPattern('PATTERN'));

        expect(registry.inquireById('UUID_1')).to.eql({
            id: 'UUID_1',
            decorationType: 'DECORATION_TYPE',
            pattern
        });
    });

    test('it returns a registered decoration type for the passed regex', () => {
        const window = {createTextEditorDecorationType: () => 'DECORATION_TYPE'};
        const colourRegistry = {issue: () => 'pink'};
        const generateUuid = createGenerateUuid();
        const registry = new DecorationRegistry({generateUuid, colourRegistry, window});

        const pattern = createPattern('PATTERN');
        registry.issue(pattern);

        expect(registry.inquireByPattern(pattern)).to.eql({
            id: 'UUID_1',
            decorationType: 'DECORATION_TYPE',
            pattern: pattern
        });
    });

    test("it can remove given pattern and it's associated decoration type from the registry", () => {
        const window = {createTextEditorDecorationType: () => 'DECORATION_TYPE'};
        const colourRegistry = {
            issue: () => 'pink',
            revoke: () => {}
        };
        const generateUuid = createGenerateUuid();
        const registry = new DecorationRegistry({generateUuid, colourRegistry, window});

        const pattern = createPattern('PATTERN');
        const decorationId = registry.issue(pattern).id;
        registry.revoke(decorationId);
        expect(registry.inquireByPattern(pattern)).to.be.null;
    });

    test('it can return all registered decorations at once', () => {
        const decorationTypes = ['DECORATION_TYPE_1', 'DECORATION_TYPE_2'];
        const generateUuid = createGenerateUuid();
        const colourRegistry = {issue: () => 'pink'};
        const window = {createTextEditorDecorationType: () => decorationTypes.shift()};
        const registry = new DecorationRegistry({generateUuid, colourRegistry, window});
        const pattern1 = createPattern('PATTERN_1');
        const pattern2 = createPattern('PATTERN_2');
        registry.issue(pattern1);
        registry.issue(pattern2);
        expect(registry.retrieveAll()).to.eql([
            {
                id: 'UUID_1',
                pattern: pattern1,
                decorationType: 'DECORATION_TYPE_1'
            },
            {
                id: 'UUID_2',
                pattern: pattern2,
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
        registry.issue(createPattern('TEXT_1'));
        registry.issue(createPattern('TEXT_2'));

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

        const pattern = createPattern('TEXT');
        registry.issue(pattern);

        expect(registry.updatePattern('UUID_1', 'TEXT')).to.eql({
            id: 'UUID_1',
            decorationType: 'DECORATION_TYPE',
            pattern: 'TEXT'
        });
    });

    function createPattern(phrase) {
        return new PatternFactory().create({phrase});
    }

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
