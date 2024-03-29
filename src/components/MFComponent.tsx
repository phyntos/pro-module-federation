import React, { Suspense } from 'react';
import useComponent from '../hooks/useComponent';
import { useScript } from '../hooks/useScript';
import { useStyles } from '../hooks/useStyles';
import Center from './Center';
import { ErrorBoundary } from './ErrorBoundary';
import { ShareScopes } from '../functions/getModule';

export type MFComponentProps<T extends Record<string, unknown>> = {
    loadingMessage?: React.ReactNode;
    errorMessage?: React.ReactNode | ((url: string) => React.ReactNode);
    styles?: string[];
    scope: string;
    props?: T;
    module: string;
    rootClassName?: string;
    shareScopes?: ShareScopes;
    loadingStyle?: React.CSSProperties;
    errorStyle?: React.CSSProperties;
};

const MFComponent = <T extends Record<string, unknown>>({
    scope,
    props,
    styles,
    loadingMessage,
    errorMessage,
    module,
    rootClassName,
    shareScopes,
    errorStyle,
    loadingStyle,
}: MFComponentProps<T>): JSX.Element => {
    const { entry, url } = process.env.ProMFRemotes.find((remote) => remote.name === scope);
    const scriptStatus = useScript({ url: url + entry, scope });
    const stylesStatus = useStyles({ url, styles, scope });
    const [isFailed, Component] = useComponent({ scope, module: String(module), shareScopes });

    const errorNode = errorMessage ? (
        typeof errorMessage === 'function' ? (
            errorMessage(url)
        ) : (
            errorMessage
        )
    ) : (
        <span>Failed to load micro frontend: {url}</span>
    );

    const ready = scriptStatus === 'ready' && stylesStatus === 'ready';
    const failed = scriptStatus === 'failed' || stylesStatus === 'failed' || isFailed;

    if (failed) {
        return <Center style={errorStyle}>{errorNode}</Center>;
    }

    const loadingNode = loadingMessage || <span>Loading micro frontend: {url}</span>;

    if (!ready) {
        return <Center style={loadingStyle}>{loadingNode}</Center>;
    }

    return (
        <ErrorBoundary>
            <Suspense fallback={loadingNode}>
                <div className={rootClassName || 'Root_' + scope}>
                    <Component {...(props || {})} />
                </div>
            </Suspense>
        </ErrorBoundary>
    );
};

export default MFComponent;
