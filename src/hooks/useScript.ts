import { useModuleFederation } from '../components/MFProvider';
import { useEffect } from 'react';

export const useScript = ({ scope, url }: { url?: string; scope: string }) => {
    const [status, setStatus] = useModuleFederation(scope);

    useEffect(() => {
        if (!url) {
            return;
        }
        const scriptId = 'Script_' + scope;
        const oldScript = document.getElementById(scriptId) as HTMLScriptElement;
        if (oldScript !== null) {
            return;
        }

        if (status && status !== 'init') return;
        setStatus('loading');

        const script = document.createElement('script');

        script.src = url;
        script.type = 'text/javascript';
        script.id = scriptId;
        script.async = true;

        script.onload = (): void => {
            console.log(`Dynamic Script Loaded: ${url}`);
            setStatus('ready');
        };

        script.onerror = (): void => {
            console.error(`Dynamic Script Error: ${url}`);
            setStatus('failed');
        };

        document.head.appendChild(script);
    }, [url, status, scope, setStatus]);

    return status || 'ready';
};
