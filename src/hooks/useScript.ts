import { useModuleFederation } from '../components/MFProvider';
import { useEffect } from 'react';
import createScript, { checkScript } from '../functions/createScript';

export const useScript = ({ scope, url }: { url?: string; scope: string }) => {
    const [status, setStatus] = useModuleFederation(scope);

    useEffect(() => {
        const scriptId = checkScript({ scope, url });
        if (!scriptId) return;

        if (status && status !== 'init') return;
        setStatus('loading');

        createScript({ scriptId, scriptUrl: url }).then(setStatus).catch(setStatus);
    }, [url, status, scope, setStatus]);

    return status || 'ready';
};
