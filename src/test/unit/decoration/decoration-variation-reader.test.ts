import {mockType} from '../../helpers/mock';

import DecorationVariationReader from '../../../lib/decoration/decoration-variation-reader';
import PatternFactory from '../../../lib/pattern/pattern-factory';
import WindowComponent from '../../../lib/vscode/window';
import MatchingModeRegistry from '../../../lib/matching-mode-registry';
import {QuickPickItem} from 'vscode';
import * as assert from 'assert';
import {none, some} from 'fp-ts/lib/Option';
import {Decoration} from '../../../lib/entities/decoration';
import {assertOption} from '../../helpers/assertions';
import {TelemetryReporterLocator} from '../../../lib/telemetry/telemetry-reporter-locator';
import {getVsTelemetryReporterCreator} from '../../../lib/telemetry/vscode-telemetry-reporter';
import {findFirst} from 'fp-ts/lib/Array';
import {task} from 'fp-ts/lib/Task';

suite('DecorationVariationReader', () => {
    TelemetryReporterLocator.load('package.json', getVsTelemetryReporterCreator(false));

    test('it lets user to toggle case sensitivity', async () => {
        const windowComponent = mockType<WindowComponent>({
            showQuickPick: (items: QuickPickItem[]) =>
                Promise.resolve(findFirst(items, item => item.label.includes('Case')))
        });
        const patternVariationReader = new DecorationVariationReader(windowComponent);

        const oldDecoration = createDecoration();
        const newDecorationOpt = await patternVariationReader.read(oldDecoration).run();

        assertOption(newDecorationOpt, newDecoration => {
            assert.equal(newDecoration.pattern.ignoreCase, !oldDecoration.pattern.ignoreCase);
        });
    });

    test('it lets user to toggle whole/partial match', async () => {
        const windowComponent = mockType<WindowComponent>({
            showQuickPick: (items: QuickPickItem[]) =>
                Promise.resolve(findFirst(items, item => item.label.includes('Whole')))
        });
        const patternVariationReader = new DecorationVariationReader(windowComponent);

        const oldDecoration = createDecoration();
        const newDecorationOpt = await patternVariationReader.read(oldDecoration).run();

        assertOption(newDecorationOpt, newDecoration => {
            assert.equal(newDecoration.pattern.wholeMatch, !oldDecoration.pattern.wholeMatch);
        });
    });

    test('it lets user to update the phrase of pattern', async () => {
        const windowComponent = mockType<WindowComponent>({
            showQuickPick: (items: QuickPickItem[]) =>
                Promise.resolve(findFirst(items, item => item.label.includes('Pattern'))),
            showInputBox: () => task.of(some('NEW_PHRASE'))
        });
        const patternVariationReader = new DecorationVariationReader(windowComponent);

        const oldDecoration = createDecoration();
        const newDecorationOpt = await patternVariationReader.read(oldDecoration).run();

        assertOption(newDecorationOpt, newDecoration => {
            assert.equal(newDecoration.pattern.phrase, 'NEW_PHRASE');
        });
    });

    test('it returns null if user selected nothing', async () => {
        const windowComponent = mockType<WindowComponent>({
            showQuickPick: (_items: QuickPickItem[]) => Promise.resolve(none)
        });
        const patternVariationReader = new DecorationVariationReader(windowComponent);

        const oldDecoration = createDecoration();
        const newDecorationOpt = await patternVariationReader.read(oldDecoration).run();

        assert.deepEqual(newDecorationOpt, none);
    });

    test('it returns null if user selected phrase-update but cancelled', async () => {
        const windowComponent = mockType<WindowComponent>({
            showQuickPick: (items: QuickPickItem[]) =>
                Promise.resolve(findFirst(items, item => item.label.includes('Pattern'))),
            showInputBox: () => task.of(none)
        });
        const patternVariationReader = new DecorationVariationReader(windowComponent);

        const oldDecoration = createDecoration();
        const newDecorationOpt = await patternVariationReader.read(oldDecoration).run();

        assert.deepEqual(newDecorationOpt, none);
    });

    function createDecoration() {
        return new Decoration('ID', createPattern(), 'yellow');
    }

    function createPattern() {
        const matchingModeRegistry = mockType<MatchingModeRegistry>({});
        const patternFactory = new PatternFactory(matchingModeRegistry);
        return patternFactory.create({phrase: 'PHRASE'});
    }

});
