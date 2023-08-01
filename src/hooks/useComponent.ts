import React, { lazy, useCallback, useMemo, useState } from 'react';

export type LoadComponentFC = (opt: {
    scope: string;
    module: string;
    onFail?: (() => void) | undefined;
}) => () => Promise<any>;

type Factory = () => any;

interface Container {
    init(shareScope: any): Promise<void>;
    get(module: string): Promise<Factory>;
}

declare const __webpack_init_sharing__: (shareScope: string) => Promise<void>;
declare const __webpack_share_scopes__: { default: any };

const useComponent = ({
    scope,
    module,
    lazyLoad,
    loadComponent,
}: {
    scope: string;
    module: string;
    loadComponent?: LoadComponentFC;
    lazyLoad?: typeof React.lazy;
}) => {
    const [failed, setFailed] = useState(false);

    const loadComponentCallback = useCallback(() => {
        if (loadComponent) {
            return loadComponent({ module, scope, onFail: () => setFailed(false) });
        }

        return async () => {
            try {
                // Initializes the share scope. This fills it with known provided modules from this build and all remotes
                await __webpack_init_sharing__('default');

                const container: Container = window[scope as keyof Window]; // or get the container somewhere else

                // Initialize the container, it may provide shared modules
                const defaultScope = __webpack_share_scopes__.default;

                await container.init(defaultScope);

                const factory = await container.get(module);

                const Module = factory();
                return Module;
            } catch (error) {
                setFailed(true);
                console.error(error);
                return null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scope, module]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const Component = useMemo(() => {
        if (lazyLoad) return lazyLoad(loadComponentCallback());

        return lazy(loadComponentCallback());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadComponentCallback]);

    return [failed, Component] as const;
};

export default useComponent;
