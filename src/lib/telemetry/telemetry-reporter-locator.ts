import * as fs from 'fs';
import {VsTelemetryReporterCreator} from './vscode-telemetry-reporter';
import {TelemetryReporter} from './telemetry-reporter';

const getTelemetryConfig = (packageJsonPath: string) => {
    const {publisher, name, version, telemetryKey} = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return {
        id: `${publisher}.${name}`,
        version,
        telemetryKey
    };
};

export class TelemetryReporterLocator {
    private static telemetryReporter: TelemetryReporter;

    static load(packageConfPath: string, reporterCreator: VsTelemetryReporterCreator): void {
        const config = getTelemetryConfig(packageConfPath);
        const vsTelemetryReporter = reporterCreator(config.id, config.version, config.telemetryKey);
        TelemetryReporterLocator.telemetryReporter = new TelemetryReporter(vsTelemetryReporter);
    }

    static getReporter(): TelemetryReporter {
        return TelemetryReporterLocator.telemetryReporter;
    }
}
