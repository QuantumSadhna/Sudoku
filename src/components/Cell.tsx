import React from 'react';
import { cn } from '../utils/cn';

interface CellProps {
  value: number;
  isInitial: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isSameNumber: boolean;
  hasError: boolean;
  notes: number[];
  isAlternateBox: boolean;
  onClick: () => void;
}

export const Cell: React.FC<CellProps> = ({
  value,
  isInitial,
  isSelected,
  isHighlighted,
  isSameNumber,
  hasError,
  notes,
  isAlternateBox,
  onClick,
}) => {
  return (
    <div
      className={cn(
        'w-11 h-11 flex items-center justify-center cursor-pointer transition-all duration-200',
        isAlternateBox ? 'bg-gray-50' : 'bg-white',
        isInitial && 'font-bold',
        isSelected && 'bg-blue-200',
        isHighlighted && !isSelected && 'bg-blue-50',
        isSameNumber && !isSelected && 'bg-green-50',
        hasError && 'text-red-500'
      )}
      onClick={onClick}
    >
      {value === 0 ? (
        <div className="grid grid-cols-3 gap-0.5 p-0.5 text-[8px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <div key={n} className={cn('flex items-center justify-center', notes.includes(n) ? 'opacity-100' : 'opacity-0')}>
              {n}
            </div>
          ))}
        </div>
      ) : (
        <span className="text-lg">{value}</span>
      )}
    </div>
  );
};