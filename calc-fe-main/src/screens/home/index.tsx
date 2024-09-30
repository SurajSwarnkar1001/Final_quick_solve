// import { ColorSwatch, Group } from '@mantine/core';
// import { Button } from '@/components/ui/button';
// import { useEffect, useRef, useState } from 'react';
// import axios from 'axios';
// import Draggable from 'react-draggable';
// import {SWATCHES} from '@/constants';
// // import {LazyBrush} from 'lazy-brush';

// interface GeneratedResult {
//     expression: string;
//     answer: string;
// }

// interface Response {
//     expr: string;
//     result: string;
//     assign: boolean;
// }

// export default function Home() {
//     const canvasRef = useRef<HTMLCanvasElement>(null);
//     const [isDrawing, setIsDrawing] = useState(false);
//     const [color, setColor] = useState('rgb(255, 255, 255)');
//     const [reset, setReset] = useState(false);
//     const [dictOfVars, setDictOfVars] = useState({});
//     const [result, setResult] = useState<GeneratedResult>();
//     const [latexPosition, setLatexPosition] = useState({ x: 10, y: 200 });
//     const [latexExpression, setLatexExpression] = useState<Array<string>>([]);

//     // const lazyBrush = new LazyBrush({
//     //     radius: 10,
//     //     enabled: true,
//     //     initialPoint: { x: 0, y: 0 },
//     // });




//     useEffect(() => {
//         if (latexExpression.length > 0 && window.MathJax) {
//             setTimeout(() => {
//                 window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
//             }, 0);
//         }
//     }, [latexExpression]);

//     useEffect(() => {
//         if (result) {
//             renderLatexToCanvas(result.expression, result.answer);
//         }
//     }, [result]);





//     useEffect(() => {
//         if (reset) {
//             resetCanvas();
//             setLatexExpression([]);
//             setResult(undefined);
//             setDictOfVars({});
//             setReset(false);
//         }
//     }, [reset]);

//     useEffect(() => {
//         const canvas = canvasRef.current;

//         if (canvas) {
//             const ctx = canvas.getContext('2d');
//             if (ctx) {
//                 canvas.width = window.innerWidth;
//                 canvas.height = window.innerHeight - canvas.offsetTop;
//                 ctx.lineCap = 'round';
//                 ctx.lineWidth = 3;
//             }

//         }
//         const script = document.createElement('script');
//         script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML';
//         script.async = true;
//         document.head.appendChild(script);

//         script.onload = () => {
//             window.MathJax.Hub.Config({
//                 tex2jax: {inlineMath: [['$', '$'], ['\\(', '\\)']]}
//             });
//         };

//         return () => {
//             document.head.removeChild(script);
//         };

//     }, []);




//     const renderLatexToCanvas = (expression: string, answer: string) => {
//         const latex = `\\(\\LARGE{${expression} = ${answer}}\\)`;
//         setLatexExpression([...latexExpression, latex]);

//         // Clear the main canvas
//         const canvas = canvasRef.current;
//         if (canvas) {
//             const ctx = canvas.getContext('2d');
//             if (ctx) {
//                 ctx.clearRect(0, 0, canvas.width, canvas.height);
//             }
//         }
//     };


//     const resetCanvas = () => {
//         const canvas = canvasRef.current;
//         if (canvas) {
//             const ctx = canvas.getContext('2d');
//             if (ctx) {
//                 ctx.clearRect(0, 0, canvas.width, canvas.height);
//             }
//         }
//     };

//     const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
//         const canvas = canvasRef.current;
//         if (canvas) {
//             canvas.style.background = 'black';
//             const ctx = canvas.getContext('2d');
//             if (ctx) {
//                 ctx.beginPath();
//                 ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//                 setIsDrawing(true);
//             }
//         }
//     };
//     const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
//         if (!isDrawing) {
//             return;
//         }
//         const canvas = canvasRef.current;
//         if (canvas) {
//             const ctx = canvas.getContext('2d');
//             if (ctx) {
//                 ctx.strokeStyle = color;
//                 ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//                 ctx.stroke();
//             }
//         }
//     };
//     const stopDrawing = () => {
//         setIsDrawing(false);
//     };  

