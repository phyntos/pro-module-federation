# pro-module-federation

## Install

```
npm install pro-module-federation
```

## Usage

### webpack.module.ts

```js
import packageJson from './package.json';
import { ProMFConfig } from 'pro-module-federation/dist/plugin';

const { dependencies } = packageJson;

export const { ProMFEnvironment, ProMFOptions } = ProMFConfig({
    name: 'MY_APP',
    filename: 'myApp.js',
    dependencies,
    shared: ['react', 'react-dom', 'react-router-dom'],
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
});
```

### webpack.config.ts

```js
...
import { container, EnvironmentPlugin } from 'webpack';
import { ProMFEnvironment, ProMFOptions } from './webpack.module';
const { ModuleFederationPlugin } = container;

...
    plugins: [
        ...
        new ModuleFederationPlugin(ProMFOptions),
        new EnvironmentPlugin(ProMFEnvironment),
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

### MFComponent.tsx
```js
import { ProMFComponent } from 'pro-module-federation';
import { MFComponentProps } from 'pro-module-federation/dist/components/MFComponent';
import React from 'react';
import { ShareScopes } from 'pro-module-federation/dist/hooks/useComponent';

declare const __webpack_init_sharing__: (shareScope: string) => Promise<void>;
declare const __webpack_share_scopes__: { default: any };

const shareScopes: ShareScopes = async () => {
    await __webpack_init_sharing__('default');
    return __webpack_share_scopes__.default;
};

const MFComponent = <Props extends Record<string, unknown> = Record<string, unknown>>({
    module,
    props,
    scope,
    styles,
}: Pick<MFComponentProps<Props>, 'module' | 'scope' | 'styles' | 'props'>) => {
    return (
        <ProMFComponent<Props>
            module={module}
            scope={scope}
            props={props}
            styles={styles}
            shareScopes={shareScopes}
        />
    );
};

export default MFComponent;
```

### TestApp.tsx
```js
import React from 'react';
import MFComponent from './MFComponent';

const TestApp = <Props extends Record<string, unknown> = Record<string, unknown>>({
    module,
    props,
}: {
    module: string;
    props?: Props;
}) => {
    return <MFComponent<Props> module={module} scope="TestApp" props={props} />;
};

export default TestApp;

```