import { useReducer, useEffect, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import challengesData from '../data/challenges.json';
import chaosEventsData from '../data/chaosEvents.json';

// --- CONSTANTES ---
const gameLengthMap = { quick: 15, standard: 30, extended: 45 };

// --- ALGORITMO DE BARAJADO PROFESIONAL (Fisher-Yates) ---
// Esto evita que se formen "grupos" de cartas repetidas
const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};

// Pre-procesamiento de retos (Solo se hace una vez al cargar la app)
const challengesWithIds = (() => {
    let idCounter = 1;
    const all = [];
    challengesData.regular.forEach(c => all.push({ ...c, id: idCounter++, category: 'Regular' }));
    challengesData.epic.forEach(c => all.push({ ...c, id: idCounter++, category: 'Epic' }));
    challengesData.multiplayer.forEach(c => all.push({ ...c, id: idCounter++, category: 'Multiplayer' }));
    return all;
})();

// --- HELPERS ---
const getNextPlayerIndex = (currentIndex, order, playerCount, turnDirection) => {
    if (playerCount <= 1) return 0;
    if (order === 'random') {
        let nextIndex = currentIndex;
        while (nextIndex === currentIndex) {
            nextIndex = Math.floor(Math.random() * playerCount);
        }
        return nextIndex;
    }
    const direction = (order === 'counterclockwise' ? -1 : 1) * turnDirection;
    return (currentIndex + direction + playerCount) % playerCount;
};

// --- REDUCER ---
const initialState = {
    players: [],
    shuffledChallenges: [], // Aquí vivirán los retos ya barajados
    currentChallenge: 1,
    currentPlayerIndex: 0,
    gameCompleted: false,
    startTime: null,
    gameDuration: 0,
    activeChaosEvent: null,
    turnDirection: 1,
    isLoading: true,
    showRaceMinigame: false,
    showBombMinigame: false,
    showSniperMinigame: false,
    showFingerRoulette: false,
    showTapBattle: false,
};

function gameReducer(state, action) {
    switch (action.type) {
        case 'INITIALIZE':
            return {
                ...state,
                players: action.payload.players,
                shuffledChallenges: action.payload.shuffledChallenges,
                startTime: Date.now(),
                isLoading: false
            };

        case 'NEXT_CHALLENGE': {
            const { settings, total } = action.payload;
            const nextNum = state.currentChallenge + 1;

            if (state.currentChallenge >= total) {
                return { ...state, gameCompleted: true, gameDuration: Math.floor((Date.now() - state.startTime) / 1000) };
            }

            // Lógica Caos
            if (nextNum % 7 === 0) {
                const event = chaosEventsData[Math.floor(Math.random() * chaosEventsData.length)];

                if (event.type === 'MINIGAME_RACE') return { ...state, showRaceMinigame: true, currentChallenge: nextNum };
                if (event.type === 'MINIGAME_BOMB') return { ...state, showBombMinigame: true, currentChallenge: nextNum };
                if (event.type === 'MINIGAME_SNIPER') return { ...state, showSniperMinigame: true, currentChallenge: nextNum };
                if (event.type === 'MINIGAME_ROULETTE') return { ...state, showFingerRoulette: true, currentChallenge: nextNum };
                if (event.type === 'MINIGAME_BATTLE') return { ...state, showTapBattle: true, currentChallenge: nextNum };

                return { ...state, activeChaosEvent: event, currentChallenge: nextNum };
            }

            const nextPlayer = getNextPlayerIndex(state.currentPlayerIndex, settings.turnOrder, state.players.length, state.turnDirection);
            return { ...state, currentChallenge: nextNum, currentPlayerIndex: nextPlayer };
        }

        case 'CLOSE_MINIGAME': {
            const { settings } = action.payload;
            const nextPlayer = getNextPlayerIndex(state.currentPlayerIndex, settings.turnOrder, state.players.length, state.turnDirection);
            return { ...state, showRaceMinigame: false, currentPlayerIndex: nextPlayer };
        }
        case 'CLOSE_BOMB': {
            const { settings } = action.payload;
            const nextPlayer = getNextPlayerIndex(state.currentPlayerIndex, settings.turnOrder, state.players.length, state.turnDirection);
            return { ...state, showBombMinigame: false, currentPlayerIndex: nextPlayer };
        }
        case 'CLOSE_SNIPER': {
            const { settings } = action.payload;
            const nextPlayer = getNextPlayerIndex(state.currentPlayerIndex, settings.turnOrder, state.players.length, state.turnDirection);
            return { ...state, showSniperMinigame: false, currentPlayerIndex: nextPlayer };
        }
        case 'CLOSE_ROULETTE': {
            const { settings } = action.payload;
            const nextPlayer = getNextPlayerIndex(state.currentPlayerIndex, settings.turnOrder, state.players.length, state.turnDirection);
            return { ...state, showFingerRoulette: false, currentPlayerIndex: nextPlayer };
        }
        case 'CLOSE_BATTLE': {
            const { settings } = action.payload;
            const nextPlayer = getNextPlayerIndex(state.currentPlayerIndex, settings.turnOrder, state.players.length, state.turnDirection);
            return { ...state, showTapBattle: false, currentPlayerIndex: nextPlayer };
        }
        case 'CLOSE_CHAOS': {
            const { settings } = action.payload;
            let dir = state.turnDirection;
            if (state.activeChaosEvent?.type === 'REVERSE_TURN') dir *= -1;
            const nextPlayer = getNextPlayerIndex(state.currentPlayerIndex, settings.turnOrder, state.players.length, dir);
            return { ...state, activeChaosEvent: null, turnDirection: dir, currentPlayerIndex: nextPlayer };
        }
        case 'END_GAME':
            return { ...state, gameCompleted: true, gameDuration: Math.floor((Date.now() - state.startTime) / 1000) };
        case 'RESTART':
            // Al reiniciar, barajamos de nuevo todo
            const reshuffled = shuffleArray([...challengesWithIds]);
            return { ...initialState, players: state.players, shuffledChallenges: reshuffled, startTime: Date.now(), isLoading: false };
        case 'SET_COMPLETED':
            return { ...state, gameCompleted: action.payload };

        default: return state;
    }
}

