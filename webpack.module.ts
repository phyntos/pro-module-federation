import packageJson from './package.json';
const { devDependencies } = packageJson;
import { ProMFConfig } from './src/plugin';

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
