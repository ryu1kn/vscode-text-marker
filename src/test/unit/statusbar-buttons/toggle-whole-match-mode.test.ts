import {mockMethods, verify} from '../../helpers/mock';
import {Event} from '../../../lib/const';
import ToggleWholeMatchModeButton from '../../../lib/statusbar-buttons/toggle-whole-match-mode';
import {StatusBarItem} from 'vscode';
import * as assert from 'assert';

const EventEmitter = require('events');

suite('ToggleWholeMatchModeButton', () => {

    test('it initialises and shows the button once matching mode is prepared', done => {
        const eventBus = new EventEmitter();
        const statusBarItem = mockMethods<StatusBarItem>(['show']);
        new ToggleWholeMatchModeButton(eventBus, statusBarItem);

        eventBus.on(Event.MATCHING_MODE_INITIALISED, () => {
            assert.deepEqual(statusBarItem.command, 'textmarker.toggleModeForWholeMatch');
            assert.deepEqual(statusBarItem.text, 'Ab|');
            assert.deepEqual(statusBarItem.tooltip, 'TextMarker: Non-Whole Match Mode');
            verify(statusBarItem.show());
            done();
        });
        eventBus.emit(Event.MATCHING_MODE_INITIALISED, {wholeMatch: false});
    });

    test('it updates button appearance on receving whole match mode change', done => {
        const eventBus = new EventEmitter();
        const statusBarItem = mockMethods<StatusBarItem>(['show']);
        new ToggleWholeMatchModeButton(eventBus, statusBarItem);

        eventBus.on(Event.WHOLE_MATCH_MODE_TOGGLED, () => {
            assert.deepEqual(statusBarItem.text, '[Ab|]');
            assert.deepEqual(statusBarItem.tooltip, 'TextMarker: Whole Match Mode');
            verify(statusBarItem.show(), {times: 0});
            done();
        });
        eventBus.emit(Event.WHOLE_MATCH_MODE_TOGGLED, {wholeMatch: true});
    });

});
