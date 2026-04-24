import { MessageCircle, X } from 'lucide-react'

interface Props {
  open: boolean
  onClick: () => void
  bubbleColor: string
}

export function Bubble({ open, onClick, bubbleColor }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? 'Close chat' : 'Open chat'}
      className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
      style={{ backgroundColor: bubbleColor }}
    >
      {open ? <X size={24} /> : <MessageCircle size={24} />}
    </button>
  )
}
