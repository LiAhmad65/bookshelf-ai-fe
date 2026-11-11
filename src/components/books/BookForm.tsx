import { useEffect, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { SparklesIcon } from '@/components/ui/icons'
import { generateBookDescription } from '@/services/aiService'
import type { AddBookPayload } from '@/types/book'
import { getErrorMessage } from '@/utils/getErrorMessage'

interface BookFormProps {
  initialValues?: AddBookPayload
  submitLabel: string
  /** Show the "Generate with AI" action next to the Description label. */
  aiDescription?: boolean
  /** Throw to surface an error message inside the form. */
  onSubmit: (values: AddBookPayload) => Promise<void>
}

const empty: AddBookPayload = { name: '', author: '', description: '' }

/** Per-character typing delay for AI text, scaled so the whole description takes about TYPE_TARGET_MS. */
const TYPE_TARGET_MS = 4500
const TYPE_MIN_CHAR_MS = 14
const TYPE_MAX_CHAR_MS = 40
/** Extra beat after punctuation so the typing reads like someone writing. */
const SENTENCE_PAUSE_MS = 220
const COMMA_PAUSE_MS = 90
const CARET = '▍'
/** How long the textarea stays highlighted after a description is generated. */
const HIGHLIGHT_MS = 2500

function GeneratingOverlay() {
  return (
    <div
      role="status"
      className="absolute inset-0 flex animate-fade flex-col justify-center gap-2.5 overflow-hidden rounded-lg bg-surface/90 px-3 py-2.5"
    >
      <span className="flex items-center gap-1.5 text-xs font-semibold text-accent">
        <SparklesIcon size={14} className="animate-twinkle" />
        Writing a description…
      </span>
      {['w-full', 'w-11/12', 'w-2/3'].map((width) => (
        <span key={width} className={`ai-shimmer block h-2 animate-shimmer rounded-full ${width}`} aria-hidden="true" />
      ))}
    </div>
  )
}

export function BookForm({ initialValues = empty, submitLabel, aiDescription = false, onSubmit }: BookFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [aiPhase, setAiPhase] = useState<'idle' | 'generating' | 'typing' | 'done'>('idle')
  const [aiError, setAiError] = useState<string | null>(null)
  // Bumped on unmount or a new generation so stale requests/animations stop touching the form.
  const runRef = useRef(0)
  const timerRef = useRef<number | undefined>(undefined)
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null)
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddBookPayload>({ defaultValues: initialValues })

  useEffect(
    () => () => {
      runRef.current++
      window.clearTimeout(timerRef.current)
    },
    [],
  )

  const hasName = useWatch({ control, name: 'name' }).trim() !== ''

  const isAiBusy = aiPhase === 'generating' || aiPhase === 'typing'

  const finishTyping = (run: number) => {
    setAiPhase('done')
    timerRef.current = window.setTimeout(() => runRef.current === run && setAiPhase('idle'), HIGHLIGHT_MS)
  }

  const typeInDescription = (text: string, run: number) => {
    const show = (value: string) => {
      setValue('description', value, { shouldDirty: true })
      const el = descriptionRef.current
      if (el) el.scrollTop = el.scrollHeight
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      show(text)
      return finishTyping(run)
    }

    setAiPhase('typing')
    const charMs = Math.min(Math.max(TYPE_TARGET_MS / text.length, TYPE_MIN_CHAR_MS), TYPE_MAX_CHAR_MS)
    let i = 0
    const step = () => {
      if (runRef.current !== run) return
      i++
      if (i >= text.length) {
        show(text)
        return finishTyping(run)
      }
      show(text.slice(0, i) + CARET)
      const pause = /[.!?]/.test(text[i - 1]) ? SENTENCE_PAUSE_MS : text[i - 1] === ',' ? COMMA_PAUSE_MS : 0
      timerRef.current = window.setTimeout(step, charMs + pause)
    }
    step()
  }

  const generate = async () => {
    const run = ++runRef.current
    const name = getValues('name').trim()
    const author = getValues('author').trim()
    window.clearTimeout(timerRef.current)
    setAiError(null)
    setAiPhase('generating')
    try {
      const result = await generateBookDescription(name, author || undefined)
      if (runRef.current !== run) return
      if (!result?.description) throw new Error('No description was generated. Try again.')
      if (!author && result.author) setValue('author', result.author, { shouldDirty: true, shouldValidate: true })
      typeInDescription(result.description.trim(), run)
    } catch (err) {
      if (runRef.current !== run) return
      setAiError(getErrorMessage(err, 'Could not generate a description'))
      setAiPhase('idle')
    }
  }

  const submit = handleSubmit(async ({ name, author, description }) => {
    setServerError(null)
    try {
      await onSubmit({ name: name.trim(), author: author.trim(), description: description.trim() })
    } catch (err) {
      setServerError(getErrorMessage(err, 'Something went wrong'))
    }
  })

  const generateButton = aiDescription && (
    <button
      type="button"
      onClick={generate}
      disabled={isAiBusy || !hasName}
      aria-busy={isAiBusy}
      title={hasName ? 'Write a description from the book name and author' : 'Enter a name first'}
      className="group inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-border disabled:hover:text-muted disabled:hover:shadow-none"
    >
      <SparklesIcon
        size={14}
        className={isAiBusy ? 'animate-twinkle text-accent' : 'text-accent transition-transform duration-300 group-hover:rotate-12'}
      />
      {aiPhase === 'generating' ? 'Generating…' : aiPhase === 'typing' ? 'Writing…' : 'Generate with AI'}
    </button>
  )

  const descriptionField = register('description')

  return (
    <form className="flex flex-col gap-4" onSubmit={submit} noValidate>
      <Input
        label="Name"
        required
        error={errors.name?.message}
        {...register('name', { validate: (v) => v.trim() !== '' || 'Name is required' })}
      />
      <Input
        label="Author"
        required
        error={errors.author?.message}
        {...register('author', { validate: (v) => v.trim() !== '' || 'Author is required' })}
      />
      <div className="flex flex-col gap-1.5">
        <Textarea
          label="Description"
          labelAction={generateButton}
          readOnly={isAiBusy}
          aria-busy={isAiBusy}
          highlighted={aiPhase !== 'idle'}
          overlay={aiPhase === 'generating' && <GeneratingOverlay />}
          {...descriptionField}
          ref={(el) => {
            descriptionField.ref(el)
            descriptionRef.current = el
          }}
        />
        {aiError && <p role="alert" className="text-xs text-danger">{aiError}</p>}
        {aiPhase === 'typing' && (
          <p className="flex animate-fade items-center gap-1 text-xs font-medium text-accent">
            <SparklesIcon size={12} className="animate-twinkle" />
            AI is writing the description…
          </p>
        )}
        {aiPhase === 'done' && (
          <p role="status" className="flex animate-fade items-center gap-1 text-xs font-medium text-accent">
            <SparklesIcon size={12} />
            Description generated. Feel free to edit it.
          </p>
        )}
      </div>
      {serverError && <p role="alert" className="text-sm text-danger">{serverError}</p>}
      <Button type="submit" loading={isSubmitting} disabled={isAiBusy}>{submitLabel}</Button>
    </form>
  )
}
