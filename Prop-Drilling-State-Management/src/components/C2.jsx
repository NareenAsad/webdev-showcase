import React from 'react';
import C3 from './C3';

const C2 = ({ size, width, color }) => {
    return (
        <>
            <div className="card">
                <div className="card-header">
                    <span className="card-title">Component C2</span>
                    <span className="badge blue">Receives 3 Props</span>
                </div>
                <div className="card-body">
                    <div className="data-section">
                        <span className="data-label">Printed Prop:</span>
                        <span className="badge blue">size = {size}</span>
                    </div>
                    <div className="data-section">
                        <span className="data-label">Forwarded Props:</span>
                        <span className="badge orange">width = {width}</span>
                        <span className="badge green">color = '{color}'</span>
                    </div>
                    <div className="highlight-box">
                        <strong>C2</strong> prints the <code>size</code> prop and passes <code>width</code> and <code>color</code> to <strong>C3</strong>.
                    </div>
                </div>
            </div>
            <div className="arrow-divider">↓</div>
            <C3 width={width} color={color} />
        </>
    );
};

export default C2;
