import { lazy, useCallback, useMemo, useState } from 'react';

type Factory = () => any;

interface Container {
    init(shareScope: any): Promise<void>;
    get(module: string): Promise<Factory>;
}

declare const __webpack_init_sharing__: (shareScope: string) => Promise<void>;
declare const __webpack_share_scopes__: { default: any };

const useComponent = ({ scope, module }: { scope: string; module: string }) => {
    const [failed, setFailed] = useState(false);

    const loadComponent = useCallback(() => {
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
    }, [scope, module]);

    const Component = useMemo(() => lazy(loadComponent()), [loadComponent]);

    return [failed, Component] as const;
};

export default useComponent;
