type RemoteType<
    RemoteModules extends Record<RemoteName, string>,
    RemoteName extends string,
    RemoteEnvs extends Record<string, string>,
> = {
    name: RemoteName;
    modules: RemoteModules[RemoteName][];
    urls: RemoteEnvs;
    entry: string;
};

type Options<
    RemoteModules extends Record<RemoteName, string>,
    RemoteEnvs extends Record<string, string>,
    RemoteName extends string,
    Dependencies extends Record<string, string>,
> = {
    name: string;
    filename: string;
    remotes: RemoteType<RemoteModules, RemoteName, RemoteEnvs>[];
    remoteConfigs: Record<RemoteName, Extract<keyof RemoteEnvs, string>>;
    dependencies: Dependencies;
    shared: (keyof Dependencies)[];
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
                modules: string[];
                name: string;
                url: string;
            }[];
        }
    }
}

const MFPlugin = <
    RemoteModules extends Record<RemoteName, string>,
    RemoteEnvs extends Record<string, string>,
    RemoteName extends string,
    Dependencies extends Record<string, string>,
>(
    options: Options<RemoteModules, RemoteEnvs, RemoteName, Dependencies> & {
        plugins: {
            ModuleFederationPlugin: new (options: Record<string, any>) => any;
            EnvironmentPlugin: new (definitions: Record<string, any>) => any;
        };
    },
) => {
    const mf = new options.plugins.ModuleFederationPlugin({
        shared: options.shared.reduce(
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
    });

    const provide = new options.plugins.EnvironmentPlugin({
        ProMFRemotes: options.remotes.map((remote) => ({
            entry: remote.entry,
            name: remote.name,
            url: remote.urls[options.remoteConfigs[remote.name]],
        })),
    });

    return <Compiler,>(compiler: Compiler) => {
        mf.apply(compiler);
        provide.apply(compiler);
    };
};

export default MFPlugin;
