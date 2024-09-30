import React, { useState, useEffect, useRef } from 'react';

const MyComponent = () => {
    const [isErasing, setIsErasing] = useState(false);
    const [brushSize, setBrushSize] = useState(5);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const latexExpression = ["\\frac{a}{b}", "\\sqrt{c}"]; // Example latex expressions
    const renderLatexToCanvas = () => {
        // Your function logic to render latex on canvas
        console.log('Rendering LaTeX to canvas');
    };

    useEffect(() => {
        renderLatexToCanvas();
    }, [renderLatexToCanvas]); // Added 'renderLatexToCanvas' as dependency

    const runRoute = () => {
        // Logic for Calculate button
        console.log('Calculating...');
    };

    return (
        <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <button
                    onClick={() => setIsErasing(false)}
                    style={{
                        backgroundColor: '#ff4d4d',
                        color: 'white',
                        borderRadius: '10px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        border: 'none',
                        cursor: 'pointer',
                        width: 'auto',
                        transition: 'background-color 0.3s ease'
                    }}
                >
                    Reset
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    {/* Assuming SWATCHES is an array of colors */}
                    {["#ff0000", "#00ff00", "#0000ff"].map((swatch) => (
                        <div
                            key={swatch}
                            style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                backgroundColor: swatch,
                                cursor: 'pointer'
                            }}
                            onClick={() => setBrushSize(5)} // Update brush size logic if necessary
                        />
                    ))}
                </div>

                <button
                    onClick={runRoute}
                    style={{
                        backgroundColor: '#006400',
                        color: 'white',
                        borderRadius: '10px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        border: 'none',
                        cursor: 'pointer',
                        width: 'auto',
                        transition: 'background-color 0.3s ease'
                    }}
                >
                    Calculate
                </button>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button
                        style={{
                            backgroundColor: '#4d4d4d',
                            color: 'white',
                            borderRadius: '10px',
                            padding: '8px 16px',
                            fontSize: '14px',
                            border: 'none',
                            cursor: 'pointer',
                            width: 'auto',
                            transition: 'background-color 0.3s ease'
                        }}
                        onClick={() => setIsErasing(!isErasing)}
                    >
                        {isErasing ? "Pencil" : "Eraser"}
                    </button>

                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        style={{ marginLeft: '20px' }}
                    />
                </div>
            </div>

            <canvas
                ref={canvasRef}
                id="canvas"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: -1
                }}
                // Implement draw logic for canvas here if necessary
            />

            {latexExpression && latexExpression.map((latex, index) => (
                <div
                    key={index}
                    style={{
                        position: 'absolute',
                        padding: '10px',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                        borderRadius: '5px',
                        zIndex: 1
                    }}
                >
                    <div>{latex}</div> {/* Render LaTeX content here */}
                </div>
            ))}
        </>
    );
};

export default MyComponent;
