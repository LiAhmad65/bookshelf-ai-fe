import type { ChatTransport, UIMessage, UIMessageChunk } from 'ai'
import { aiApi } from '@/api/ai/aiApi'

/** Delay between words when replaying the reply, so it reads like it's being typed. */
const WORD_DELAY_MS = 35

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const messageText = (message: UIMessage) =>
  message.parts.map((part) => (part.type === 'text' ? part.text : '')).join('')

/**
 * Replays a complete reply as a UI message stream. The backend answers with plain JSON,
 * so this is what lets `useChat` render it word by word.
 */
function replyStream(reply: string): ReadableStream<UIMessageChunk> {
  const id = 'reply'
  const instant = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const words = instant ? [reply] : (reply.match(/\S+\s*/g) ?? [reply])
  let i = 0

  return new ReadableStream<UIMessageChunk>({
    start(controller) {
      controller.enqueue({ type: 'start' })
      controller.enqueue({ type: 'text-start', id })
    },
    async pull(controller) {
      if (i < words.length) {
        if (i > 0) await sleep(WORD_DELAY_MS)
        controller.enqueue({ type: 'text-delta', id, delta: words[i++] })
        return
      }
      controller.enqueue({ type: 'text-end', id })
      controller.enqueue({ type: 'finish' })
      controller.close()
    },
  })
}

/** `useChat` transport for `POST /ai/chat`, which answers the latest user question. */
export const libraryChatTransport: ChatTransport<UIMessage> = {
  async sendMessages({ messages, abortSignal }) {
    const lastUserMessage = messages.findLast((m) => m.role === 'user')
    const userQuery = lastUserMessage ? messageText(lastUserMessage).trim() : ''
    const { reply } = await aiApi.chat({ userQuery }, abortSignal)
    return replyStream(reply)
  },
  // Replies aren't stored server-side, so there's never a stream to resume.
  reconnectToStream: async () => null,
}
