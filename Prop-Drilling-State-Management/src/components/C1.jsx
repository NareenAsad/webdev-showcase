import React from 'react';
import C2 from './C2';

const C1 = () => {
    const size = 10;
    const width = 20;
    const color = 'red';

    return (
        <>
            <div className="card">
                <div className="card-header">
                    <span className="card-title">Component C1</span>
                    <span className="badge purple">Parent Source</span>
                </div>
                <div className="card-body">
                    <div className="data-section">
                        <span className="data-label">Variables defined:</span>
                        <span className="badge blue">size = {size}</span>
                        <span className="badge orange">width = {width}</span>
                        <span className="badge green">color = '{color}'</span>
                    </div>
                    <div className="highlight-box">
                        <strong>C1</strong> defines these local variables and drills them all down to <strong>C2</strong> as props.
                    </div>
                </div>
            </div>
            <div className="arrow-divider">↓</div>
            <C2 size={size} width={width} color={color} />
        </>
    );
};

export default C1;