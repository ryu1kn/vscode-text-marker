import * as fs from 'fs';
import * as path from 'path';
import Mocha = require('mocha');
import './stub-vscode';

// VS Code 调试入口使用与命令行相同的模拟测试, 不依赖已移除的旧 vscode 测试运行器.
export function run(): Promise<void> {
    const mocha = new Mocha({ui: 'tdd', color: true});
    function addTests(directory: string): void {
        for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
            const file = path.join(directory, entry.name);
            if (entry.isDirectory()) addTests(file);
            else if (entry.name.endsWith('.test.js')) mocha.addFile(file);
        }
    }
    addTests(__dirname);
    return new Promise((resolve, reject) => {
        mocha.run(failures => failures ? reject(new Error(`${failures} tests failed`)) : resolve());
    });
}
