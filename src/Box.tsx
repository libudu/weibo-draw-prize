import { FC } from 'react';

export const BORDER = '2px solid #000';

type BoxProps = {
  enable: boolean;
  name?: string;
  count?: number;
  delay?: number;
  canHover?: boolean;
  onClick?: () => void;
};

const COLOR_LIST = [
  'bg-blue-100',
  'bg-blue-200',
  'bg-blue-300',
  'bg-blue-400',
  'bg-blue-500',
  'bg-blue-600',
  'bg-blue-700',
];

const Box: FC<BoxProps> = ({ enable, name, count, delay, canHover, onClick }) => {
  const index = Math.max(0, Math.min(COLOR_LIST.length - 1, count || 0));
  const backgroundColor = enable ? COLOR_LIST[index] : 'bg-gray-500';
  return (
    <div
      className={`w-40 h-20 relative flex flex-col items-center justify-center text-xl overflow-hidden flex-shrink-0 ${backgroundColor}`}
      style={{
        borderRight: BORDER,
        borderBottom: BORDER,
      }}
      onClick={onClick}
    >
      {
        enable &&
        <>
          <div>名称:{ name }</div>
          <div>次数:{ count }</div>
        </>
      }
      <div
        className={`absolute w-full h-full z-10 bg-gray-500 ${canHover ? 'hover:bg-gray-400' : ''}`}
        style={{
          opacity: enable ? 0 : 1,
          transition: enable ? 'all 1s' : '',
          transitionDelay: enable && delay ? `${delay}s` : '',}}
      >
      </div>
    </div>
  )
};

export default Box;