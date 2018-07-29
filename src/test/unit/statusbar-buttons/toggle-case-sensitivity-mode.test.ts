import {expect, sinon} from '../../helpers/helper';
import {Event} from '../../../lib/const';
import ToggleCaseSensitivityModeButton from '../../../lib/statusbar-buttons/toggle-case-sensitivity-mode';

const EventEmitter = require('events');

suite('ToggleCaseSensitivityModeButton', () => {

    test('it initialises and shows the button once matching mode is prepared', done => {
        const eventBus = new EventEmitter();
        const statusBarItem = {show: sinon.spy()};
        new ToggleCaseSensitivityModeButton({eventBus, statusBarItem}); // eslint-disable-line no-new

        eventBus.on(Event.MATCHING_MODE_INITIALISED, () => {
            expect(statusBarItem).to.contain({
                command: 'textmarker.toggleModeForCaseSensitivity',
                text: '[Aa]',
                tooltip: 'TextMarker: Case Sensitive Mode'
            });
            expect(statusBarItem.show).to.have.been.called;
            done();
        });
        eventBus.emit(Event.MATCHING_MODE_INITIALISED, {ignoreCase: false});
    });

    test('it updates button appearance on receving case sensitivity mode change', done => {
        const eventBus = new EventEmitter();
        const statusBarItem = {show: sinon.spy()};
        new ToggleCaseSensitivityModeButton({eventBus, statusBarItem}); // eslint-disable-line no-new

        eventBus.on(Event.TOGGLED_CASE_SENSITIVITY, () => {
            expect(statusBarItem).to.contain({
                text: 'Aa',
                tooltip: 'TextMarker: Case Insensitive Mode'
            });
            expect(statusBarItem.show).to.not.have.been.called;
            done();
        });
        eventBus.emit(Event.TOGGLED_CASE_SENSITIVITY, {ignoreCase: true});
    });

});
