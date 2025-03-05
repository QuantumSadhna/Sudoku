// Sudoku generator and solver
export class SudokuGenerator {
  private grid: number[][];

  constructor() {
    this.grid = Array(9).fill(null).map(() => Array(9).fill(0));
  }

  isValid(num: number, pos: [number, number]): boolean {
    const [row, col] = pos;

    // Check row
    for (let x = 0; x < 9; x++) {
      if (this.grid[row][x] === num && x !== col) return false;
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (this.grid[x][col] === num && x !== row) return false;
    }

    // Check box
    const boxX = Math.floor(col / 3) * 3;
    const boxY = Math.floor(row / 3) * 3;

    for (let i = boxY; i < boxY + 3; i++) {
      for (let j = boxX; j < boxX + 3; j++) {
        if (this.grid[i][j] === num && i !== row && j !== col) return false;
      }
    }

    return true;
  }

  solve(): boolean {
    let row = -1;
    let col = -1;
    let isEmpty = false;

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.grid[i][j] === 0) {
          row = i;
          col = j;
          isEmpty = true;
          break;
        }
      }
      if (isEmpty) break;
    }

    if (!isEmpty) return true;

    for (let num = 1; num <= 9; num++) {
      if (this.isValid(num, [row, col])) {
        this.grid[row][col] = num;
        if (this.solve()) return true;
        this.grid[row][col] = 0;
      }
    }

    return false;
  }

  generate(difficulty: 'easy' | 'medium' | 'hard'): number[][] {
    // Fill diagonal boxes
    for (let i = 0; i < 9; i += 3) {
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          let num;
          do {
            num = Math.floor(Math.random() * 9) + 1;
          } while (!this.isValid(num, [i + j, i + k]));
          this.grid[i + j][i + k] = num;
        }
      }
    }

    // Fill remaining cells
    this.solve();

    // Create puzzle by removing numbers
    const solution = this.grid.map(row => [...row]);
    const cellsToRemove = {
      easy: 40,
      medium: 50,
      hard: 60
    }[difficulty];

    for (let i = 0; i < cellsToRemove; i++) {
      let row, col;
      do {
        row = Math.floor(Math.random() * 9);
        col = Math.floor(Math.random() * 9);
      } while (this.grid[row][col] === 0);
      this.grid[row][col] = 0;
    }

    return {
      puzzle: this.grid.map(row => [...row]),
      solution
    };
  }
}

export const checkWin = (grid: number[][]): boolean => {
  // Check if grid is complete and valid
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j] === 0) return false;
    }
  }
  return true;
};