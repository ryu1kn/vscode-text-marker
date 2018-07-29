import {expect, sinon} from '../../helpers/helper';
import {Event} from '../../../lib/const';
import ToggleWholeMatchModeButton from '../../../lib/statusbar-buttons/toggle-whole-match-mode';

const EventEmitter = require('events');

suite('ToggleWholeMatchModeButton', () => {

    test('it initialises and shows the button once matching mode is prepared', done => {
        const eventBus = new EventEmitter();
        const statusBarItem = {show: sinon.spy()};
        new ToggleWholeMatchModeButton({eventBus, statusBarItem}); // eslint-disable-line no-new

        eventBus.on(Event.MATCHING_MODE_INITIALISED, () => {
            expect(statusBarItem).to.contain({
                command: 'textmarker.toggleModeForWholeMatch',
                text: 'Ab|',
                tooltip: 'TextMarker: Non-Whole Match Mode'
            });
            expect(statusBarItem.show).to.have.been.called;
            done();
        });
        eventBus.emit(Event.MATCHING_MODE_INITIALISED, {wholeMatch: false});
    });

    test('it updates button appearance on receving whole match mode change', done => {
        const eventBus = new EventEmitter();
        const statusBarItem = {show: sinon.spy()};
        new ToggleWholeMatchModeButton({eventBus, statusBarItem}); // eslint-disable-line no-new

        eventBus.on(Event.WHOLE_MATCH_MODE_TOGGLED, () => {
            expect(statusBarItem).to.contain({
                text: '[Ab|]',
                tooltip: 'TextMarker: Whole Match Mode'
            });
            expect(statusBarItem.show).to.not.have.been.called;
            done();
        });
        eventBus.emit(Event.WHOLE_MATCH_MODE_TOGGLED, {wholeMatch: true});
    });

});
