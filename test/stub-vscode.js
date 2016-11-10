// HACK: As vscode is not available if tests are not running on VSCode's extensionHostProcess,
//       return mock vscode module when `require`d

const mockVscode = {
    OverviewRulerLane: {Center: 2}
};

const moduleProto = Object.getPrototypeOf(module);

moduleProto.require = new Proxy(moduleProto.require, {
    apply: (require, that, args) =>
        args[0] === 'vscode' ? mockVscode : Reflect.apply(require, that, args)
});
