Windows PowerShell
Copyright (C) Microsoft Corporation. All rights reserved.

Try the new cross-platform PowerShell https://aka.ms/pscore6

PS C:\Users\user\OneDrive\Desktop\NeuroEdge-main\NeuroEdge-main\orchestrator> npm install

added 144 packages, and audited 145 packages in 51s

23 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
PS C:\Users\user\OneDrive\Desktop\NeuroEdge-main\NeuroEdge-main\orchestrator> npm run dev

> neuroedge-orchestrator@1.0.0 dev
> nodemon

[nodemon] 3.1.11
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src\**\*
[nodemon] watching extensions: ts,json
[nodemon] starting `node -r ts-node/register/transpile-only -r tsconfig-paths/register src/index.ts`
TypeError: Invalid module "@server" is not a valid package name imported from C:\Users\user\OneDrive\Desktop\NeuroEdge-main\NeuroEdge-main\orchestrator\src\index.ts
    at parsePackageName (node:internal/modules/package_json_reader:272:11)
    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:283:53)
    at packageResolve (node:internal/modules/esm/resolve:768:81)
    at moduleResolve (node:internal/modules/esm/resolve:858:18)
    at defaultResolve (node:internal/modules/esm/resolve:990:11)
    at ModuleLoader.#cachedDefaultResolve (node:internal/modules/esm/loader:718:20)
    at ModuleLoader.#resolveAndMaybeBlockOnLoaderThread (node:internal/modules/esm/loader:735:38)
    at ModuleLoader.resolveSync (node:internal/modules/esm/loader:764:52)
    at ModuleLoader.#resolve (node:internal/modules/esm/loader:700:17)
    at ModuleLoader.getOrCreateModuleJob (node:internal/modules/esm/loader:620:35) {
  code: 'ERR_INVALID_MODULE_SPECIFIER'
}
[nodemon] app crashed - waiting for file changes before starting...
