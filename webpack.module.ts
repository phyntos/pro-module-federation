import packageJson from './package.json';
import { getMFData } from './src/plugin';
const { devDependencies } = packageJson;

export const { ProMFEnvironment, ProMFOptions } = getMFData({
    filename: 'devTest.js',
    name: 'DevTest',
    dependencies: devDependencies,
    shared: ['react', 'react-dom'],
    remotes: [
        {
            name: 'TestApp',
            urls: {
                LOCAL: 'http://localhost:3000/',
            },
            entry: 'testApp.js',
        },
    ],
    remoteConfigs: {
        TestApp: 'LOCAL',
    },
});
