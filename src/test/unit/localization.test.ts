import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import {task} from 'fp-ts/lib/Task';
import {none} from 'fp-ts/lib/Option';
import {EventEmitter} from 'events';
import {setTestLanguage} from '../stub-vscode';
import RegexReader from '../../lib/regex-reader';
import MatchingModeRegistry from '../../lib/matching-mode-registry';
import WindowComponent from '../../lib/vscode/window';
import DecorationVariationReader from '../../lib/decoration/decoration-variation-reader';
import {Decoration} from '../../lib/entities/decoration';
import PatternFactory from '../../lib/pattern/pattern-factory';
import {TelemetryReporterLocator} from '../../lib/telemetry/telemetry-reporter-locator';
import {getVsTelemetryReporterCreator} from '../../lib/telemetry/vscode-telemetry-reporter';
import {mockType} from '../helpers/mock';

const root = path.resolve(__dirname, '../../..');
const read = (relative: string) => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));

suite('Localization resources', () => {
    teardown(() => setTestLanguage('en'));
    test('provides complete static translations without changing command identifiers', () => {
        const manifest = read('package.json');
        const en = read('package.nls.json');
        const references = JSON.stringify(manifest).match(/%[^%]+%/g)!.map(match => match.slice(1, -1));
        assert.deepEqual([...new Set(references)].sort(), Object.keys(en).sort());
        for (const locale of ['zh-cn', 'zh-tw']) {
            const translated = read(`package.nls.${locale}.json`);
            assert.deepEqual(Object.keys(translated).sort(), Object.keys(en).sort());
            for (const value of Object.values(translated)) assert.ok(/[\u3400-\u9fff]/.test(value as string));
        }
        assert.ok(manifest.contributes.commands.some((item: any) => item.command === 'textmarker.toggleHighlight'));
        assert.equal(manifest.l10n, './l10n');
    });
    test('covers every runtime translation call in the source tree', () => {
        const keys = new Set<string>();
        function scan(directory: string): void {
            for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
                const file = path.join(directory, entry.name);
                if (entry.isDirectory()) scan(file);
                else if (entry.name.endsWith('.ts')) {
                    const content = fs.readFileSync(file, 'utf8');
                    const pattern = /l10n\.t\('([^']+)'\)/g;
                    let match: RegExpExecArray | null;
                    while ((match = pattern.exec(content)) !== null) keys.add(match[1]);
                }
            }
        }
        scan(path.join(root, 'src/lib'));
        const en = read('l10n/bundle.l10n.json');
        assert.deepEqual([...keys].sort(), Object.keys(en).sort());
        for (const locale of ['zh-cn', 'zh-tw']) {
            assert.deepEqual(Object.keys(read(`l10n/bundle.l10n.${locale}.json`)).sort(), Object.keys(en).sort());
        }
    });
    for (const [locale,regexTitle,errorText,editTitle] of [
        ['en', 'Enter a regular expression without enclosing / characters', 'Invalid regular expression.', 'Edit matching text'],
        ['zh-cn', '输入正则表达式, 不需要两端的 /', '正则表达式无效', '修改匹配文本'],
        ['zh-tw', '輸入規則運算式, 不需要兩端的 /', '規則運算式無效', '修改比對文字'],
        ['de', 'Enter a regular expression without enclosing / characters', 'Invalid regular expression.', 'Edit matching text']
    ]) {
        test(`uses ${locale} or English fallback for prompts, validation and editing`, async () => {
            setTestLanguage(locale);
            const modes = new MatchingModeRegistry(false, false, new EventEmitter());
            let input: any;
            let labels: string[] = [];
            const window = mockType<WindowComponent>({
                showInputBox: (options: any) => {input = options;return task.of(none);},
                showQuickPick: (items: any[]) => {labels = items.map(item => item.label);return task.of(none);}
            });
            await new RegexReader(modes, window).read()();
            assert.equal(input.placeHolder, regexTitle);
            assert.equal(input.validateInput('au8_data\\[\\d+\\]'), undefined);
            for (const value of ['[', '(', '\\', 'a{2,1}']) assert.ok(input.validateInput(value).startsWith(errorText));
            TelemetryReporterLocator.load(path.join(root, 'package.json'), getVsTelemetryReporterCreator(false));
            const decoration = new Decoration('test', new PatternFactory(modes).create({phrase: 'au8_data[0]'}), '#00BCD4');
            await new DecorationVariationReader(window).read(decoration)();
            assert.equal(labels.length, 4);
            assert.equal(labels[2], editTitle);
        });
    }
});
