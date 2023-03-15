import React, { useContext, useState } from 'react';

export type LazyStatus = 'init' | 'loading' | 'failed' | 'ready';

const ModuleFederationContext = React.createContext<{
    status: Record<string, LazyStatus>;
    setStatus: React.Dispatch<React.SetStateAction<Record<string, LazyStatus>>>;
}>({
    status: {},
    setStatus: () => {
        return;
    },
});

const MFProvider: React.FC = ({ children }) => {
    const [status, setStatus] = useState<Record<string, LazyStatus>>({});

    return (
        <ModuleFederationContext.Provider
            value={{
                status,
                setStatus: (newStatus) => setStatus((old) => ({ ...old, ...newStatus })),
            }}
        >
            {children}
        </ModuleFederationContext.Provider>
    );
};

export const useModuleFederation = (id: string) => {
    const { status, setStatus } = useContext(ModuleFederationContext);

    return [status[id], (stat: LazyStatus) => setStatus({ [id]: stat })] as const;
};

export default MFProvider;
