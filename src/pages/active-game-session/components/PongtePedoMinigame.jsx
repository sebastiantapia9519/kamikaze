import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';

// Constantes
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const BALL_RADIUS = 10;
const BASE_BALL_SPEED = 8; // Más rápido inicialmente
const SPEED_INCREMENT = 1.08; // Incremento más agresivo (8%)

/**
 * Minijuego "Pongte Pedo".
 * Estilo Pong para 2 jugadores en formato vertical.
 * Incluye modo "Muerte Súbita" que agrega una segunda pelota y termina cuando alguien falla.
 */
const PongtePedoMinigame = ({ onClose, players }) => {
    const canvasRef = useRef(null);
    const requestRef = useRef(null);
    
    const [gameState, setGameState] = useState('intro'); // intro, playing, finished
    const [suddenDeath, setSuddenDeath] = useState(false);
    
    // Nombres de jugadores (Aseguramos que tengamos 2)
    const p1Name = players && players.length > 0 ? players[0].name : 'Jugador 1';
    const p2Name = players && players.length > 1 ? players[1].name : 'Jugador 2';
    
    // Refs mutables para el game loop para evitar re-renders
    const gameData = useRef({
        p1X: 150,
        p2X: 150,
        balls: [],
        p1Lost: 0,
        p2Lost: 0,
        startTime: 0,
        suddenDeathTriggered: false,
        gameOver: false,
        canvasW: 300,
        canvasH: 500,
    });

    const initBalls = (canvasW, canvasH, count = 1) => {
        const balls = [];
        for(let i=0; i<count; i++) {
             balls.push({
                 x: canvasW / 2,
                 y: canvasH / 2,
                 vx: (Math.random() > 0.5 ? 1 : -1) * BASE_BALL_SPEED,
                 vy: (Math.random() > 0.5 ? 1 : -1) * BASE_BALL_SPEED,
                 radius: BALL_RADIUS,
                 speed: BASE_BALL_SPEED
             });
        }
        return balls;
    };

    const startGame = () => {
        setGameState('playing');
        
        // Reset data timeout para asegurar que el canvas se montó
        setTimeout(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            
            gameData.current.p1Lost = 0;
            gameData.current.p2Lost = 0;
            gameData.current.suddenDeathTriggered = false;
            gameData.current.gameOver = false;
            gameData.current.startTime = Date.now();
            
            const parent = canvas.parentElement;
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
            gameData.current.canvasW = canvas.width;
            gameData.current.canvasH = canvas.height;
            
            gameData.current.p1X = canvas.width / 2 - PADDLE_WIDTH / 2;
            gameData.current.p2X = canvas.width / 2 - PADDLE_WIDTH / 2;
            
            gameData.current.balls = initBalls(canvas.width, canvas.height, 1);
            
            requestRef.current = requestAnimationFrame(updateGame);
        }, 100);
    };

    const updateGame = () => {
        if (gameData.current.gameOver) return;

        const data = gameData.current;
        const now = Date.now();
        const elapsed = (now - data.startTime) / 1000; // en segundos

        // Trigger Sudden Death a los 45 segundos
        if (elapsed > 45 && !data.suddenDeathTriggered) {
            data.suddenDeathTriggered = true;
            setSuddenDeath(true);
            
            // Agregar segunda pelota
            const newBall = initBalls(data.canvasW, data.canvasH, 1)[0];
            // Hacer la nueva pelota un poco más rápida para aumentar el caos
            newBall.speed = BASE_BALL_SPEED * 1.5;
            newBall.vx = (Math.random() > 0.5 ? 1 : -1) * newBall.speed;
            newBall.vy = (Math.random() > 0.5 ? 1 : -1) * newBall.speed;
            data.balls.push(newBall);
        }

        const W = data.canvasW;
        const H = data.canvasH;

        data.balls.forEach(ball => {
            ball.x += ball.vx;
            ball.y += ball.vy;

            // Paredes laterales
            if (ball.x - ball.radius < 0) {
                ball.x = ball.radius;
                ball.vx *= -1;
            } else if (ball.x + ball.radius > W) {
                ball.x = W - ball.radius;
                ball.vx *= -1;
            }

            // Rebote P1 (Top)
            const p1Y = 20;
            if (ball.y - ball.radius <= p1Y + PADDLE_HEIGHT && ball.y + ball.radius >= p1Y) {
                if (ball.x >= data.p1X && ball.x <= data.p1X + PADDLE_WIDTH) {
                    ball.y = p1Y + PADDLE_HEIGHT + ball.radius;
                    ball.vy *= -1;
                    ball.speed *= SPEED_INCREMENT;
                    
                    let hitPoint = ball.x - (data.p1X + PADDLE_WIDTH / 2);
                    hitPoint = hitPoint / (PADDLE_WIDTH / 2);
                    ball.vx = hitPoint * ball.speed;
                    
                    const currentMag = Math.sqrt(ball.vx*ball.vx + ball.vy*ball.vy);
                    ball.vx = (ball.vx / currentMag) * ball.speed;
                    ball.vy = (Math.abs(ball.vy) / currentMag) * ball.speed;
                }
            }

            // Rebote P2 (Bottom)
            const p2Y = H - 20 - PADDLE_HEIGHT;
            if (ball.y + ball.radius >= p2Y && ball.y - ball.radius <= p2Y + PADDLE_HEIGHT) {
                if (ball.x >= data.p2X && ball.x <= data.p2X + PADDLE_WIDTH) {
                    ball.y = p2Y - ball.radius;
                    ball.vy *= -1;
                    ball.speed *= SPEED_INCREMENT;

                    let hitPoint = ball.x - (data.p2X + PADDLE_WIDTH / 2);
                    hitPoint = hitPoint / (PADDLE_WIDTH / 2);
                    ball.vx = hitPoint * ball.speed;
                    
                    const currentMag = Math.sqrt(ball.vx*ball.vx + ball.vy*ball.vy);
                    ball.vx = (ball.vx / currentMag) * ball.speed;
                    ball.vy = -(Math.abs(ball.vy) / currentMag) * ball.speed;
                }
            }

            // GOL P1 (Se fue por arriba)
            if (ball.y - ball.radius < 0) {
                handleGoal('p1', ball, W, H);
            }
            
            // GOL P2 (Se fue por abajo)
            if (ball.y + ball.radius > H) {
                handleGoal('p2', ball, W, H);
            }
        });

        draw(data);

        if (!data.gameOver) {
            requestRef.current = requestAnimationFrame(updateGame);
        }
    };

    const handleGoal = (loser, ball, W, H) => {
        const data = gameData.current;
        if (loser === 'p1') data.p1Lost += 1;
        if (loser === 'p2') data.p2Lost += 1;

        if (data.suddenDeathTriggered) {
            // FIN DEL JUEGO INMEDIATO AL PERDER DURANTE MUERTE SÚBITA
            data.gameOver = true;
            setGameState('finished');
        } else {
            // Reset ball position
            ball.x = W / 2;
            ball.y = H / 2;
            ball.speed = BASE_BALL_SPEED;
            ball.vx = (Math.random() > 0.5 ? 1 : -1) * BASE_BALL_SPEED;
            ball.vy = (loser === 'p1' ? 1 : -1) * BASE_BALL_SPEED; // va hacia el que perdió
        }
    };

    const draw = (data) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = data.canvasW;
        const H = data.canvasH;

        // Limpiar
        ctx.clearRect(0, 0, W, H);

        // Dibujar red (medio)
        ctx.setLineDash([5, 15]);
        ctx.beginPath();
        ctx.moveTo(0, H/2);
        ctx.lineTo(W, H/2);
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.stroke();
        ctx.setLineDash([]);

        // P1 Paddle (Top - Cyan)
        ctx.fillStyle = '#06b6d4'; // cyan-500
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(data.p1X, 20, PADDLE_WIDTH, PADDLE_HEIGHT, 8);
        ctx.fill();

        // P2 Paddle (Bottom - Pink)
        ctx.fillStyle = '#ec4899'; // pink-500
        ctx.shadowColor = '#ec4899';
        ctx.beginPath();
        ctx.roundRect(data.p2X, H - 20 - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT, 8);
        ctx.fill();

        // Pelotas
        data.balls.forEach(ball => {
            ctx.fillStyle = data.suddenDeathTriggered ? '#ef4444' : '#ffffff'; // rojo si es sudden death
            ctx.shadowColor = data.suddenDeathTriggered ? '#ef4444' : '#ffffff';
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        // Puntuaciones (Tragos acumulados)
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = 'bold 48px sans-serif';
        ctx.textAlign = 'center';
        // P1 score (Top)
        ctx.fillText(data.p1Lost, W/2, H/2 - 40);
        // P2 score (Bottom)
        ctx.fillText(data.p2Lost, W/2, H/2 + 80);
    };

    useEffect(() => {
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    // Touch Handling - Movemos las barras
    const handleTouchMove = (e) => {
        if (gameState !== 'playing') return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        
        // Soportar multiples touches (uno arriba, uno abajo)
        Array.from(e.touches).forEach(touch => {
            const y = touch.clientY - rect.top;
            const x = touch.clientX - rect.left;

            if (y < canvas.height / 2) {
                // Controla P1
                let newX = x - PADDLE_WIDTH / 2;
                if (newX < 0) newX = 0;
                if (newX > canvas.width - PADDLE_WIDTH) newX = canvas.width - PADDLE_WIDTH;
                gameData.current.p1X = newX;
            } else {
                // Controla P2
                let newX = x - PADDLE_WIDTH / 2;
                if (newX < 0) newX = 0;
                if (newX > canvas.width - PADDLE_WIDTH) newX = canvas.width - PADDLE_WIDTH;
                gameData.current.p2X = newX;
            }
        });
    };

    return (
        <div className="absolute inset-0 bg-gray-950 z-[60] flex flex-col items-center justify-center overflow-hidden touch-none">
            {gameState === 'intro' && (
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    className="text-center p-6 z-10 w-full max-w-sm"
                >
                    <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-500/20 text-indigo-400 mx-auto">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-black text-white mb-2 tracking-wider drop-shadow-md">
                        PONGTE PEDO
                    </h2>
                    <p className="text-gray-300 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
                        <span className="text-cyan-400 font-bold">{p1Name}</span> (Arriba) vs <span className="text-pink-400 font-bold">{p2Name}</span> (Abajo)
                        <br/><br/>
                        Desliza tu dedo en tu mitad para mover la barra. ¡Pierde un gol, bebe un trago!
                        <br/><br/>
                        A los 45s arranca la <strong className="text-red-400">Muerte Súbita</strong> con doble pelota. El primero en fallar ahí, acaba el juego.
                    </p>
                    <Button onClick={startGame} className="bg-indigo-600 hover:bg-indigo-500 text-white w-full py-4 text-xl shadow-lg shadow-indigo-500/30">
                        ¡A Jugar!
                    </Button>
                </motion.div>
            )}

            {gameState === 'playing' && (
                <div className="w-full h-full relative" onTouchMove={handleTouchMove}>
                    {suddenDeath && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 overflow-hidden">
                            <motion.div 
                                animate={{ opacity: [0.1, 0.3, 0.1] }} 
                                transition={{ repeat: Infinity, duration: 0.5 }}
                                className="absolute inset-0 bg-red-500"
                            />
                            <h2 className="text-red-500/30 font-black text-6xl tracking-widest uppercase rotate-90 whitespace-nowrap">
                                MUERTE SÚBITA
                            </h2>
                        </div>
                    )}
                    
                    {/* Nombres de los jugadores en los extremos */}
                    <div className="absolute top-8 w-full text-center text-cyan-500/50 font-bold text-xl pointer-events-none uppercase tracking-widest">{p1Name}</div>
                    <div className="absolute bottom-8 w-full text-center text-pink-500/50 font-bold text-xl pointer-events-none uppercase tracking-widest">{p2Name}</div>

                    <canvas 
                        ref={canvasRef} 
                        className="w-full h-full relative z-10 touch-none block"
                    />
                </div>
            )}

            {gameState === 'finished' && (
                <motion.div 
                    initial={{ y: 50, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    className="text-center p-6 bg-gray-900 border border-gray-700 rounded-2xl z-20 max-w-sm w-full mx-4 shadow-2xl"
                >
                    <h2 className="text-3xl font-black text-red-500 mb-2 uppercase tracking-wide">¡FIN DEL JUEGO!</h2>
                    <p className="text-gray-300 mb-6">Alguien parpadeó en la muerte súbita.</p>
                    
                    <div className="space-y-4 mb-8">
                        <div className="bg-gray-800 p-4 rounded-xl flex justify-between items-center border-l-4 border-cyan-500">
                            <span className="font-bold text-white text-xl">{p1Name}</span>
                            <span className="text-cyan-400 font-black text-3xl">{gameData.current.p1Lost} <span className="text-sm font-normal text-gray-400">tragos</span></span>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-xl flex justify-between items-center border-l-4 border-pink-500">
                            <span className="font-bold text-white text-xl">{p2Name}</span>
                            <span className="text-pink-400 font-black text-3xl">{gameData.current.p2Lost} <span className="text-sm font-normal text-gray-400">tragos</span></span>
                        </div>
                    </div>

                    <Button onClick={onClose} className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white py-4 shadow-lg">
                        Aceptar Castigo
                    </Button>
                </motion.div>
            )}
        </div>
    );
};

export default PongtePedoMinigame;
