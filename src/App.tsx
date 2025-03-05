import React, { useState, useEffect } from 'react';
import { Cell } from './components/Cell';
import { Controls } from './components/Controls';
import { SudokuGenerator, checkWin } from './utils/sudoku';
import { cn } from './utils/cn';

type Difficulty = 'easy' | 'medium' | 'hard';

type GameState = {
  puzzle: number[][];
  solution: number[][];
  notes: number[][][];
  selected: [number, number] | null;
  history: number[][][];
  historyIndex: number;
  notesMode: boolean;
  timer: number;
  mistakes: Set<string>;
  difficulty: Difficulty;
};

function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const generator = new SudokuGenerator();
    const { puzzle, solution } = generator.generate('medium');
    return {
      puzzle,
      solution,
      notes: Array(9).fill(null).map(() => Array(9).fill(null).map(() => [])),
      selected: null,
      history: [puzzle.map(row => [...row])],
      historyIndex: 0,
      notesMode: false,
      timer: 0,
      mistakes: new Set(),
      difficulty: 'medium',
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => ({ ...prev, timer: prev.timer + 1 }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCellClick = (row: number, col: number) => {
    setGameState(prev => ({ ...prev, selected: [row, col] }));
  };

  const handleNumberInput = (num: number) => {
    if (!gameState.selected) return;

    const [row, col] = gameState.selected;
    const newPuzzle = gameState.puzzle.map(r => [...r]);
    
    if (gameState.notesMode) {
      const newNotes = gameState.notes.map(r => r.map(c => [...c]));
      const cellNotes = newNotes[row][col];
      const noteIndex = cellNotes.indexOf(num);
      
      if (noteIndex === -1) {
        cellNotes.push(num);
      } else {
        cellNotes.splice(noteIndex, 1);
      }
      
      setGameState(prev => ({
        ...prev,
        notes: newNotes,
      }));
      return;
    }

    if (num === gameState.solution[row][col]) {
      newPuzzle[row][col] = num;
      const newHistory = gameState.history.slice(0, gameState.historyIndex + 1);
      newHistory.push(newPuzzle.map(r => [...r]));
      
      setGameState(prev => ({
        ...prev,
        puzzle: newPuzzle,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        notes: prev.notes.map(r => r.map(c => [])),
      }));
    } else {
      const mistake = `${row},${col},${num}`;
      setGameState(prev => ({
        ...prev,
        mistakes: new Set([...prev.mistakes, mistake]),
      }));
    }
  };

  const handleUndo = () => {
    if (gameState.historyIndex > 0) {
      setGameState(prev => ({
        ...prev,
        historyIndex: prev.historyIndex - 1,
        puzzle: prev.history[prev.historyIndex - 1].map(r => [...r]),
      }));
    }
  };

  const handleRedo = () => {
    if (gameState.historyIndex < gameState.history.length - 1) {
      setGameState(prev => ({
        ...prev,
        historyIndex: prev.historyIndex + 1,
        puzzle: prev.history[prev.historyIndex + 1].map(r => [...r]),
      }));
    }
  };

  const handleHint = () => {
    if (!gameState.selected) return;
    
    const [row, col] = gameState.selected;
    if (gameState.puzzle[row][col] === 0) {
      const newPuzzle = gameState.puzzle.map(r => [...r]);
      newPuzzle[row][col] = gameState.solution[row][col];
      
      const newHistory = gameState.history.slice(0, gameState.historyIndex + 1);
      newHistory.push(newPuzzle.map(r => [...r]));
      
      setGameState(prev => ({
        ...prev,
        puzzle: newPuzzle,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      }));
    }
  };

  const startNewGame = (difficulty: Difficulty = gameState.difficulty) => {
    const generator = new SudokuGenerator();
    const { puzzle, solution } = generator.generate(difficulty);
    setGameState({
      puzzle,
      solution,
      notes: Array(9).fill(null).map(() => Array(9).fill(null).map(() => [])),
      selected: null,
      history: [puzzle.map(row => [...row])],
      historyIndex: 0,
      notesMode: false,
      timer: 0,
      mistakes: new Set(),
      difficulty,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sudoku</h1>
          <div className="flex items-center gap-4">
            <select
              value={gameState.difficulty}
              onChange={(e) => startNewGame(e.target.value as Difficulty)}
              className="px-3 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <div className="text-lg font-mono">{formatTime(gameState.timer)}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-9 gap-[1px] bg-gray-400 p-[2px] mb-4">
          {gameState.puzzle.map((row, i) =>
            row.map((cell, j) => {
              const isSelected = gameState.selected?.[0] === i && gameState.selected?.[1] === j;
              const isHighlighted = gameState.selected?.[0] === i || gameState.selected?.[1] === j;
              const isSameNumber = cell !== 0 && gameState.selected && 
                gameState.puzzle[gameState.selected[0]][gameState.selected[1]] === cell;
              const hasError = Array.from(gameState.mistakes).some(m => {
                const [row, col, num] = m.split(',').map(Number);
                return row === i && col === j;
              });
              const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
              const isAlternateBox = (Math.floor(i / 3) + Math.floor(j / 3)) % 2 === 0;

              return (
                <div
                  key={`${i}-${j}`}
                  className={cn(
                    'relative',
                    j % 3 === 2 && j !== 8 && 'border-r-2 border-r-gray-400',
                    i % 3 === 2 && i !== 8 && 'border-b-2 border-b-gray-400'
                  )}
                >
                  <Cell
                    value={cell}
                    isInitial={gameState.history[0][i][j] !== 0}
                    isSelected={isSelected}
                    isHighlighted={isHighlighted}
                    isSameNumber={isSameNumber}
                    hasError={hasError}
                    notes={gameState.notes[i][j]}
                    onClick={() => handleCellClick(i, j)}
                    isAlternateBox={isAlternateBox}
                  />
                </div>
              );
            })
          )}
        </div>

        <Controls
          onNumberClick={handleNumberInput}
          onNotesToggle={() => setGameState(prev => ({ ...prev, notesMode: !prev.notesMode }))}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onHint={handleHint}
          onNewGame={() => startNewGame()}
          notesMode={gameState.notesMode}
          canUndo={gameState.historyIndex > 0}
          canRedo={gameState.historyIndex < gameState.history.length - 1}
        />

        {checkWin(gameState.puzzle) && (
          <div className="mt-4 p-4 bg-green-100 rounded-lg text-center">
            <h2 className="text-xl font-bold text-green-800">Congratulations!</h2>
            <p className="text-green-700">You solved the puzzle in {formatTime(gameState.timer)}!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;