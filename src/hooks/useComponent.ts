import { lazy, useCallback, useMemo, useState } from 'react';

export type LoadComponentType = {
    initialize?: () => Promise<any>;
    getContainer?: (scope: string) => Container;
    getDefaultScope?: () => any;
    initContainer?: (defaultScope: any) => Promise<any>;
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

const useComponent = ({
    scope,
    module,
    loadComponent,
}: {
    scope: string;
    module: string;
    loadComponent?: LoadComponentType;
}) => {
    const [failed, setFailed] = useState(false);

    const loadComponentCallback = useCallback(() => {
        return async () => {
            try {
                // Initializes the share scope. This fills it with known provided modules from this build and all remotes
                if (loadComponent.initialize) await loadComponent.initialize();
                else await __webpack_init_sharing__('default');

                const container: Container = loadComponent.getContainer
                    ? loadComponent.getContainer(scope)
                    : window[scope as keyof Window]; // or get the container somewhere else

                // Initialize the container, it may provide shared modules
                const defaultScope = loadComponent.getDefaultScope
                    ? loadComponent.getDefaultScope()
                    : __webpack_share_scopes__.default;

                if (loadComponent.initContainer) await loadComponent.initContainer(defaultScope);
                else await container.init(defaultScope);

                const factory = loadComponent.getFactory
                    ? await loadComponent.getFactory(container, module)
                    : await container.get(module);

                const Module = loadComponent.getModule ? loadComponent.getModule(factory) : factory();
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
