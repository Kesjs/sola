import * as React from 'react'
import { ArrowUp, MessageCircleDashed, Plus, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTypewriter } from '@/components/ui/ai-chat-card-utils/use-typewriter'

export interface AIChatCardProps {
  onSend?: (message: string) => void
  onReset?: () => void
  onAttach?: () => void
  className?: string
}

const prompts = ['Combien ai-je sur mon wallet ?', 'Montre-moi mon historique', 'Je veux préparer un transfert']

export function AIChatCard({ onSend, onReset, onAttach, className }: AIChatCardProps) {
  const [active, setActive] = React.useState(false)
  const [value, setValue] = React.useState('')
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const { text } = useTypewriter(prompts, !active)
  const message = active ? value : text

  const submit = () => { if (!message.trim()) return; onSend?.(message.trim()); setValue(''); setActive(false) }

  return <section className={cn('ai-chat-card', className)}>
    <div className="ai-chat-card__intro">
      <div><p className="eyebrow">SOLA</p><h2>Parlons de votre wallet.</h2><p>Posez une question ou décrivez ce que vous voulez faire.</p></div>
      <button type="button" aria-label="Réinitialiser la conversation" onClick={() => { setValue(''); setActive(false); onReset?.() }}><RotateCcw size={16} /></button>
    </div>
    <div className="ai-chat-card__empty"><span><MessageCircleDashed size={19} /></span><strong>Un wallet compréhensible</strong><p>Sola explique chaque étape et vous laisse toujours vérifier et signer.</p></div>
    <div className="ai-chat-card__composer">
      {active ? <textarea ref={inputRef} value={value} onChange={event => setValue(event.target.value)} placeholder="Écrire à Sola…" rows={2} /> : <button type="button" className="ai-chat-card__prompt" onClick={() => { setValue(text); setActive(true); requestAnimationFrame(() => inputRef.current?.focus()) }}>{message || 'Écrire à Sola…'}<i /></button>}
      <div className="ai-chat-card__actions"><button type="button" aria-label="Ajouter une pièce jointe" onClick={onAttach}><Plus size={16} /></button><button type="button" aria-label="Envoyer le message" onClick={submit}><ArrowUp size={17} /></button></div>
    </div>
  </section>
}
