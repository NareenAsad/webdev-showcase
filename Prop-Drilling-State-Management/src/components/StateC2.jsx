import React, { useState, useEffect } from 'react';

const StateC2 = () => {
    const [bgColor, setBgColor] = useState(() => {
        return localStorage.getItem('cardBgColor') || '';
    });

    useEffect(() => {
        localStorage.setItem('cardBgColor', bgColor);
    }, [bgColor]);


    const themeClass = bgColor === 'white' ? 'theme-light' : bgColor === 'black' ? 'theme-dark' : '';

    return (
        <div className={`card state-card ${themeClass}`}>
            <div className="card-header">
                <span className="card-title">Component 2</span>
                <div className="header-badges">
                    <span className="badge blue">Theme Switcher</span>
                </div>
            </div>

            <div className="card-body">
                <div className="state-control centered">
                    <label className="data-label">Card Background:</label>
                    <div className="control-row">
                        <button
                            onClick={() => setBgColor('white')}
                            className={`btn-theme white-btn ${bgColor === 'white' ? 'active' : ''}`}
                        >
                            Beige
                        </button>
                        <button
                            onClick={() => setBgColor('black')}
                            className={`btn-theme black-btn ${bgColor === 'black' ? 'active' : ''}`}
                        >
                            Black
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StateC2;

