import React, { useEffect, useReducer } from 'react';
import Row from './Row';

type Status = 'blank' | 'guess' | 'wrong' | 'near' | 'correct';
export type LetterObject = {
  letter: string;
  status: Status;
};
type GameInfo = {
  guessingRows: LetterObject[][];
  currentRowIndex: number;
};
type ActionTypes =
  | {
      type: 'PRESS_ALPHABET' | 'PRESS_ENTER';
      payload: { [key: string]: string };
    }
  | { type: 'PRESS_BACKSPACE' };

function reducer(gameInfo: GameInfo, action: ActionTypes): GameInfo {
  const { guessingRows, currentRowIndex } = gameInfo;
  const currentRow = guessingRows[currentRowIndex];
  const firstEmpty = currentRow.findIndex(
    (letterObject) => letterObject.letter === ''
  );
  let newRow = currentRow;
  let nextRowIndex = currentRowIndex;
  switch (action.type) {
    case 'PRESS_ALPHABET': {
      if (firstEmpty > -1) {
        newRow = currentRow.map(
          (letterObject, index): LetterObject =>
            index === firstEmpty
              ? { letter: action.payload.keyValue, status: 'guess' }
              : letterObject
        );
      }
      break;
    }
    case 'PRESS_BACKSPACE': {
      let lastLetter: number;
      if (firstEmpty === -1) {
        lastLetter = 4;
      } else if (firstEmpty === 0) {
        lastLetter = -1;
      } else {
        lastLetter = firstEmpty - 1;
      }

      if (lastLetter > -1) {
        newRow = currentRow.map(
          (letterObject, index): LetterObject =>
            index === lastLetter
              ? { letter: '', status: 'blank' }
              : letterObject
        );
      }
      break;
    }
    case 'PRESS_ENTER': {
      if (firstEmpty === -1) {
        const answer = action.payload.answer.toUpperCase().split('');
        newRow = currentRow.map((letterObject, index): LetterObject => {
          if (letterObject.letter === answer[index]) {
            return { letter: letterObject.letter, status: 'correct' };
          } else if (answer.includes(letterObject.letter)) {
            return { letter: letterObject.letter, status: 'near' };
          }
          return { letter: letterObject.letter, status: 'wrong' };
        });
        nextRowIndex = currentRowIndex + 1;
      }
      break;
    }
    default:
      throw new Error();
  }
  const newGuessingRows: LetterObject[][] = guessingRows.map((row, index) =>
    index === currentRowIndex ? newRow : row
  );
  return {
    guessingRows: newGuessingRows,
    currentRowIndex: nextRowIndex,
  };
}

export const GameMap: React.FC = () => {
  const initialRows: LetterObject[][] = new Array(6).fill(
    new Array(5).fill({
      letter: '',
      status: 'blank',
    })
  );
  const [gameInfo, dispatch] = useReducer(reducer, {
    guessingRows: initialRows,
    currentRowIndex: 0,
  });
  const isBingo = gameInfo.guessingRows.some(
    (row) => row.every((letter) => letter.status === 'correct') === true
  );

  useEffect(() => {
    const answer = 'piggy';
    const handleKeyIn = (event: KeyboardEvent) => {
      if (!isBingo && gameInfo.currentRowIndex < 6) {
        if (/^[A-Za-z]{1}$/.test(event.key)) {
          dispatch({
            type: 'PRESS_ALPHABET',
            payload: { keyValue: event.key.toUpperCase() },
          });
        } else if (event.key === 'Backspace') {
          dispatch({ type: 'PRESS_BACKSPACE' });
        } else if (event.key === 'Enter') {
          dispatch({
            type: 'PRESS_ENTER',
            payload: { answer: answer },
          });
        }
      }
    };
    window.addEventListener('keyup', handleKeyIn);
    return () => window.removeEventListener('keyup', handleKeyIn);
  }, [gameInfo, isBingo]);

  return (
    <div className="h-screen flex flex-col justify-start items-center">
      <p className="text-3xl my-8 font-bold">Wordle</p>
      <div className="flex gap-[5px] flex-col">
        {gameInfo.guessingRows.map((row: LetterObject[], index) => (
          <Row key={index} rowContent={row} />
        ))}
        {isBingo && <p className="text-center">BINGO!! Congrats!!</p>}
        {!isBingo && gameInfo.currentRowIndex > 5 && (
          <p className="text-center">You missed. Try again.</p>
        )}
      </div>
    </div>
  );
};
