import { FC } from 'react'

export const BORDER = '2px solid #000'

type BoxProps = {
  open: boolean
  name?: string
  canHover?: boolean
  onClick?: () => void
}

const Box: FC<BoxProps> = ({ open, name, canHover, onClick }) => {
  const backgroundColor = open ? 'bg-blue-100' : 'bg-gray-300'
  return (
    <div
      className={`w-40 h-20 relative flex flex-col items-center justify-center text-xl overflow-hidden flex-shrink-0 ${backgroundColor}`}
      style={{
        borderRight: BORDER,
        borderBottom: BORDER,
      }}
      onClick={onClick}
    >
      {open && <div className="break-all">{name}</div>}
      <div
        className={`absolute w-full h-full z-10 bg-gray-500 ${canHover ? 'hover:bg-gray-400' : ''}`}
        style={{
          opacity: open ? 0 : 1,
          transition: 'all 0.5s',
        }}
      ></div>
    </div>
  )
}

export default Box
