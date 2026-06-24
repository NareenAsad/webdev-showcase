import React, { useState } from 'react';

const StateC1 = () => {
    const [count, setCount] = useState(0);

    return (
        <div className="card state-card">
            <div className="card-header">
                <span className="card-title">Component 1</span>
                <div className="header-badges">
                    <span className="badge purple">State Creator</span>
                </div>
            </div>

            <div className="card-body">
                <div className="state-control centered">
                    <label className="data-label">Local Counter:</label>
                    <div className="control-row">
                        <button onClick={() => setCount(prev => prev - 1)} className="btn-counter">-</button>
                        <span className="control-value">{count}</span>
                        <button onClick={() => setCount(prev => prev + 1)} className="btn-counter">+</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StateC1;



