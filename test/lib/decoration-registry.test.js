
const DecorationRegistry = require('../../lib/decoration-registry');

suite('DecorationRegistry', () => {

    test('it returns a registered decoration type for the passed string', () => {
        const window = {createTextEditorDecorationType: () => 'DECORATION_TYPE'};
        const colourRegistry = {issue: () => 'pink'};
        const registry = new DecorationRegistry({colourRegistry, window});
        registry.issue('TEXT');
        expect(registry.inquireByPattern('TEXT')).to.eql('DECORATION_TYPE');
    });

    test('it returns a registered decoration type for the passed regex', () => {
        const window = {createTextEditorDecorationType: () => 'DECORATION_TYPE'};
        const colourRegistry = {issue: () => 'pink'};
        const registry = new DecorationRegistry({colourRegistry, window});
        registry.issue(/REGEX/);
        expect(registry.inquireByPattern(/REGEX/)).to.eql('DECORATION_TYPE');
    });

    test('it does not confuse with regex and text pattern', () => {
        const window = {createTextEditorDecorationType: () => 'DECORATION_TYPE'};
        const colourRegistry = {issue: () => 'pink'};
        const registry = new DecorationRegistry({colourRegistry, window});

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
        const registry = new DecorationRegistry({colourRegistry, window});
        registry.issue('TEXT');
        registry.revoke('TEXT');
        expect(registry.inquireByPattern('TEXT')).to.be.null;
    });

    test('it can return all registered decorations at once', () => {
        const decorationTypes = ['DECORATION_TYPE_1', 'DECORATION_TYPE_2'];
        const window = {createTextEditorDecorationType: () => decorationTypes.shift()};
        const colourRegistry = {issue: () => 'pink'};
        const registry = new DecorationRegistry({colourRegistry, window});
        registry.issue('TEXT_1');
        registry.issue(/TEXT_2/);
        expect(registry.retrieveAll()).to.eql([
            {
                pattern: 'TEXT_1',
                decorationType: 'DECORATION_TYPE_1'
            },
            {
                pattern: /TEXT_2/,
                decorationType: 'DECORATION_TYPE_2'
            }
        ]);
    });

    test('it issues new decoration with new color', () => {
        const window = {createTextEditorDecorationType: sinon.stub().returns('DECORATION_TYPE')};
        const colourRegistry = {issue: stubReturns('pink', 'yellow')};
        const registry = new DecorationRegistry({colourRegistry, window});
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

    function stubReturns() {
        const args = Array.prototype.slice.call(arguments);
        return args.reduce((stub, arg, index) => {
            stub.onCall(index).returns(arg);
            return stub;
        }, sinon.stub());
    }
});
