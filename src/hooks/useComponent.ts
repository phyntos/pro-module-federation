import { lazy, useCallback, useMemo, useState } from 'react';
import getModule, { ShareScopes } from '../functions/getModule';

const useComponent = ({ scope, module, shareScopes }: { scope: string; module: string; shareScopes?: ShareScopes }) => {
    const [failed, setFailed] = useState(false);

    const loadComponentCallback = useCallback(() => {
        return async () => {
            const loadedModule = await getModule({ module, scope, shareScopes });

            if (!loadedModule) {
                setFailed(true);
            }
            return loadedModule;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scope, module]);

    const Component = useMemo(() => lazy(loadComponentCallback()), [loadComponentCallback]);

    return [failed, Component] as const;
};

export default useComponent;