// --- EL HOOK PRINCIPAL ---
export const useActiveGame = (locationState) => {
    const navigate = useNavigate();

    // Configuración
    const [settings] = useState(() => {
        const saved = localStorage.getItem('kamikazeGameplaySettings');
        return saved ? JSON.parse(saved) : { gameLength: 'standard', turnOrder: 'random' };
    });

    const [state, dispatch] = useReducer(gameReducer, initialState);
    const totalChallenges = useMemo(() => gameLengthMap[settings.gameLength] || 30, [settings.gameLength]);

    // 1. INICIALIZACIÓN INTELIGENTE (FILTRO DE REPETIDOS)
    useEffect(() => {
        const pState = locationState?.players || [];
        const pStorage = JSON.parse(localStorage.getItem('kamikazeGamePlayers') || '[]');
        const currentPlayers = pState.length >= 2 ? pState : pStorage;

        if (currentPlayers.length < 2) {
            navigate('/player-setup');
            return;
        }

        // Cargar historial de IDs usados (Persistencia Global)
        const globalUsedIds = new Set(JSON.parse(localStorage.getItem('kamikazeGlobalUsedChallenges') || '[]'));

        // Filtrar: Solo queremos los que NO se han usado
        let available = challengesWithIds.filter(c => !globalUsedIds.has(c.id));

        // CRITERIO DE RECICLAJE:
        // Si no nos alcanzan las cartas para ESTA partida (con un margen de seguridad de 5),
        // borramos el historial y reseteamos el mazo.
        if (available.length < (totalChallenges + 5)) {
            console.log("♻️ Reciclando baraja de retos...");
            available = challengesWithIds;
            localStorage.removeItem('kamikazeGlobalUsedChallenges');
        } else {
            console.log(`✅ Usando baraja filtrada. Quedan ${available.length} retos nuevos.`);
        }

        // Barajado Fuerte
        const shuffled = shuffleArray([...available]);

        dispatch({ type: 'INITIALIZE', payload: { players: currentPlayers, shuffledChallenges: shuffled } });
    }, [locationState, navigate, totalChallenges]);

    // Helper para obtener datos del reto actual
    const getCurrentChallengeData = useCallback(() => {
        if (!state.shuffledChallenges.length) return null;
        const idx = (state.currentChallenge - 1) % state.shuffledChallenges.length;
        const challenge = state.shuffledChallenges[idx];
        if (!challenge) return null;

        let final = { ...challenge };

        // Asignación de jugadores en retos multiplayer
        if (final.category === 'Multiplayer') {
            let assigned = [];
            if (final.players === 'all') assigned = state.players.map(p => p.name);
            else {
                // Barajar jugadores también para que no siempre sea el mismo
                const shuffledPlayers = shuffleArray([...state.players]);
                assigned = shuffledPlayers.slice(0, typeof final.players === 'number' ? final.players : 2).map(p => p.name);
            }
            final.assignedPlayers = assigned;
        }
        return final;
    }, [state.shuffledChallenges, state.currentChallenge, state.players]);

    // 2. GUARDADO INMEDIATO (QUEMA DE CARTAS)
    // Cada vez que cambia el reto actual, lo marcamos como "usado" en localStorage
    useEffect(() => {
        const currentData = getCurrentChallengeData();
        if (currentData && currentData.id) {
            const usedList = JSON.parse(localStorage.getItem('kamikazeGlobalUsedChallenges') || '[]');
            // Solo agregar si no existe ya (para evitar duplicados en el array)
            if (!usedList.includes(currentData.id)) {
                usedList.push(currentData.id);
                localStorage.setItem('kamikazeGlobalUsedChallenges', JSON.stringify(usedList));
            }
        }
    }, [state.currentChallenge, getCurrentChallengeData]);

    const actions = {
        nextChallenge: () => dispatch({ type: 'NEXT_CHALLENGE', payload: { settings, total: totalChallenges } }),
        closeMinigame: () => dispatch({ type: 'CLOSE_MINIGAME', payload: { settings } }),
        closeBomb: () => dispatch({ type: 'CLOSE_BOMB', payload: { settings } }),
        closeSniper: () => dispatch({ type: 'CLOSE_SNIPER', payload: { settings } }),
        closeRoulette: () => dispatch({ type: 'CLOSE_ROULETTE', payload: { settings } }),
        closeBattle: () => dispatch({ type: 'CLOSE_BATTLE', payload: { settings } }),
        closeChaos: () => dispatch({ type: 'CLOSE_CHAOS', payload: { settings } }),
        endGame: () => dispatch({ type: 'END_GAME' }),
        restartGame: () => {
            const reshuffled = shuffleArray([...challengesWithIds]);
            dispatch({ type: 'RESTART', payload: reshuffled });
        },
        newGame: () => {
            localStorage.removeItem('kamikazeGamePlayers');
            navigate('/player-setup');
        },
        setGameCompleted: (val) => dispatch({ type: 'SET_COMPLETED', payload: val })
    };

    return {
        state,
        totalChallenges,
        currentPlayer: state.players[state.currentPlayerIndex],
        currentChallengeData: getCurrentChallengeData(),
        isLastChallenge: state.currentChallenge >= totalChallenges,
        actions
    };
};