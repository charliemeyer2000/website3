'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Subtitle } from '@/components/intuitive-ui/(native)/(typography)/subtitle';
import { Title } from '@/components/intuitive-ui/(native)/(typography)/title';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type Role = 'host' | 'guest';
type Direction = 'up' | 'down' | 'left' | 'right';
type PlayerKey = 'p1' | 'p2';

interface Coordinate {
  x: number;
  y: number;
}

interface SharedPlayerState {
  x: number;
  y: number;
  direction: Direction;
  trail: Coordinate[];
  alive: boolean;
}

interface SharedGameState {
  status: 'idle' | 'running' | 'ended';
  tick: number;
  players: Record<PlayerKey, SharedPlayerState>;
  winner?: PlayerKey | 'draw';
}

type PeerMessage =
  | { type: 'direction'; player: PlayerKey; direction: Direction }
  | { type: 'state'; state: SharedGameState };

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
      ],
    },
  ],
};

const GRID_WIDTH = 36;
const GRID_HEIGHT = 24;
const CELL_SIZE = 18;
const TICK_RATE_MS = 120;

const directionVectors: Record<Direction, Coordinate> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const KEY_TO_DIRECTION: Record<string, Direction> = {
  arrowup: 'up',
  w: 'up',
  arrowdown: 'down',
  s: 'down',
  arrowleft: 'left',
  a: 'left',
  arrowright: 'right',
  d: 'right',
};

const BACKGROUND_COLOR = '#020617';
const GRID_LINE_COLOR = 'rgba(148, 163, 184, 0.08)';
const PLAYER_ONE_COLOR = '#22d3ee';
const PLAYER_ONE_HEAD = '#06b6d4';
const PLAYER_TWO_COLOR = '#c084fc';
const PLAYER_TWO_HEAD = '#a855f7';

function createInitialPlayer(player: PlayerKey): SharedPlayerState {
  const startX =
    player === 'p1'
      ? Math.floor(GRID_WIDTH * 0.25)
      : Math.floor(GRID_WIDTH * 0.75);
  const startY = Math.floor(GRID_HEIGHT / 2);
  const direction: Direction = player === 'p1' ? 'right' : 'left';

  return {
    x: startX,
    y: startY,
    direction,
    trail: [],
    alive: true,
  };
}

function createInitialGameState(
  status: SharedGameState['status'] = 'idle',
): SharedGameState {
  return {
    status,
    tick: 0,
    winner: undefined,
    players: {
      p1: createInitialPlayer('p1'),
      p2: createInitialPlayer('p2'),
    },
  };
}

function isOppositeDirection(a: Direction, b: Direction): boolean {
  return (
    (a === 'up' && b === 'down') ||
    (a === 'down' && b === 'up') ||
    (a === 'left' && b === 'right') ||
    (a === 'right' && b === 'left')
  );
}

