import {verify, wrapVerify} from '../../helpers/mock';

import AppIntegrator from '../../../lib/app-integrator';
import {createFakeEditor} from '../helpers/fake-editor';
import {createFakeVsCode, EXECUTION_CONTEXT} from '../helpers/fake-vscode';
import {Position, Range} from 'vscode';
import {NullVsTelemetryReporter, TelemetryReporterLocator} from '../../../lib/telemetry-reporter';
import {join} from 'path';

suite('Highlight command', () => {

    let editor1: any;
    let editor2: any;
    let editor3: any;
    let command: any;
    let fakeVscode: any;
    const packageJsonPath = join(__dirname, '..', '..', '..', '..', 'package.json');
    const createNullVsTelemetryReporter = () => new NullVsTelemetryReporter();

    setup(() => {
        editor1 = createFakeEditor({wholeText: 'A TEXT B TEXT C', selectedText: 'TEXT'});
        editor2 = createFakeEditor({wholeText: 'a TEXT'});
        editor3 = createFakeEditor({wholeText: 'a TEXT', selectedText: 'TEX'});
        fakeVscode = createFakeVsCode({editors: [editor1, editor2, editor3]});
        TelemetryReporterLocator.load(packageJsonPath, createNullVsTelemetryReporter);

        AppIntegrator.create(fakeVscode, console).integrate(EXECUTION_CONTEXT);

        command = fakeVscode._commands['textmarker.toggleHighlight'];
    });

    test('highlights selected text', async () => {
        await command(editor1);

        verify(editor1.setDecorations('DECORATION_TYPE_1', [
            new Range(new Position(0, 2), new Position(0, 6)),
            new Range(new Position(0, 9), new Position(0, 13))
        ]));
        verify(editor2.setDecorations('DECORATION_TYPE_1', [
            new Range(new Position(0, 2), new Position(0, 6))
        ]));
    });

    test('add another highlight to the substring of already selected text', async () => {
        await command(editor1);
        await command(editor3);

        wrapVerify((c1, c2) => verify(editor1.setDecorations(c1(), c2())), {
            call1: [
                'DECORATION_TYPE_2',
                [
                    new Range(new Position(0, 2), new Position(0, 5)),
                    new Range(new Position(0, 9), new Position(0, 12))
                ]
            ]
        });
        wrapVerify((c1, c2) => verify(editor3.setDecorations(c1(), c2())), {
            call1: [
                'DECORATION_TYPE_2',
                [
                    new Range(new Position(0, 2), new Position(0, 5))
                ]
            ]
        });
    });

    test('unhighlight selected text if the exact text is already selected', async () => {
        await command(editor1);
        await command(editor1);

        wrapVerify((c1, c2) => verify(editor1.setDecorations(c1(), c2())), {
            call1: ['DECORATION_TYPE_1', []]
        });
        wrapVerify((c1, c2) => verify(editor2.setDecorations(c1(), c2())), {
            call1: ['DECORATION_TYPE_1', []]
        });
    });
});