//     const runRoute = async () => {
//         const canvas = canvasRef.current;

//         if (canvas) {

//             console.log('sending data....', `${import.meta.env.VITE_API_URL}/calculate`);


//             const response = await axios({
//                 method: 'post',
//                 url: `${import.meta.env.VITE_API_URL}/calculate`,
//                 data: {
//                     image: canvas.toDataURL('image/png'),
//                     dict_of_vars: dictOfVars
//                 }
//             });

//             const resp = await response.data;
//             console.log('Response', resp);
//             resp.data.forEach((data: Response) => {
//                 if (data.assign === true) {
//                     // dict_of_vars[resp.result] = resp.answer;
//                     setDictOfVars({
//                         ...dictOfVars,
//                         [data.expr]: data.result
//                     });
//                 }
//             });
//             const ctx = canvas.getContext('2d');
//             const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
//             let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

//             for (let y = 0; y < canvas.height; y++) {
//                 for (let x = 0; x < canvas.width; x++) {
//                     const i = (y * canvas.width + x) * 4;
//                     if (imageData.data[i + 3] > 0) {  // If pixel is not transparent
//                         minX = Math.min(minX, x);
//                         minY = Math.min(minY, y);
//                         maxX = Math.max(maxX, x);
//                         maxY = Math.max(maxY, y);
//                     }
//                 }
//             }

//             const centerX = (minX + maxX) / 2;
//             const centerY = (minY + maxY) / 2;

//             setLatexPosition({ x: centerX, y: centerY });
//             resp.data.forEach((data: Response) => {
//                 setTimeout(() => {
//                     setResult({
//                         expression: data.expr,
//                         answer: data.result
//                     });
//                 }, 1000);
//             });
//         }
//     };

//     return (
//         <>
//             <div className='grid grid-cols-3 gap-2'>
//                 <Button
//                     onClick={() => setReset(true)}
//                     className='z-20 bg-black text-white'
//                     variant='default' 
//                     color='black'
//                 >
//                     Reset
//                 </Button>
//                 <Group className='z-20'>
//                     {SWATCHES.map((swatch) => (
//                         <ColorSwatch key={swatch} color={swatch} onClick={() => setColor(swatch)} />
//                     ))}
//                 </Group>
//                 <Button
//                     onClick={runRoute}
//                     className='z-20 bg-black text-white'
//                     variant='default'
//                     color='white'
//                 >
//                     Calculate
//                 </Button>
//             </div>
//             <canvas
//                 ref={canvasRef}
//                 id='canvas'
//                 className='absolute top-0 left-0 w-full h-full'
//                 onMouseDown={startDrawing}
//                 onMouseMove={draw}
//                 onMouseUp={stopDrawing}
//                 onMouseOut={stopDrawing}
//             />

//             {latexExpression && latexExpression.map((latex, index) => (
//                 <Draggable
//                     key={index}
//                     defaultPosition={latexPosition}
//                     onStop={(e, data) => setLatexPosition({ x: data.x, y: data.y })}
//                 >
//                     <div className="absolute p-2 text-white rounded shadow-md">
//                         <div className="latex-content">{latex}</div>
//                     </div>
//                 </Draggable>
//             ))}
//         </>
//     );
// }






// new generated code with update some elemennt

import { ColorSwatch, Group } from '@mantine/core';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Draggable from 'react-draggable';
import { SWATCHES } from '@/constants';

interface GeneratedResult {
    expression: string;
    answer: string;
}

