import { LazyStatus } from '../components/MFProvider';

export const checkScript = ({ scope, url }: { scope: string; url: string }): null | string => {
    if (!url) {
        return null;
    }
    const scriptId = 'Script_' + scope;
    const oldScript = document.getElementById(scriptId) as HTMLScriptElement;
    if (oldScript !== null) {
        return null;
    }

    return scriptId;
};

const createScript = ({ scriptId, scriptUrl }: { scriptId: string; scriptUrl: string }): Promise<LazyStatus> => {
    return new Promise((res, rej) => {
        const script = document.createElement('script');

        script.src = scriptUrl;
        script.type = 'text/javascript';
        script.id = scriptId;
        script.async = true;

        script.onload = (): void => {
            console.log(`Dynamic Script Loaded: ${scriptUrl}`);
            res('ready');
        };

        script.onerror = (): void => {
            console.error(`Dynamic Script Error: ${scriptUrl}`);
            rej('failed');
        };

        document.head.appendChild(script);
    });
};

export default createScript;
