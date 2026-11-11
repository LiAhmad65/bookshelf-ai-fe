import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { useChat } from '@ai-sdk/react'
import { ChatIcon, CloseIcon, SendIcon, SparklesIcon, StopIcon } from '@/components/ui/icons'
import { libraryChatTransport, messageText } from '../utils/libraryChatTransport'

const SUGGESTIONS = [
  'Give me a quick overview of my library',
  'What should I read next?',
  'Which authors appear most often?',
]

/** Renders the light markdown the model tends to use: **bold** and "-" / "*" / "1." list lines. */
function FormattedText({ text }: { text: string }) {
  const inline = (line: string): ReactNode[] =>
    line.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) =>
      chunk.startsWith('**') && chunk.endsWith('**') ? <strong key={i}>{chunk.slice(2, -2)}</strong> : chunk,
    )

  return text.split('\n').map((line, i) => {
    const item = line.match(/^\s*(?:[-*]|\d+\.)\s+(.*)$/)
    if (item) {
      return (
        <span key={i} className="flex gap-2 pl-1">
          <span className="text-accent" aria-hidden="true">•</span>
          <span>{inline(item[1])}</span>
        </span>
      )
    }
    return line.trim() === '' ? <span key={i} className="block h-2" /> : <span key={i} className="block">{inline(line)}</span>
  })
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-1" role="status" aria-label="Assistant is thinking">
      {[0, 150, 300].map((delay) => (
        <span key={delay} className="size-1.5 animate-bounce rounded-full bg-accent" style={{ animationDelay: `${delay}ms` }} />
      ))}
    </span>
  )
}

export function LibraryChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const panelId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { messages, sendMessage, status, error, regenerate, stop, setMessages, clearError } = useChat({
    transport: libraryChatTransport,
  })

  const isBusy = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    if (!isOpen) return
    inputRef.current?.focus()
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false)
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  // Keep the newest message (and the typing indicator) in view.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, status, isOpen])

  const send = (text: string) => {
    const query = text.trim()
    if (!query || isBusy) return
    clearError()
    setInput('')
    void sendMessage({ text: query })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    send(input)
  }

  const startOver = () => {
    void stop()
    clearError()
    setMessages([])
    inputRef.current?.focus()
  }

  return (
    <>
      {isOpen && (
        <section
          id={panelId}
          aria-label="Library assistant"
          className="fixed right-4 bottom-24 z-40 flex h-[min(36rem,calc(100dvh-8rem))] w-[calc(100vw-2rem)] origin-bottom-right animate-pop flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl sm:right-6 sm:w-96"
        >
          <header className="flex items-center gap-3 border-b border-border bg-bg/60 px-4 py-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
              <SparklesIcon size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-base leading-tight font-bold">Library assistant</h2>
              <p className="truncate text-xs text-muted">Ask anything about the books you own</p>
            </div>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={startOver}
                className="cursor-pointer rounded-md px-2 py-1 text-xs font-semibold text-muted transition-colors hover:bg-border/60 hover:text-text focus-visible:outline-2 focus-visible:outline-primary"
              >
                New chat
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="flex size-8 cursor-pointer items-center justify-center rounded-md text-muted transition-colors duration-200 hover:bg-primary hover:text-on-primary focus-visible:bg-primary focus-visible:text-on-primary"
            >
              <CloseIcon size={18} />
            </button>
          </header>

          <div ref={scrollRef} className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {messages.length === 0 && (
              <div className="m-auto flex animate-fade flex-col items-center gap-4 text-center">
                <p className="max-w-64 text-sm text-muted">
                  Hi! I know every book in your library. Ask me for a summary, a recommendation, or anything else.
                </p>
                <div className="flex flex-col gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => send(suggestion)}
                      className="cursor-pointer rounded-full border border-border bg-bg/60 px-3 py-1.5 text-xs font-medium text-text transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) =>
              message.role === 'user' ? (
                <div key={message.id} className="max-w-[85%] animate-fade self-end rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm whitespace-pre-wrap text-on-primary">
                  {messageText(message)}
                </div>
              ) : (
                <div key={message.id} className="max-w-[90%] animate-fade self-start rounded-2xl rounded-bl-sm border border-border bg-bg/60 px-3.5 py-2 text-sm leading-relaxed">
                  <FormattedText text={messageText(message)} />
                </div>
              ),
            )}

            {status === 'submitted' && (
              <div className="animate-fade self-start rounded-2xl rounded-bl-sm border border-border bg-bg/60 px-3.5 py-2">
                <TypingDots />
              </div>
            )}

            {error && (
              <div role="alert" className="flex animate-fade items-center justify-between gap-3 self-stretch rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger">
                <span>Sorry, I couldn't answer that. Please try again.</span>
                <button
                  type="button"
                  onClick={() => void regenerate()}
                  className="shrink-0 cursor-pointer font-semibold underline-offset-2 hover:underline"
                >
                  Retry
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border p-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your books…"
              aria-label="Message"
              className="min-w-0 flex-1 rounded-full border border-border bg-bg/60 px-4 py-2 text-sm text-text focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
            />
            {isBusy ? (
              <button
                type="button"
                onClick={() => void stop()}
                aria-label="Stop"
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-text transition-colors hover:border-accent hover:text-accent"
              >
                <StopIcon size={14} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send"
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-on-primary shadow-sm shadow-primary/30 transition-all duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <SendIcon size={16} />
              </button>
            )}
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        aria-label={isOpen ? 'Close library assistant' : 'Open library assistant'}
        className="fixed right-4 bottom-6 z-40 flex size-14 cursor-pointer items-center justify-center rounded-full bg-primary text-on-primary shadow-lg shadow-primary/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:right-6"
      >
        <span key={String(isOpen)} className="animate-pop">
          {isOpen ? <CloseIcon size={24} /> : <ChatIcon size={24} />}
        </span>
      </button>
    </>
  )
}
