import {any, mock, mockType, verify, when} from '../../helpers/mock';

import DecorationPicker from '../../../lib/decoration/decoration-picker';
import PatternFactory from '../../../lib/pattern/pattern-factory';
import MatchingModeRegistry from '../../../lib/matching-mode-registry';
import DecorationRegistry from '../../../lib/decoration/decoration-registry';
import WindowComponent from '../../../lib/vscode/window';
import * as assert from 'assert';
import {Decoration} from '../../../lib/entities/decoration';
import {none, some} from 'fp-ts/lib/Option';
import {task} from 'fp-ts/lib/Task';

suite('DecorationPicker', () => {

    const matchingModeRegistry = mockType<MatchingModeRegistry>({});
    const patternFactory = new PatternFactory(matchingModeRegistry);

    const decoration1 = mockType<Decoration>({
        id: 'DECORATION_ID_1',
        decorationType: 'DECORATION_TYPE_1',
        pattern: patternFactory.create({phrase: 'TEXT_1', ignoreCase: true})
    });
    const decoration2 = mockType<Decoration>({
        id: 'DECORATION_ID_2',
        decorationType: 'DECORATION_TYPE_2',
        pattern: patternFactory.create({phrase: 'TEXT_2', type: 'RegExp', ignoreCase: true})
    });
    const decoration3 = mockType<Decoration>({
        id: 'DECORATION_ID_3',
        decorationType: 'DECORATION_TYPE_3',
        pattern: patternFactory.create({phrase: 'TEXT_3'})
    });
    const decoration4 = mockType<Decoration>({
        id: 'DECORATION_ID_4',
        decorationType: 'DECORATION_TYPE_4',
        pattern: patternFactory.create({phrase: 'TEXT_4', type: 'RegExp'})
    });
    const decoration5 = mockType<Decoration>({
        id: 'DECORATION_ID_5',
        decorationType: 'DECORATION_TYPE_5',
        pattern: patternFactory.create({phrase: 'TEXT_5', wholeMatch: true})
    });

    test('it lets user to pick a highlight pattern', async () => {
        const windowComponent = mock(WindowComponent);
        when(windowComponent.showQuickPick(
            [
                {label: 'TEXT_1', detail: 'String', decoration: decoration1},
                {label: '/TEXT_2/i', detail: 'RegExp', decoration: decoration2}
            ],
            {placeHolder: 'PLACEHOLDER_MESSAGE'}
        )).thenReturn(task.of(some({
            label: 'TEXT_1', detail: 'String', decoration: decoration1
        })));
        const decorationRegistry = mock(DecorationRegistry);
        when(decorationRegistry.retrieveAll()).thenReturn([decoration1, decoration2]);

        const picker = new DecorationPicker(decorationRegistry, windowComponent);
        const decoration = await picker.pick('PLACEHOLDER_MESSAGE');

        assert.deepEqual(decoration, some(decoration1));
    });

    test('it shows "[Aa]" symbol if a pattern is case sensitive', async () => {
        const windowComponent = mock(WindowComponent);
        when(windowComponent.showQuickPick(
            [
                {label: 'TEXT_3', detail: 'String [Aa]', decoration: decoration3},
                {label: '/TEXT_4/', detail: 'RegExp [Aa]', decoration: decoration4}
            ],
            {placeHolder: 'PLACE_HOLDER_TEXT'}
        )).thenReturn(task.of(none));

        const decorationRegistry = mock(DecorationRegistry);
        when(decorationRegistry.retrieveAll()).thenReturn([decoration3, decoration4]);
        const picker = new DecorationPicker(decorationRegistry, windowComponent);
        await picker.pick('PLACE_HOLDER_TEXT');
    });

    test('it shows /i flag on regex if a pattern is case insensitive', async () => {
        const windowComponent = mock(WindowComponent);
        when(windowComponent.showQuickPick(
            [{label: '/TEXT_2/i', detail: 'RegExp', decoration: decoration2}],
            {placeHolder: 'PLACE_HOLDER_TEXT'}
        )).thenReturn(task.of(none));

        const decorationRegistry = mock(DecorationRegistry);
        when(decorationRegistry.retrieveAll()).thenReturn([decoration2]);
        const picker = new DecorationPicker(decorationRegistry, windowComponent);

        await picker.pick('PLACE_HOLDER_TEXT');
    });

    test('it shows "[Aa|]" symbol if a pattern is case sensitive', async () => {
        const windowComponent = mock(WindowComponent);
        when(windowComponent.showQuickPick(
            [{label: 'TEXT_5', detail: 'String [Aa] [Ab|]', decoration: decoration5}],
            {placeHolder: 'PLACE_HOLDER_TEXT'}
        )).thenReturn(task.of(none));

        const decorationRegistry = mock(DecorationRegistry);
        when(decorationRegistry.retrieveAll()).thenReturn([decoration5]);
        const picker = new DecorationPicker(decorationRegistry, windowComponent);
        await picker.pick('PLACE_HOLDER_TEXT');
    });

    test('it returns none if nothing selected', async () => {
        const windowComponent = mock(WindowComponent);
        when(windowComponent.showQuickPick(any(), any())).thenReturn(task.of(none));
        const decorationRegistry = mock(DecorationRegistry);
        when(decorationRegistry.retrieveAll()).thenReturn([decoration3]);
        const picker = new DecorationPicker(decorationRegistry, windowComponent);
        const decorationId = await picker.pick('PLACE_HOLDER_TEXT');

        assert.equal(decorationId, none);
    });

    test('it shows a message instead of picker if no patterns are registered yet', async () => {
        const windowComponent = mock(WindowComponent);
        const decorationRegistry = mock(DecorationRegistry);
        when(decorationRegistry.retrieveAll()).thenReturn([]);
        const picker = new DecorationPicker(decorationRegistry, windowComponent);
        const decorationId = await picker.pick('PLACE_HOLDER_TEXT');

        assert.equal(decorationId, none);
        verify(windowComponent.showQuickPick(any(), any()), {times: 0});
        verify(windowComponent.showInformationMessage('No highlight is registered yet'));
    });
});
