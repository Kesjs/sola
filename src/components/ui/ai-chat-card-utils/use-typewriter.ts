import { useEffect, useState } from 'react'

export function useTypewriter(prompts: string[], enabled: boolean) {
  const [text, setText] = useState('')
  useEffect(() => {
    if (!enabled || prompts.length === 0) return
    let promptIndex = 0; let character = 0; let deleting = false
    const timer = window.setInterval(() => {
      const prompt = prompts[promptIndex] ?? ''
      character = deleting ? character - 1 : character + 1
      if (character >= prompt.length) deleting = true
      if (character <= 0 && deleting) { deleting = false; promptIndex = (promptIndex + 1) % prompts.length }
      setText(prompt.slice(0, character))
    }, deleting ? 35 : 55)
    return () => window.clearInterval(timer)
  }, [enabled, prompts])
  return { text }
}
