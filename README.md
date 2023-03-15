# pro-module-federation

## Install

```
npm install pro-module-federation
```

## Usage

### webpack.config.ts
```js
...
import { container, EnvironmentPlugin } from 'webpack';
import packageJson from './package.json';
import { ProMFPlugin } from 'pro-module-federation';
const { devDependencies } = packageJson;
...
    plugins: [
        ...
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
            },
            plugins: {
                EnvironmentPlugin,
                ModuleFederationPlugin: container.ModuleFederationPlugin,
            },
        }),
    ],
...
```

### index.tsx
```js
import React from 'react';
import ReactDOM from 'react-dom';
import { ProMFProvider } from '../pro-module-federation';
import App from './App';

const element = document.getElementById('root');

ReactDOM.render(
    <ProMFProvider>
        <App />
    </ProMFProvider>,
    element,
);

```

### SomeComponent.tsx
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
