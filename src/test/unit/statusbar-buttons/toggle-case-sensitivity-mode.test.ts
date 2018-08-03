import {expect, mockMethods, verify} from '../../helpers/helper';
import {Event} from '../../../lib/const';
import ToggleCaseSensitivityModeButton from '../../../lib/statusbar-buttons/toggle-case-sensitivity-mode';
import {StatusBarItem} from 'vscode';

const EventEmitter = require('events');

suite('ToggleCaseSensitivityModeButton', () => {

    test('it initialises and shows the button once matching mode is prepared', done => {
        const eventBus = new EventEmitter();
        const statusBarItem = mockMethods<StatusBarItem>(['show']);
        new ToggleCaseSensitivityModeButton(eventBus, statusBarItem);

        eventBus.on(Event.MATCHING_MODE_INITIALISED, () => {
            expect(statusBarItem.command).to.eql('textmarker.toggleModeForCaseSensitivity');
            expect(statusBarItem.text).to.eql('[Aa]');
            expect(statusBarItem.tooltip).to.eql('TextMarker: Case Sensitive Mode');
            verify(statusBarItem.show());
            done();
        });
        eventBus.emit(Event.MATCHING_MODE_INITIALISED, {ignoreCase: false});
    });

    test('it updates button appearance on receving case sensitivity mode change', done => {
        const eventBus = new EventEmitter();
        const statusBarItem = mockMethods<StatusBarItem>(['show']);
        new ToggleCaseSensitivityModeButton(eventBus, statusBarItem);

        eventBus.on(Event.TOGGLED_CASE_SENSITIVITY, () => {
            expect(statusBarItem.text).to.eql('Aa');
            expect(statusBarItem.tooltip).to.eql('TextMarker: Case Insensitive Mode');
            verify(statusBarItem.show(), {times: 0});
            done();
        });
        eventBus.emit(Event.TOGGLED_CASE_SENSITIVITY, {ignoreCase: true});
    });

});
