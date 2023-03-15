# pro-module-federation

## Install

```
npm install pro-module-federation
```

## Usage

# webpack.config.ts
```js
...
import packageJson from './package.json';
import { ProMFPlugin } from './src/pro-module-federation';
const { devDependencies } = packageJson;
...
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        ProMFPlugin({
            filename: 'devTest.js',
            name: 'DevTest',
            dependencies: devDependencies,
            shared: ['react', 'react-dom'],
            remotes: [
                {
                    name: 'TestApp',
                    modules: ['./TestApp'],
                    urls: {
                        LOCAL: 'http://localhost:3000/',
                    },
                    entry: 'testApp.js',
                },
            ],
            remoteConfigs: {
                TestApp: 'LOCAL',
                UEODeliveryOrderApp: 'LOCAL',
            },
            plugins: {
                EnvironmentPlugin,
                ModuleFederationPlugin: container.ModuleFederationPlugin,
            },
        }),
    ],
...
```

# SomeComponent.tsx
```js
...
import { ProMFComponent } from 'pro-module-federation';
...
    <ProMFComponent
        scope='TestApp'
        module='./TestApp'
    />
...
```
