import {Logger} from '../../lib/Logger';

export default class DummyLogger implements Logger {
    error(...args: any[]): void {}
}
