import {expect, mockTypeWithMethod, verify} from '../../helpers/helper';
import {Event} from '../../../lib/const';
import ToggleWholeMatchModeButton from '../../../lib/statusbar-buttons/toggle-whole-match-mode';
import {StatusBarItem} from "vscode";

const EventEmitter = require('events');

suite('ToggleWholeMatchModeButton', () => {

    test('it initialises and shows the button once matching mode is prepared', done => {
        const eventBus = new EventEmitter();
        const statusBarItem = mockTypeWithMethod<StatusBarItem>(['show']);
        new ToggleWholeMatchModeButton(eventBus, statusBarItem);

        eventBus.on(Event.MATCHING_MODE_INITIALISED, () => {
            expect(statusBarItem.command).to.eql('textmarker.toggleModeForWholeMatch');
            expect(statusBarItem.text).to.eql('Ab|');
            expect(statusBarItem.tooltip).to.eql('TextMarker: Non-Whole Match Mode');
            verify(statusBarItem.show());
            done();
        });
        eventBus.emit(Event.MATCHING_MODE_INITIALISED, {wholeMatch: false});
    });

    test('it updates button appearance on receving whole match mode change', done => {
        const eventBus = new EventEmitter();
        const statusBarItem = mockTypeWithMethod<StatusBarItem>(['show']);
        new ToggleWholeMatchModeButton(eventBus, statusBarItem);

        eventBus.on(Event.WHOLE_MATCH_MODE_TOGGLED, () => {
            expect(statusBarItem.text).to.eql('[Ab|]');
            expect(statusBarItem.tooltip).to.eql('TextMarker: Whole Match Mode');
            verify(statusBarItem.show(), {times: 0});
            done();
        });
        eventBus.emit(Event.WHOLE_MATCH_MODE_TOGGLED, {wholeMatch: true});
    });

});
