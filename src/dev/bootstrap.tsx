import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ProMFProvider } from '../pro-module-federation';
import { DevApp } from './DevApp';

const element = document.getElementById('root');

ReactDOM.render(
    <ProMFProvider>
        <BrowserRouter>
            <DevApp />
        </BrowserRouter>
    </ProMFProvider>,
    element,
);
