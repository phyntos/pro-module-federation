import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ProMF } from '../pro-module-federation';
import { DevApp } from './DevApp';

const element = document.getElementById('root');

ReactDOM.render(
    <ProMF.Provider>
        <BrowserRouter>
            <DevApp />
        </BrowserRouter>
    </ProMF.Provider>,
    element,
);
