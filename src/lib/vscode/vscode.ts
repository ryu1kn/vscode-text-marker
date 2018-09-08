import TextEditor from './text-editor';

export type ExtensionContextLike = {
    subscriptions: any[]
};

export interface CommandLike {
    execute(editor?: TextEditor): Promise<any> | any;
}
