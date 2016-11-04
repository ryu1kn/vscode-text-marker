
const DecorationRegistry = require('../../lib/decoration-registry');

suite('DecorationRegistry', () => {

    const OverviewRulerLane = {Center: 'OVERVIEW_RULER_LANE'};

    test('it returns a registered decoration type for the passed string', () => {
        const window = {createTextEditorDecorationType: () => 'DECORATION_TYPE'};
        const colourRegistry = {issue: () => 'pink'};
        const registry = new DecorationRegistry({colourRegistry, window, OverviewRulerLane});
        registry.issue('TEXT');
        expect(registry.inquire('TEXT')).to.eql('DECORATION_TYPE');
    });

    test("it can remove given text and it's associated decoration type from the registry", () => {
        const window = {createTextEditorDecorationType: () => 'DECORATION_TYPE'};
        const colourRegistry = {
            issue: () => 'pink',
            revoke: () => {}
        };
        const registry = new DecorationRegistry({colourRegistry, window, OverviewRulerLane});
        registry.issue('TEXT');
        registry.revoke('TEXT');
        expect(registry.inquire('TEXT')).to.be.null;
    });

    test('it can return all registered decorations at once', () => {
        const decorationTypes = ['DECORATION_TYPE_1', 'DECORATION_TYPE_2'];
        const window = {
            createTextEditorDecorationType: () => decorationTypes.shift()};
        const colourRegistry = {issue: () => 'pink'};
        const registry = new DecorationRegistry({colourRegistry, window, OverviewRulerLane});
        registry.issue('TEXT_1');
        registry.issue('TEXT_2');
        expect(registry.retrieveAll()).to.eql({
            TEXT_1: 'DECORATION_TYPE_1',
            TEXT_2: 'DECORATION_TYPE_2'
        });
    });

    test('it issues new decoration with new color', () => {
        const window = {createTextEditorDecorationType: sinon.stub().returns('DECORATION_TYPE')};
        const colourRegistry = {issue: stubReturns('pink', 'yellow')};
        const registry = new DecorationRegistry({colourRegistry, window, OverviewRulerLane});
        registry.issue('TEXT_1');
        registry.issue('TEXT_2');

        expect(window.createTextEditorDecorationType.args).to.eql([
            [{
                backgroundColor: 'pink',
                overviewRulerColor: 'violet',
                overviewRulerLane: 'OVERVIEW_RULER_LANE'
            }],
            [{
                backgroundColor: 'yellow',
                overviewRulerColor: 'violet',
                overviewRulerLane: 'OVERVIEW_RULER_LANE'
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
