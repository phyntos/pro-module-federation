import React from 'react';

const Center: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div
            style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {children}
        </div>
    );
};

export default Center;