interface Response {
    expr: string;
    result: string;
    assign: boolean;
}

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('rgb(255, 255, 255)');
    const [reset, setReset] = useState(false);
    const [dictOfVars, setDictOfVars] = useState({});
    const [result, setResult] = useState<GeneratedResult>();
    const [latexPosition, setLatexPosition] = useState({ x: 2, y: 10 });
    const [latexExpression, setLatexExpression] = useState<Array<string>>([]);
    const [brushSize, setBrushSize] = useState(3); // New state for brush size
    const [isErasing, setIsErasing] = useState(false); // New state for eraser

    useEffect(() => {
        if (latexExpression.length > 0 && window.MathJax) {
            setTimeout(() => {
                window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
            }, 0);
        }
    }, [latexExpression]);

    useEffect(() => {
        if (result) {
            renderLatexToCanvas(result.expression, result.answer);
        }
    }, [result]);

    useEffect(() => {
        if (reset) {
            resetCanvas();
            setLatexExpression([]);
            setResult(undefined);
            setDictOfVars({});
            setReset(false);
        }
    }, [reset]);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight - canvas.offsetTop;
                ctx.lineCap = 'round';
                ctx.lineWidth = brushSize; // Set initial brush size
            }
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML';
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.MathJax.Hub.Config({
                tex2jax: { inlineMath: [['$', '$'], ['\\(', '\\)']] }
            });
        };

        return () => {
            document.head.removeChild(script);
        };
    }, [brushSize]);

    const renderLatexToCanvas = (expression: string, answer: string) => {
        const latex = `\\(\\LARGE{${expression} = ${answer}}\\)`;
        setLatexExpression([...latexExpression, latex]);

        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    };

    const resetCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.style.background = 'black';
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.lineWidth = brushSize; // Update brush size on start
                ctx.strokeStyle = isErasing ? 'black' : color; // If erasing, set strokeStyle to canvas background color
                ctx.beginPath();
                ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                setIsDrawing(true);
            }
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                ctx.stroke();
            }
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const runRoute = async () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const response = await axios({
                method: 'post',
                url: `${import.meta.env.VITE_API_URL}/calculate`,
                data: {
                    image: canvas.toDataURL('image/png'),
                    dict_of_vars: dictOfVars
                }
            });

// response int the format in terminal at the time of inspect
            const resp = await response.data;
            console.log("the fatching of data", resp);
            resp.data.forEach((data: Response) => {
                if (data.assign === true) {
                    setDictOfVars({
                        ...dictOfVars,
                        [data.expr]: data.result
                    });
                }
            });

            const ctx = canvas.getContext('2d');
            const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
            let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const i = (y * canvas.width + x) * 4;
                    if (imageData.data[i + 3] > 0) {
                        minX = Math.min(minX, x);
                        minY = Math.min(minY, y);
                        maxX = Math.max(maxX, x);
                        maxY = Math.max(maxY, y);
                    }
                }
            }

            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;

            setLatexPosition({ x: centerX, y: centerY });
            resp.data.forEach((data: Response) => {
                setTimeout(() => {
                    setResult({
                        expression: data.expr,
                        answer: data.result
                    });
                }, 1000);
            });
        }
    };

    return (
        <>
        <div className='grid grid-cols-2 gap-2'>
            <Button
                onClick={() => setReset(true)}
                className='z-20 bg-red-500 text-white rounded-lg' 
                variant='default'
                color='white'
            >
                Reset
            </Button>
    
            <Group className='z-20'>
                {SWATCHES.map((swatch) => (
                    <ColorSwatch key={swatch} color={swatch} onClick={() => setColor(swatch)} />
                ))}
            </Group>
    
            <Button
                onClick={runRoute}
                className='z-20 bg-green-600 text-white rounded-lg custom-small-button' 
                variant='default'
                color='white'
            >
                Calculate
            </Button>
    
            <div className="z-20 flex items-center space-x-4">
                <Button
                    className='eraser-button bg-gray-600 text-white rounded-lg padding:12px' 
                    onClick={() => setIsErasing(!isErasing)}
                >
                    {isErasing ? "Pencil" : "Eraser"}
                </Button>
    
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="brush-slider"
                />
            </div>
        </div>
    
        <canvas
            ref={canvasRef}
            id='canvas'
            className='absolute top-0 left-0 w-full h-full'
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
        />
    
        {latexExpression && latexExpression.map((latex, index) => (
            <Draggable
                key={index}
                defaultPosition={latexPosition}
                onStop={(e, data) => setLatexPosition({ x: data.x, y: data.y })}
            >
                <div className="absolute p-2 text-white rounded shadow-md">
                    <div className="latex-content">{latex}</div>
                </div>
            </Draggable>
        ))}
    </>
    
    );
}
