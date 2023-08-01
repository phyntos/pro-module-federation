import { lazy, useCallback, useMemo, useState } from 'react';

export type LoadComponentType = {
    initialize?: () => Promise<any>;
    getContainer?: (scope: string) => Container;
    getDefaultScope?: () => any;
    initContainer?: (container: Container, defaultScope: any) => Promise<any>;
    getFactory?: (container: Container, module: string) => Promise<Factory>;
    getModule?: (factory: Factory) => any;
};

type Factory = () => any;

interface Container {
    init(shareScope: any): Promise<void>;
    get(module: string): Promise<Factory>;
}

declare const __webpack_init_sharing__: (shareScope: string) => Promise<void>;
declare const __webpack_share_scopes__: { default: any };

export type WebpackShareScopesType = { default: any };
export type ShareScopes = WebpackShareScopesType | (() => WebpackShareScopesType | Promise<WebpackShareScopesType>);

const useComponent = ({
    scope,
    module,
    shareScopes = async () => {
        await __webpack_init_sharing__('default');
        return __webpack_share_scopes__.default;
    },
}: {
    scope: string;
    module: string;
    shareScopes?: ShareScopes;
}) => {
    const [failed, setFailed] = useState(false);

    const loadComponentCallback = useCallback(() => {
        return async () => {
            try {
                // Initializes the share scope. This fills it with known provided modules from this build and all remotes
                const defaultScope = shareScopes
                    ? typeof shareScopes === 'function'
                        ? await shareScopes()
                        : shareScopes
                    : await __webpack_init_sharing__('default');

                const container: Container = window[scope as keyof Window]; // or get the container somewhere else

                // Initialize the container, it may provide shared modules
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

    const Component = useMemo(() => lazy(loadComponentCallback()), [loadComponentCallback]);

    return [failed, Component] as const;
};

export default useComponent;
