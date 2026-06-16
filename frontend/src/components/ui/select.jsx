import * as React from 'react'

import { cn } from '@/lib/utils'

const SelectContext = React.createContext(null)

function Select({ value, onValueChange, className, children, ...props }) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const handlePointerDown = (event) => {
      if (!event.target.closest('[data-select-root="true"]')) {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div data-select-root="true" className={cn('relative', className)} {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

function SelectTrigger({ className, children, ...props }) {
  const context = React.useContext(SelectContext)

  return (
    <button
      type="button"
      aria-haspopup="listbox"
      aria-expanded={context?.open}
      onClick={() => context?.setOpen((open) => !open)}
      className={cn(
        'flex min-h-[4.5rem] w-full items-center justify-between border-b-2 border-border bg-transparent pb-4 text-left text-2xl text-foreground outline-none transition-colors hover:border-ring focus:border-ring md:text-4xl',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function SelectValue({ placeholder }) {
  const context = React.useContext(SelectContext)
  return <span className={cn(!context?.value && 'text-muted-foreground/50')}>{context?.value || placeholder}</span>
}

function SelectContent({ className, children, ...props }) {
  const context = React.useContext(SelectContext)

  if (!context?.open) return null

  return (
    <div
      role="listbox"
      className={cn(
        'absolute z-50 mt-4 w-full overflow-hidden rounded-3xl border border-border bg-popover/80 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md text-popover-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function SelectItem({ value, className, children, ...props }) {
  const context = React.useContext(SelectContext)

  return (
    <button
      type="button"
      role="option"
      aria-selected={context?.value === value}
      onClick={() => {
        context?.onValueChange?.(value)
        context?.setOpen(false)
      }}
      className={cn(
        'flex w-full items-center rounded-2xl px-4 py-4 text-left text-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:text-xl',
        context?.value === value && 'bg-muted text-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }