import packageJson from './package.json';
import { ProMFConfig } from './src/pro-module-federation';
const { devDependencies } = packageJson;

export const { ProMFEnvironment, ProMFOptions } = ProMFConfig({
    filename: 'devTest.js',
    name: 'DevTest',
    dependencies: devDependencies,
    shared: ['react', 'react-dom', 'react-router-dom'],
    remotes: [
        {
            name: 'KTZEApp',
            urls: {
                LOCAL: 'http://localhost:3222/',
            },
            entry: 'entry.js',
        },
    ],
    remoteConfigs: {
        KTZEApp: 'LOCAL',
    },
});
