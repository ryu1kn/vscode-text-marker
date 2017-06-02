
const ToggleCaseSensitivityModeButton = require('../../lib/toggle-case-sensitivity-mode-button');
const EventEmitter = require('events');

suite('ToggleCaseSensitivityModeButton', () => {

    test('it initialises and shows the button once matching mode is prepared', done => {
        const eventBus = new EventEmitter();
        const statusBarItem = {show: sinon.spy()};
        new ToggleCaseSensitivityModeButton({eventBus, statusBarItem}); // eslint-disable-line no-new

        eventBus.on('MATCHING_MODE_INITIALISED', () => {
            expect(statusBarItem).to.contain({
                command: 'textmarker.toggleCaseSensitivityMode',
                text: 'Aa',
                tooltip: 'TextMarker: Case sensitive mode'
            });
            expect(statusBarItem.show).to.have.been.called;
            done();
        });
        eventBus.emit('MATCHING_MODE_INITIALISED', {ignoreCase: false});
    });

    test('it updates button appearance on receving case sensitivity mode change', done => {
        const eventBus = new EventEmitter();
        const statusBarItem = {show: sinon.spy()};
        new ToggleCaseSensitivityModeButton({eventBus, statusBarItem}); // eslint-disable-line no-new

        eventBus.on('TOGGLED_CASE_SENSITIVITY', () => {
            expect(statusBarItem).to.contain({
                text: '[Aa]',
                tooltip: 'TextMarker: ignore case mode'
            });
            expect(statusBarItem.show).to.not.have.been.called;
            done();
        });
        eventBus.emit('TOGGLED_CASE_SENSITIVITY', {ignoreCase: true});
    });

});
