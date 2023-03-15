import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProMF } from '../pro-module-federation';

export type DevAppTypes = 'LK' | 'CRM' | 'LOCAL';

export type DevAppProps = {
    type: DevAppTypes;
};

export const DevApp: React.FC = () => {
    return (
        <Routes>
            <Route path='/test/*' element={<ProMF.Component scope='TestApp' module='./TestApp' />} />
            <Route path='*' element={<Navigate to='/test/*' />} />
        </Routes>
    );
};
