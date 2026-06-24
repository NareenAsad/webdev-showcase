import React from 'react';

const C4 = ({ color }) => {
    return (
        <div className="card">
            <div className="card-header">
                <span className="card-title">Component C4</span>
                <span className="badge green">Receives 1 Prop</span>
            </div>
            <div className="card-body">
                <div className="data-section">
                    <span className="data-label">Printed Prop:</span>
                    <span className="badge green">color = '{color}'</span>
                </div>
                <div className="highlight-box">
                    <strong>C4</strong> is the leaf component! It receives and prints the final drilled prop: <code>color</code>.
                </div>
            </div>
        </div>
    );
};

export default C4;
