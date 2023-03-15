import React, { Suspense } from 'react';
import useComponent from '../hooks/useComponent';
import { useScript } from '../hooks/useScript';
import { useStyles } from '../hooks/useStyles';
import Center from './Center';
import { ErrorBoundary } from './ErrorBoundary';

const MFComponent = <T extends Record<string, unknown>>({
    scope,
    props,
    styles,
    loadingMessage,
    errorMessage,
    module,
}: {
    loadingMessage?: React.ReactNode;
    errorMessage?: React.ReactNode;
    styles?: string[];
    scope: string;
    props?: T;
    module: string;
}): JSX.Element => {
    const { entry, url } = process.env.ProMFRemotes.find((remote) => remote.name === scope);
    const scriptStatus = useScript({ url: url + entry, scope });
    const stylesStatus = useStyles({ url, styles, scope });
    const [isFailed, Component] = useComponent({ scope, module: String(module) });

    const errorNode = errorMessage || <span>Failed to load micro frontend: {url}</span>;

    const ready = scriptStatus === 'ready' && stylesStatus === 'ready';
    const failed = scriptStatus === 'failed' || stylesStatus === 'failed' || isFailed;

    if (failed) {
        return <Center>{errorNode}</Center>;
    }

    const loadingNode = loadingMessage || <span>Loading micro frontend: {url}</span>;

    if (!ready) {
        return <Center>{loadingNode}</Center>;
    }

    return (
        <ErrorBoundary>
            <Suspense fallback={loadingNode}>
                <div className={'Root_' + scope}>
                    <Component {...(props || {})} />
                </div>
            </Suspense>
        </ErrorBoundary>
    );
};

export default MFComponent;