function advanceGame(state: SharedGameState): SharedGameState {
  if (state.status !== 'running') {
    return state;
  }

  const prevP1 = state.players.p1;
  const prevP2 = state.players.p2;

  const nextPositions: Record<PlayerKey, Coordinate> = {
    p1: prevP1.alive
      ? {
          x: prevP1.x + directionVectors[prevP1.direction].x,
          y: prevP1.y + directionVectors[prevP1.direction].y,
        }
      : { x: prevP1.x, y: prevP1.y },
    p2: prevP2.alive
      ? {
          x: prevP2.x + directionVectors[prevP2.direction].x,
          y: prevP2.y + directionVectors[prevP2.direction].y,
        }
      : { x: prevP2.x, y: prevP2.y },
  };

  const occupied = new Set<string>();
  const addOccupied = (coord: Coordinate) => {
    occupied.add(`${coord.x}:${coord.y}`);
  };

  prevP1.trail.forEach(addOccupied);
  prevP2.trail.forEach(addOccupied);
  addOccupied({ x: prevP1.x, y: prevP1.y });
  addOccupied({ x: prevP2.x, y: prevP2.y });

  const outcomes: Record<PlayerKey, { alive: boolean }> = {
    p1: { alive: prevP1.alive },
    p2: { alive: prevP2.alive },
  };

  (['p1', 'p2'] as PlayerKey[]).forEach((player) => {
    const prev = state.players[player];
    if (!prev.alive) {
      outcomes[player].alive = false;
      return;
    }
    const next = nextPositions[player];
    const hitsWall =
      next.x < 0 || next.x >= GRID_WIDTH || next.y < 0 || next.y >= GRID_HEIGHT;
    const hitsTrail = occupied.has(`${next.x}:${next.y}`);
    outcomes[player].alive = !(hitsWall || hitsTrail);
  });

  if (
    outcomes.p1.alive &&
    outcomes.p2.alive &&
    nextPositions.p1.x === nextPositions.p2.x &&
    nextPositions.p1.y === nextPositions.p2.y
  ) {
    outcomes.p1.alive = false;
    outcomes.p2.alive = false;
  }

  const nextPlayers: Record<PlayerKey, SharedPlayerState> = {
    p1: {
      ...prevP1,
      alive: outcomes.p1.alive,
      trail: [...prevP1.trail, { x: prevP1.x, y: prevP1.y }],
      x: outcomes.p1.alive ? nextPositions.p1.x : prevP1.x,
      y: outcomes.p1.alive ? nextPositions.p1.y : prevP1.y,
    },
    p2: {
      ...prevP2,
      alive: outcomes.p2.alive,
      trail: [...prevP2.trail, { x: prevP2.x, y: prevP2.y }],
      x: outcomes.p2.alive ? nextPositions.p2.x : prevP2.x,
      y: outcomes.p2.alive ? nextPositions.p2.y : prevP2.y,
    },
  };

  let status: SharedGameState['status'] = state.status;
  let winner: SharedGameState['winner'] = state.winner;

  if (!nextPlayers.p1.alive && !nextPlayers.p2.alive) {
    status = 'ended';
    winner = 'draw';
  } else if (!nextPlayers.p1.alive) {
    status = 'ended';
    winner = 'p2';
  } else if (!nextPlayers.p2.alive) {
    status = 'ended';
    winner = 'p1';
  }

  return {
    ...state,
    status,
    winner,
    tick: state.tick + 1,
    players: nextPlayers,
  };
}

async function waitForIceGatheringComplete(pc: RTCPeerConnection) {
  if (pc.iceGatheringState === 'complete') {
    return;
  }

  await new Promise<void>((resolve) => {
    const checkState = () => {
      if (pc.iceGatheringState === 'complete') {
        pc.removeEventListener('icegatheringstatechange', checkState);
        resolve();
      }
    };

    pc.addEventListener('icegatheringstatechange', checkState);
  });
}

function sanitizeSdp(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  let normalized = trimmed.replace(/\r?\n/g, '\r\n');
  if (!normalized.startsWith('v=0')) {
    return null;
  }

  if (!/\r\no=/.test(normalized)) {
    return null;
  }

  if (!normalized.endsWith('\r\n')) {
    normalized += '\r\n';
  }

  return normalized;
}

