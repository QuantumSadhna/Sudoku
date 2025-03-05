import React from 'react';
import { Pencil, Undo2, Redo2, Spline as BulbOutline, RotateCcw } from 'lucide-react';

interface ControlsProps {
  onNumberClick: (num: number) => void;
  onNotesToggle: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onHint: () => void;
  onNewGame: () => void;
  notesMode: boolean;
  canUndo: boolean;
  canRedo: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  onNumberClick,
  onNotesToggle,
  onUndo,
  onRedo,
  onHint,
  onNewGame,
  notesMode,
  canUndo,
  canRedo,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <button
          onClick={() => onNotesToggle()}
          className={`p-2 rounded ${
            notesMode ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          <Pencil size={20} />
        </button>
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-2 rounded bg-gray-200 disabled:opacity-50"
        >
          <Undo2 size={20} />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-2 rounded bg-gray-200 disabled:opacity-50"
        >
          <Redo2 size={20} />
        </button>
        <button
          onClick={onHint}
          className="p-2 rounded bg-yellow-200"
        >
          <BulbOutline size={20} />
        </button>
        <button
          onClick={onNewGame}
          className="p-2 rounded bg-green-200"
        >
          <RotateCcw size={20} />
        </button>
      </div>
      <div className="grid grid-cols-9 gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => onNumberClick(num)}
            className="w-10 h-10 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};