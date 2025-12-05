"use client";

import { useEffect, useRef } from "react";

const CELL_SIZE = 5;
const STEP_INTERVAL = 100; // ms between simulation steps

// Drossel-Schwabl forest-fire model parameters
// For critical behavior: f << p << 1, with p/f giving avg trees between strikes
const P_GROWTH = 0.005; // very slow tree growth - creates natural firebreaks
const P_LIGHTNING = 0.00003; // rare lightning strikes

// Cell states
const EMPTY = 0;
const TREE = 1;
const BURNING = 2;

const ForestFireBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<Uint8Array | null>(null);
  const nextGridRef = useRef<Uint8Array | null>(null);
  const dimensionsRef = useRef({ cols: 0, rows: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let lastStepTime = 0;

    const initializeGrid = () => {
      const cols = Math.ceil(window.innerWidth / CELL_SIZE);
      const rows = Math.ceil(window.innerHeight / CELL_SIZE);
      dimensionsRef.current = { cols, rows };

      const size = cols * rows;
      gridRef.current = new Uint8Array(size);
      nextGridRef.current = new Uint8Array(size);

      // Initialize with sparse, patchy trees for interesting critical dynamics
      for (let i = 0; i < size; i++) {
        gridRef.current[i] = Math.random() < 0.08 ? TREE : EMPTY;
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeGrid();
    };

    const isInBounds = (x: number, y: number): boolean => {
      const { cols, rows } = dimensionsRef.current;
      return x >= 0 && x < cols && y >= 0 && y < rows;
    };

    const getIndex = (x: number, y: number): number => {
      const { cols } = dimensionsRef.current;
      return y * cols + x;
    };

    const hasNeighborBurning = (x: number, y: number): boolean => {
      const grid = gridRef.current;
      if (!grid) return false;

      // Check 4-neighborhood (von Neumann) - no wrapping
      const neighbors = [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
      ];

      for (const [nx, ny] of neighbors) {
        if (isInBounds(nx, ny) && grid[getIndex(nx, ny)] === BURNING) {
          return true;
        }
      }
      return false;
    };

    const simulateStep = () => {
      const grid = gridRef.current;
      const nextGrid = nextGridRef.current;
      if (!grid || !nextGrid) return;

      const { cols, rows } = dimensionsRef.current;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const idx = y * cols + x;
          const cell = grid[idx];

          if (cell === BURNING) {
            // Rule 1: Burning cell turns into empty
            nextGrid[idx] = EMPTY;
          } else if (cell === TREE) {
            if (hasNeighborBurning(x, y)) {
              // Rule 2: Tree burns if neighbor is burning
              nextGrid[idx] = BURNING;
            } else if (Math.random() < P_LIGHTNING) {
              // Rule 3: Tree ignites with probability f
              nextGrid[idx] = BURNING;
            } else {
              nextGrid[idx] = TREE;
            }
          } else {
            // Rule 4: Empty space fills with tree with probability p
            if (Math.random() < P_GROWTH) {
              nextGrid[idx] = TREE;
            } else {
              nextGrid[idx] = EMPTY;
            }
          }
        }
      }

      // Swap buffers
      gridRef.current = nextGrid;
      nextGridRef.current = grid;
    };

    const render = () => {
      const grid = gridRef.current;
      if (!grid) return;

      const { cols, rows } = dimensionsRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const cell = grid[y * cols + x];

          if (cell === TREE) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.018)";
            ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          } else if (cell === BURNING) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          }
          // Empty cells are transparent (not drawn)
        }
      }
    };

    const animate = (timestamp: number) => {
      if (timestamp - lastStepTime >= STEP_INTERVAL) {
        simulateStep();
        render();
        lastStepTime = timestamp;
      }
      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    render();
    animationId = requestAnimationFrame(animate);

    const handleResize = () => {
      resizeCanvas();
      render();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden="true"
    />
  );
};

export default ForestFireBackground;
