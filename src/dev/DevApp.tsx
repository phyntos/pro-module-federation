import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProMFComponent } from '../pro-module-federation';

export type DevAppTypes = 'LK' | 'CRM' | 'LOCAL';

export type DevAppProps = {
    type: DevAppTypes;
};

export const DevApp: React.FC = () => {
    return (
        <Routes>
            <Route path='/test/*' element={<ProMFComponent scope='KTZEApp' module='./Register' />} />
            <Route path='*' element={<Navigate to='/test/*' />} />
        </Routes>
    );
};
