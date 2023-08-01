import createScript, { checkScript } from './createScript';
import getModule, { ShareScopes } from './getModule';

const getMF = async ({ module, scope, shareScopes }: { scope: string; module: string; shareScopes?: ShareScopes }) => {
    const { entry, url } = process.env.ProMFRemotes.find((remote) => remote.name === scope);

    const scriptId = checkScript({ scope, url });

    if (scriptId) {
        await createScript({ scriptId, scriptUrl: url + entry });
    }

    const loadedModule = await getModule({ module, scope, shareScopes });

    if (loadedModule) return loadedModule.default;

    return null;
};

export default getMF;
