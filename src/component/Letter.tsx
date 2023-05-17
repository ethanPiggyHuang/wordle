import { LetterObject } from './GameMap';

type LetterProps = { letterObject: LetterObject };

const Letter: React.FC<LetterProps> = ({ letterObject }) => {
  const letterClass: { [key: string]: string } = {
    basic:
      'h-[62px] w-[62px] border-2 border-solid text-[2rem] font-bold inline-flex justify-center items-center',
    blank: 'border-[#d3d6da]',
    guess: 'border-[#878a8c] text-black',
    wrong: 'bg-[#787c7e] border-none text-white',
    near: 'bg-[#c9b458] border-none text-white',
    correct: 'bg-[#538d4e] border-none text-white',
  };

  return (
    <div className={`${letterClass.basic} ${letterClass[letterObject.status]}`}>
      {letterObject.letter}
    </div>
  );
};

export default Letter;
