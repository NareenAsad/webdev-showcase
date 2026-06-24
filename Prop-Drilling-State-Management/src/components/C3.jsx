import React from 'react';
import C4 from './C4';

const C3 = ({ width, color }) => {
    return (
        <>
            <div className="card">
                <div className="card-header">
                    <span className="card-title">Component C3</span>
                    <span className="badge orange">Receives 2 Props</span>
                </div>
                <div className="card-body">
                    <div className="data-section">
                        <span className="data-label">Printed Prop:</span>
                        <span className="badge orange">width = {width}</span>
                    </div>
                    <div className="data-section">
                        <span className="data-label">Forwarded Prop:</span>
                        <span className="badge green">color = '{color}'</span>
                    </div>
                    <div className="highlight-box">
                        <strong>C3</strong> prints the <code>width</code> prop and forwards <code>color</code> to <strong>C4</strong>.
                    </div>
                </div>
            </div>
            <div className="arrow-divider">↓</div>
            <C4 color={color} />
        </>
    );
};

export default C3;
