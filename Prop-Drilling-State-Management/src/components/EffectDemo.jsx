import React, { useState, useEffect } from 'react';

const EffectDemo = () => {
    // Demo 1: Window Width (Mount/Unmount example with cleanup)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        
        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // Empty array: runs only on mount & cleans up on unmount

    // Demo 2: Timer/Stopwatch (Interval cleanup example)
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setSeconds(prev => prev + 1);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [isRunning]); // Re-runs/re-sets interval when isRunning changes

    // Demo 3: Data Fetching Simulation (Dependency-based effect)
    const [tipId, setTipId] = useState(1);
    const [tip, setTip] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const tips = {
        1: "🔑 Always return a cleanup function to clean up subscriptions, intervals, and event listeners.",
        2: "🚀 An empty dependency array [] runs the effect exactly once when the component mounts.",
        3: "💡 Don't forget dependencies: React will stale-close variables if you omit them from the dependency array.",
        4: "⚙️ State setters are stable, so you don't strictly need to include them in the dependency array (but it's safe to do so).",
        5: "🧹 Cleanup functions run not only on unmount, but also right before the effect runs again with new dependencies."
    };

    useEffect(() => {
        setIsLoading(true);
        // Simulate API fetch delay
        const timer = setTimeout(() => {
            setTip(tips[tipId] || "Unknown tip");
            setIsLoading(false);
        }, 600);

        return () => clearTimeout(timer);
    }, [tipId]); // Runs on mount and whenever tipId changes

    return (
        <div className="state-components-container">
            <div className="card">
                <div className="card-header">
                    <span className="card-title">What is useEffect?</span>
                    <span className="badge purple">React Hook</span>
                </div>
                <div className="card-body">
                    <p className="subtitle">
                        <code>useEffect</code> lets you synchronize a component with an external system (performing side effects like fetching data, setting up subscriptions, or manipulating the DOM).
                    </p>
                    <div className="highlight-box">
                        <strong>Syntax:</strong> <code>useEffect(() =&gt; &#123; /* effect */ return () =&gt; &#123; /* cleanup */ &#125;; &#125;, [dependencies])</code>
                    </div>
                </div>
            </div>

            {/* Example 1: Empty Dependency Array */}
            <div className="card state-card">
                <div className="card-header">
                    <span className="card-title">1. Empty Dependency Array ([ ])</span>
                    <div className="header-badges">
                        <span className="badge blue">Window Resize Listener</span>
                    </div>
                </div>
                <div className="card-body">
                    <div className="state-control centered">
                        <label className="data-label">Current Window Width:</label>
                        <div className="control-row">
                            <span className="control-value" style={{ fontSize: '1.5rem', color: 'var(--accent)' }}>{windowWidth}px</span>
                        </div>
                    </div>
                    <div className="highlight-box">
                        This listener is registered <strong>only once</strong> when the component mounts. When the component is destroyed (or tab switched), the cleanup function runs to remove the listener.
                    </div>
                </div>
            </div>

            {/* Example 2: Cleanup and Re-running */}
            <div className="card state-card">
                <div className="card-header">
                    <span className="card-title">2. Interval Cleanup</span>
                    <div className="header-badges">
                        <span className="badge orange">Stopwatch / Timer</span>
                    </div>
                </div>
                <div className="card-body">
                    <div className="state-control centered">
                        <label className="data-label">Elapsed Time:</label>
                        <div className="control-row">
                            <span className="control-value" style={{ fontSize: '1.5rem', color: 'var(--accent)' }}>{seconds}s</span>
                            <button 
                                onClick={() => setIsRunning(!isRunning)} 
                                className="btn-theme"
                                style={{
                                    backgroundColor: isRunning ? '#ef4444' : '#22c55e',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.4rem 1rem',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                {isRunning ? 'Pause' : 'Resume'}
                            </button>
                            <button 
                                onClick={() => setSeconds(0)} 
                                className="btn-theme white-btn"
                                style={{
                                    padding: '0.4rem 1rem',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                    <div className="highlight-box">
                        Every time <code>isRunning</code> toggles, the interval is cleared and a new one is set up if active. Swapping tabs triggers cleanup to stop the interval.
                    </div>
                </div>
            </div>

            {/* Example 3: Dependency Array */}
            <div className="card state-card">
                <div className="card-header">
                    <span className="card-title">3. With Dependencies ([dep])</span>
                    <div className="header-badges">
                        <span className="badge green">API Data Fetcher (Simulated)</span>
                    </div>
                </div>
                <div className="card-body">
                    <div className="state-control">
                        <label className="data-label">Select Tip ID:</label>
                        <div className="control-row" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {[1, 2, 3, 4, 5].map(id => (
                                <button
                                    key={id}
                                    onClick={() => setTipId(id)}
                                    className={`btn-theme white-btn ${tipId === id ? 'active' : ''}`}
                                    style={{ padding: '0.4rem 0.8rem', minWidth: '35px' }}
                                >
                                    Tip #{id}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div 
                        className="state-control" 
                        style={{ 
                            minHeight: '80px', 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            transition: 'all 0.3s'
                        }}
                    >
                        {isLoading ? (
                            <span className="badge blue" style={{ animation: 'bounce 1s infinite' }}>Loading tip...</span>
                        ) : (
                            <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-h)' }}>{tip}</p>
                        )}
                    </div>
                    <div className="highlight-box">
                        The effect runs when <code>tipId</code> changes. It simulates an API request by delaying state updates.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EffectDemo;