function TronPage() {
  const [role, setRole] = useState<Role | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    'idle' | 'connecting' | 'connected'
  >('idle');
  const [statusMessage, setStatusMessage] = useState(
    'Pick a role to get started.',
  );
  const [hostOffer, setHostOffer] = useState('');
  const [hostAnswerInput, setHostAnswerInput] = useState('');
  const [guestOfferInput, setGuestOfferInput] = useState('');
  const [guestAnswer, setGuestAnswer] = useState('');
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [showTouchControls, setShowTouchControls] = useState(false);

  const [gameState, setGameState] = useState<SharedGameState>(() =>
    createInitialGameState(),
  );
  const gameStateRef = useRef<SharedGameState>(gameState);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const intervalRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const myPlayerKey: PlayerKey | null = useMemo(() => {
    if (role === 'host') return 'p1';
    if (role === 'guest') return 'p2';
    return null;
  }, [role]);

  const opponentPlayerKey: PlayerKey | null = useMemo(() => {
    if (role === 'host') return 'p2';
    if (role === 'guest') return 'p1';
    return null;
  }, [role]);

  const stopGameLoop = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const sendPacket = useCallback((packet: PeerMessage) => {
    const channel = dataChannelRef.current;
    if (!channel || channel.readyState !== 'open') {
      return;
    }
    channel.send(JSON.stringify(packet));
  }, []);

  const updatePlayerDirection = useCallback(
    (playerKey: PlayerKey, nextDirection: Direction) => {
      const current = gameStateRef.current;
      if (current.status !== 'running') {
        return;
      }

      const player = current.players[playerKey];
      if (
        !player.alive ||
        player.direction === nextDirection ||
        isOppositeDirection(player.direction, nextDirection)
      ) {
        return;
      }

      const updated: SharedGameState = {
        ...current,
        players: {
          ...current.players,
          [playerKey]: {
            ...player,
            direction: nextDirection,
          },
        },
      };

      gameStateRef.current = updated;
      setGameState(updated);
    },
    [],
  );

  const handlePeerMessage = useCallback(
    (event: MessageEvent<string>) => {
      try {
        const received = JSON.parse(event.data) as PeerMessage;

        if (!received || typeof received !== 'object') {
          return;
        }

        if (received.type === 'direction') {
          if (role === 'host' && received.player === 'p2') {
            updatePlayerDirection('p2', received.direction);
          } else if (role === 'guest' && received.player === 'p1') {
            const current = gameStateRef.current;
            const player = current.players.p1;
            if (player.direction !== received.direction) {
              const updated: SharedGameState = {
                ...current,
                players: {
                  ...current.players,
                  p1: {
                    ...player,
                    direction: received.direction,
                  },
                },
              };
              gameStateRef.current = updated;
              setGameState(updated);
            }
          }
        } else if (received.type === 'state' && role === 'guest') {
          gameStateRef.current = received.state;
          setGameState(received.state);
        }
      } catch (error) {
        console.warn('Received malformed message from peer', error);
      }
    },
    [role, updatePlayerDirection],
  );

  const handleDirectionInput = useCallback(
    (direction: Direction) => {
      const current = gameStateRef.current;
      if (current.status !== 'running' || !role) {
        return;
      }

      if (role === 'host') {
        const player = current.players.p1;
        if (
          !player.alive ||
          player.direction === direction ||
          isOppositeDirection(player.direction, direction)
        ) {
          return;
        }

        updatePlayerDirection('p1', direction);
        sendPacket({ type: 'direction', player: 'p1', direction });
        return;
      }

      if (role === 'guest') {
        const player = current.players.p2;
        if (
          !player.alive ||
          player.direction === direction ||
          isOppositeDirection(player.direction, direction)
        ) {
          return;
        }

        sendPacket({ type: 'direction', player: 'p2', direction });
      }
    },
    [role, sendPacket, updatePlayerDirection],
  );

  const attachDataChannel = useCallback(
    (channel: RTCDataChannel) => {
      dataChannelRef.current = channel;

      setConnectionStatus('connecting');
      setStatusMessage(
        'Data channel negotiating... a connection should appear shortly.',
      );

      channel.onopen = () => {
        setConnectionStatus('connected');
        setStatusMessage(
          role === 'host'
            ? 'Connected! Click “Start Game” when you are ready.'
            : 'Connected! Tell the host you are ready.',
        );
      };

      channel.onmessage = handlePeerMessage;

      channel.onclose = () => {
        setConnectionStatus('idle');
        setStatusMessage('Data channel closed. You can start a fresh session.');
        stopGameLoop();
      };

      channel.onerror = (event) => {
        console.error('Data channel error', event);
        setStatusMessage('Data channel error. Try resetting the connection.');
        stopGameLoop();
      };
    },
    [handlePeerMessage, role, stopGameLoop],
  );

  const resetGame = useCallback(
    (status: SharedGameState['status'] = 'idle') => {
      const next = createInitialGameState(status);
      gameStateRef.current = next;
      setGameState(next);
      stopGameLoop();
      if (role === 'host') {
        sendPacket({ type: 'state', state: next });
      }
    },
    [role, sendPacket, stopGameLoop],
  );

  const startGame = useCallback(() => {
    if (role !== 'host' || connectionStatus !== 'connected') {
      return;
    }

    const initial = createInitialGameState('running');
    gameStateRef.current = initial;
    setGameState(initial);
    sendPacket({ type: 'state', state: initial });

    stopGameLoop();

    intervalRef.current = window.setInterval(() => {
      const current = gameStateRef.current;
      const next = advanceGame(current);
      gameStateRef.current = next;
      setGameState(next);
      sendPacket({ type: 'state', state: next });

      if (next.status === 'ended') {
        stopGameLoop();
      }
    }, TICK_RATE_MS);
  }, [connectionStatus, role, sendPacket, stopGameLoop]);

  const resetConnection = useCallback(
    (message?: string) => {
      stopGameLoop();

      if (dataChannelRef.current) {
        dataChannelRef.current.onmessage = null;
        dataChannelRef.current.close();
        dataChannelRef.current = null;
      }

      if (pcRef.current) {
        pcRef.current.onicecandidate = null;
        pcRef.current.onconnectionstatechange = null;
        pcRef.current.oniceconnectionstatechange = null;
        pcRef.current.close();
        pcRef.current = null;
      }

      setConnectionStatus('idle');
      setHostOffer('');
      setHostAnswerInput('');
      setGuestOfferInput('');
      setGuestAnswer('');
      setIsNegotiating(false);

      if (message !== undefined) {
        setStatusMessage(message);
      } else {
        setStatusMessage('Connection reset. Pick a role to try again.');
      }
    },
    [stopGameLoop],
  );

  const createPeerConnection = useCallback(() => {
    if (!role) {
      throw new Error('Select a role before creating a peer connection.');
    }

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      if (state === 'connected') {
        setConnectionStatus('connected');
      } else if (state === 'connecting') {
        setConnectionStatus('connecting');
      } else if (state === 'disconnected' || state === 'failed') {
        setConnectionStatus('idle');
        setStatusMessage(
          'Peer disconnected. You can renegotiate or reset the session.',
        );
        stopGameLoop();
      }
    };

    pc.oniceconnectionstatechange = () => {
      if (
        pc.iceConnectionState === 'disconnected' ||
        pc.iceConnectionState === 'failed' ||
        pc.iceConnectionState === 'closed'
      ) {
        setConnectionStatus('idle');
        setStatusMessage(
          'ICE connection ended. Reset and try reconnecting if needed.',
        );
        stopGameLoop();
      }
    };

    pc.onicecandidate = () => {
      if (role === 'host') {
        setHostOffer(pc.localDescription?.sdp ?? '');
      } else {
        setGuestAnswer(pc.localDescription?.sdp ?? '');
      }
    };

    if (role === 'host') {
      const channel = pc.createDataChannel('tron-game', { ordered: true });
      attachDataChannel(channel);
    } else {
      pc.ondatachannel = (event) => {
        attachDataChannel(event.channel);
      };
    }

    return pc;
  }, [attachDataChannel, role, stopGameLoop]);

  const handleSelectRole = useCallback(
    (newRole: Role) => {
      if (role === newRole) {
        return;
      }

      resetConnection();
      setRole(newRole);
      resetGame('idle');
      setStatusMessage(
        newRole === 'host'
          ? 'Click “Generate Offer” and send it to your friend.'
          : 'Paste the host offer to generate an answer.',
      );
    },
    [resetConnection, resetGame, role],
  );

  const handleResetAll = useCallback(() => {
    resetConnection('Pick a role to get started.');
    setRole(null);
    resetGame('idle');
  }, [resetConnection, resetGame]);

  const handleCreateOffer = useCallback(async () => {
    if (role !== 'host') {
      return;
    }

    try {
      setIsNegotiating(true);
      const pc = createPeerConnection();
      setStatusMessage('Creating offer...');

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await waitForIceGatheringComplete(pc);

      const sdp = pc.localDescription?.sdp ?? '';
      setHostOffer(sanitizeSdp(sdp) ?? sdp);
      setHostAnswerInput('');
      setStatusMessage(
        'Offer ready! Send it to your friend and paste their answer below.',
      );
    } catch (error) {
      console.error('Failed to create offer', error);
      setStatusMessage('Failed to create offer. Reset and try again.');
    } finally {
      setIsNegotiating(false);
    }
  }, [createPeerConnection, role]);

  const handleApplyFriendAnswer = useCallback(async () => {
    if (role !== 'host') {
      return;
    }

    const sanitized = sanitizeSdp(hostAnswerInput);
    if (!sanitized) {
      setStatusMessage(
        'The answer text looks incomplete. Make sure you paste the entire blob that starts with “v=0”.',
      );
      return;
    }

    setHostAnswerInput(sanitized);

    try {
      setIsNegotiating(true);
      const pc = pcRef.current;
      if (!pc) {
        setStatusMessage('Create an offer before applying an answer.');
        return;
      }

      await pc.setRemoteDescription({ type: 'answer', sdp: sanitized });
      setStatusMessage('Answer applied. Waiting for the connection to open...');
    } catch (error) {
      console.error('Failed to apply answer', error);
      setStatusMessage(
        'Could not apply the answer. Double-check the text and try again.',
      );
    } finally {
      setIsNegotiating(false);
    }
  }, [hostAnswerInput, role]);

  const handleApplyHostOffer = useCallback(async () => {
    if (role !== 'guest') {
      return;
    }

    const sanitizedOffer = sanitizeSdp(guestOfferInput);
    if (!sanitizedOffer) {
      setStatusMessage(
        'The offer text looks incomplete. Make sure it starts with “v=0” and includes the entire blob the host sent.',
      );
      return;
    }

    setGuestOfferInput(sanitizedOffer);

    try {
      setIsNegotiating(true);
      setGuestAnswer('');
      const pc = createPeerConnection();
      setStatusMessage('Applying offer...');

      await pc.setRemoteDescription({ type: 'offer', sdp: sanitizedOffer });
      setStatusMessage('Generating answer...');

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await waitForIceGatheringComplete(pc);

      const sdp = pc.localDescription?.sdp ?? '';
      setGuestAnswer(sanitizeSdp(sdp) ?? sdp);
      setStatusMessage('Answer ready! Send it back to the host.');
    } catch (error) {
      console.error('Failed to apply host offer', error);
      setStatusMessage('Could not process the offer. Reset and try again.');
    } finally {
      setIsNegotiating(false);
    }
  }, [createPeerConnection, guestOfferInput, role]);

  const handleCopy = useCallback(async (value: string) => {
    if (!value) {
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      setStatusMessage('Copied to clipboard!');
    } catch (error) {
      console.warn('Clipboard copy failed', error);
      setStatusMessage('Clipboard copy failed. Please copy manually.');
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio ?? 1;

    const width = GRID_WIDTH * CELL_SIZE;
    const height = GRID_HEIGHT * CELL_SIZE;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia('(pointer: coarse)');
    const update = () => setShowTouchControls(mediaQuery.matches);
    update();

    const listener = () => update();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }

    mediaQuery.addListener(listener);
    return () => mediaQuery.removeListener(listener);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio ?? 1;
    const logicalWidth = GRID_WIDTH * CELL_SIZE;
    const logicalHeight = GRID_HEIGHT * CELL_SIZE;

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, logicalWidth, logicalHeight);

    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, logicalWidth, logicalHeight);

    ctx.beginPath();
    for (let x = 0; x <= GRID_WIDTH; x += 1) {
      ctx.moveTo(x * CELL_SIZE + 0.5, 0);
      ctx.lineTo(x * CELL_SIZE + 0.5, logicalHeight);
    }
    for (let y = 0; y <= GRID_HEIGHT; y += 1) {
      ctx.moveTo(0, y * CELL_SIZE + 0.5);
      ctx.lineTo(logicalWidth, y * CELL_SIZE + 0.5);
    }
    ctx.strokeStyle = GRID_LINE_COLOR;
    ctx.lineWidth = 1;
    ctx.stroke();

    const drawPlayer = (
      player: SharedPlayerState,
      trailColor: string,
      headColor: string,
    ) => {
      ctx.fillStyle = trailColor;
      player.trail.forEach((segment) => {
        ctx.fillRect(
          segment.x * CELL_SIZE + 2,
          segment.y * CELL_SIZE + 2,
          CELL_SIZE - 4,
          CELL_SIZE - 4,
        );
      });

      ctx.fillStyle = headColor;
      ctx.fillRect(
        player.x * CELL_SIZE + 1,
        player.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2,
      );
    };

    drawPlayer(gameState.players.p1, PLAYER_ONE_COLOR, PLAYER_ONE_HEAD);
    drawPlayer(gameState.players.p2, PLAYER_TWO_COLOR, PLAYER_TWO_HEAD);

    ctx.restore();
  }, [gameState]);

  useEffect(() => {
    return () => {
      stopGameLoop();
      if (dataChannelRef.current) {
        dataChannelRef.current.onmessage = null;
        dataChannelRef.current.close();
        dataChannelRef.current = null;
      }
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
    };
  }, [stopGameLoop]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.repeat) return;
      const direction = KEY_TO_DIRECTION[event.key.toLowerCase()];
      if (!direction) return;

      event.preventDefault();

      handleDirectionInput(direction);
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleDirectionInput]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const winnerLabel = useMemo(() => {
    if (gameState.status !== 'ended' || !gameState.winner) {
      return null;
    }

    if (gameState.winner === 'draw') {
      return 'Draw! You both crashed.';
    }

    if (myPlayerKey && gameState.winner === myPlayerKey) {
      return 'You win!';
    }

    if (opponentPlayerKey && gameState.winner === opponentPlayerKey) {
      return 'Your friend wins this round.';
    }

    return 'Game over.';
  }, [gameState, myPlayerKey, opponentPlayerKey]);

  const canStartGame =
    role === 'host' &&
    connectionStatus === 'connected' &&
    gameState.status !== 'running';

  const canResetGame = role === 'host' && connectionStatus === 'connected';

  return (
    <main className="flex min-h-dvh flex-col gap-10 px-6 pb-16 pt-20 sm:px-16">
      <header className="max-w-3xl space-y-3">
        <Title>Tron (WebRTC)</Title>
        <Subtitle balance>
          Host and share a peer-to-peer light cycle duel. Use your keyboard to
          steer; arrow keys or WASD both work.
        </Subtitle>
      </header>

      <section className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 shadow-lg shadow-slate-950/40">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-slate-300">
                  Connection
                </p>
                <p className="text-lg font-semibold text-white">
                  {connectionStatus === 'connected'
                    ? 'Connected'
                    : connectionStatus === 'connecting'
                      ? 'Negotiating'
                      : 'Not connected'}
                </p>
                <p className="text-sm text-slate-400">{statusMessage}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={startGame}
                  disabled={!canStartGame}
                  className="min-w-32"
                >
                  {gameState.status === 'ended' ? 'Restart Game' : 'Start Game'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => resetGame('idle')}
                  disabled={!canResetGame}
                >
                  Reset Board
                </Button>
              </div>
            </div>

            <div className="mt-6">
              <div className="relative mx-auto max-w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
                <canvas ref={canvasRef} />

                <div className="absolute inset-0 flex items-center justify-center">
                  {gameState.status === 'idle' && (
                    <div className="rounded-full bg-slate-900/80 px-4 py-1 text-sm font-medium text-slate-200 backdrop-blur">
                      {role === 'host'
                        ? 'Press “Start Game” when your friend is connected.'
                        : 'Waiting for the host to start the game.'}
                    </div>
                  )}
                  {gameState.status === 'ended' && winnerLabel && (
                    <div className="rounded-full bg-slate-900/80 px-4 py-1 text-sm font-semibold text-slate-100 backdrop-blur">
                      {winnerLabel}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {showTouchControls ? (
            <div className="mt-6 flex justify-center">
              <div className="grid grid-cols-3 gap-4">
                <div />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="h-16 w-16 rounded-full bg-cyan-500/20 text-2xl text-cyan-100 hover:bg-cyan-500/30"
                  aria-label="Move up"
                  onPointerDown={(event) => {
                    event.preventDefault();
                    handleDirectionInput('up');
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    handleDirectionInput('up');
                  }}
                >
                  ↑
                </Button>
                <div />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="h-16 w-16 rounded-full bg-cyan-500/20 text-2xl text-cyan-100 hover:bg-cyan-500/30"
                  aria-label="Move left"
                  onPointerDown={(event) => {
                    event.preventDefault();
                    handleDirectionInput('left');
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    handleDirectionInput('left');
                  }}
                >
                  ←
                </Button>
                <div className="flex items-center justify-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Tap to steer
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="h-16 w-16 rounded-full bg-cyan-500/20 text-2xl text-cyan-100 hover:bg-cyan-500/30"
                  aria-label="Move right"
                  onPointerDown={(event) => {
                    event.preventDefault();
                    handleDirectionInput('right');
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    handleDirectionInput('right');
                  }}
                >
                  →
                </Button>
                <div />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="h-16 w-16 rounded-full bg-cyan-500/20 text-2xl text-cyan-100 hover:bg-cyan-500/30"
                  aria-label="Move down"
                  onPointerDown={(event) => {
                    event.preventDefault();
                    handleDirectionInput('down');
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    handleDirectionInput('down');
                  }}
                >
                  ↓
                </Button>
                <div />
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 shadow-lg shadow-slate-950/40">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              Controls
            </p>
            <ul className="mt-3 space-y-1 text-sm text-slate-300">
              <li>• Use arrow keys or WASD to steer your light cycle.</li>
              <li>• On touch devices, tap the on-screen directional pad to steer.</li>
              <li>• You cannot reverse direction into your own trail.</li>
              <li>• Colliding with a wall or trail ends the round.</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 shadow-lg shadow-slate-950/40">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              1. Choose a role
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                variant={role === 'host' ? 'default' : 'outline'}
                onClick={() => handleSelectRole('host')}
              >
                Host a Game
              </Button>
              <Button
                variant={role === 'guest' ? 'default' : 'outline'}
                onClick={() => handleSelectRole('guest')}
              >
                Join a Game
              </Button>
              <Button variant="ghost" onClick={handleResetAll}>
                Reset
              </Button>
            </div>
          </div>

          {role === 'host' ? (
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 shadow-lg shadow-slate-950/40">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                2. Share your offer
              </p>
              <div className="mt-4 space-y-4 text-sm text-slate-200">
                <p>
                  Click generate to produce an SDP offer. Send the entire text to
                  your friend (any chat app works). Once they respond with an
                  answer, paste it below.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleCreateOffer} disabled={isNegotiating}>
                    Generate Offer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleCopy(hostOffer)}
                    disabled={!hostOffer}
                  >
                    Copy Offer
                  </Button>
                </div>
                <Textarea
                  value={hostOffer}
                  onChange={(event) => setHostOffer(event.target.value)}
                  className="font-mono text-xs"
                  placeholder="Your offer appears here once generated..."
                  rows={8}
                />
              </div>

              <div className="mt-6 space-y-3 text-sm text-slate-200">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                  3. Paste their answer
                </p>
                <Textarea
                  value={hostAnswerInput}
                  onChange={(event) => setHostAnswerInput(event.target.value)}
                  className="font-mono text-xs"
                  placeholder="Paste your friend's answer here..."
                  rows={6}
                />
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleApplyFriendAnswer}
                    disabled={!hostAnswerInput || isNegotiating}
                  >
                    Apply Answer
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {role === 'guest' ? (
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 shadow-lg shadow-slate-950/40">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                2. Paste the host offer
              </p>
              <div className="mt-4 space-y-4 text-sm text-slate-200">
                <Textarea
                  value={guestOfferInput}
                  onChange={(event) => setGuestOfferInput(event.target.value)}
                  className="font-mono text-xs"
                  placeholder="Paste the SDP offer from your friend here..."
                  rows={8}
                />
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleApplyHostOffer}
                    disabled={!guestOfferInput || isNegotiating}
                  >
                    Generate Answer
                  </Button>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-slate-200">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                  3. Send your answer back
                </p>
                <Textarea
                  value={guestAnswer}
                  onChange={(event) => setGuestAnswer(event.target.value)}
                  className="font-mono text-xs"
                  placeholder="Your generated answer appears here..."
                  rows={6}
                />
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleCopy(guestAnswer)}
                    disabled={!guestAnswer}
                  >
                    Copy Answer
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

export default TronPage;
