type RemoteType<RemoteName extends string, RemoteEnvs extends Record<string, string>> = {
    name: RemoteName;
    urls: RemoteEnvs;
    entry: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export declare type UnionWithString<Union extends string> = (string & {}) | Union;

export type ProMFOptions<
    RemoteEnvs extends Record<string, string>,
    RemoteName extends string,
    Dependencies extends Record<string, string>,
> = {
    name: string;
    filename: string;
    remotes: RemoteType<RemoteName, RemoteEnvs>[];
    remoteConfigs: Record<RemoteName, Extract<keyof RemoteEnvs, string>>;
    dependencies?: Dependencies;
    shared?: UnionWithString<Extract<keyof Dependencies, string>>[];
    exposes?: Record<string, string>;
};

export type Remote<RemoteKey extends string, ModuleKey extends string = string> = Record<
    RemoteKey,
    { modules: ModuleKey[]; entry: string; url: string }
>;

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface ProcessEnv {
            /* @ts-ignore */
            ProMFRemotes: {
                entry: string;
                name: string;
                url: string;
            }[];
        }
    }
}

const MFConfig = <
    RemoteEnvs extends Record<string, string>,
    RemoteName extends string,
    Dependencies extends Record<string, string>,
>(
    options: ProMFOptions<RemoteEnvs, RemoteName, Dependencies>,
) => {
    return {
        ProMFOptions: {
            shared: options.shared?.reduce(
                (shared, key) => ({
                    ...shared,
                    [key]: { singleton: true, requiredVersion: options.dependencies[key] },
                }),
                {},
            ),
            name: options.name,
            filename: options.filename,
            remotes: options.remotes.reduce((remotes, remote) => {
                return {
                    ...remotes,
                    [remote.name]: remote.name + '@' + remote.urls[options.remoteConfigs[remote.name]] + remote.entry,
                };
            }, {}),
            exposes: options.exposes,
        },
        ProMFEnvironment: {
            ProMFRemotes: options.remotes.map((remote) => ({
                entry: remote.entry,
                name: remote.name,
                url: remote.urls[options.remoteConfigs[remote.name]],
            })),
        },
    };
};

export default MFConfig;
