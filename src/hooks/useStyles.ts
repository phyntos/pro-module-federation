import { useModuleFederation } from '../components/MFProvider';
import { useEffect } from 'react';

const getPromise = (link: HTMLLinkElement, loadedLinkIds: string[]) =>
    new Promise<boolean>((resolve) => {
        if (loadedLinkIds.includes(link.id)) {
            resolve(false);
        }
        link.onload = (): void => {
            console.log(`Dynamic Style Loaded: ${link.href}`);
            link.setAttribute('data-error', 'false');
            resolve(false);
        };
        link.onerror = (): void => {
            console.error(`Dynamic Style Error: ${link.href}`);
            link.setAttribute('data-error', 'true');
            resolve(true);
        };
    });

export const useStyles = ({ scope, styles, url }: { url?: string; styles?: string[]; scope: string }) => {
    const [status, setStatus] = useModuleFederation(scope + 'Styles');

    useEffect(() => {
        if (!url) {
            return;
        }
        if (!styles || !styles.length) {
            setStatus('ready');
            return;
        }
        if (status && status !== 'init') return;
        setStatus('loading');
        const loadedLinkIds: string[] = [];

        const links = styles.map((style) => {
            const styleId = 'Style_' + scope + '_' + style;
            const oldLink = document.getElementById(styleId) as HTMLLinkElement;
            if (oldLink !== null) {
                if (oldLink.getAttribute('data-error') === 'true') {
                    document.head.removeChild(oldLink);
                } else {
                    loadedLinkIds.push(styleId);
                    return oldLink;
                }
            }
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.id = styleId;
            link.type = 'text/css';
            link.href = url + 'styles/' + style;
            link.media = 'all';
            document.head.appendChild(link);
            return link;
        });
        Promise.all(links.map((link) => getPromise(link, loadedLinkIds))).then((faileds) => {
            if (faileds.some((err) => err)) {
                setStatus('failed');
            } else {
                setStatus('ready');
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);

    return status;
};
