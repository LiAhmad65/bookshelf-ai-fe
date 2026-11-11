import { GridIcon, ListIcon } from '@/components/ui/icons'

export type BookView = 'card' | 'list'

interface ViewToggleProps {
  view: BookView
  onChange: (view: BookView) => void
}

const options = [
  { value: 'card', label: 'Card view', Icon: GridIcon },
  { value: 'list', label: 'List view', Icon: ListIcon },
] as const

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-surface p-1 shadow-sm" role="group" aria-label="Layout">
      {options.map(({ value, label, Icon }) => {
        const active = view === value
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            aria-label={label}
            title={label}
            onClick={() => onChange(value)}
            className={`flex size-9 cursor-pointer items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary ${
              active ? 'bg-primary text-on-primary shadow-sm' : 'text-muted hover:bg-bg hover:text-text'
            }`}
          >
            <Icon size={18} />
          </button>
        )
      })}
    </div>
  )
}
