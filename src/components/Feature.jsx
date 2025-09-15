// src/components/Feature.jsx

import React from 'react';

const Feature = () => {
    return (
        <section className="feature">
            <div className="feature-content">
                <span>HIMALAYAN TREKS</span>
                <h2>Conquer the Frozen Trails</h2>
                <div className="feature-stats">
                    <div className="stat">
                        <h4>529+</h4>
                        <p>People Already Booked</p>
                    </div>
                    <div className="stat">
                        <h4>Temperature</h4>
                        <p>-20°C to 10°C</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Feature;