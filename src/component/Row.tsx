import Letter from './Letter';
import { LetterObject } from './GameMap';

type RowProps = { rowContent: LetterObject[] };

const Row: React.FC<RowProps> = ({ rowContent }) => {
  return (
    <div className="flex gap-[5px]">
      {rowContent.map((letter: LetterObject, index) => (
        <Letter key={index} letterObject={letter} />
      ))}
    </div>
  );
};

export default Row;
