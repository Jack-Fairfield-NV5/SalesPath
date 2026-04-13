/* eslint-disable react-refresh/only-export-components -- compound SalesPath.Step */
import {
  Children,
  isValidElement,
  useMemo,
  useState,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react'
import './SalesPath.css'

export type SalesPathStepProps = {
  label: string
  completed?: boolean
  disabled?: boolean
}

function SalesPathStep(props: SalesPathStepProps): null {
  void props
  return null
}

SalesPathStep.displayName = 'SalesPath.Step'

export type SalesPathProps = {
  children: ReactNode
  activeIndex?: number
  defaultActiveIndex?: number
  onActiveIndexChange?: (index: number) => void
  onStepClick?: (index: number, event: MouseEvent<HTMLButtonElement>) => void
  className?: string
}

function isStepElement(
  child: unknown,
  Step: typeof SalesPathStep,
): child is ReactElement<SalesPathStepProps> {
  return isValidElement(child) && child.type === Step
}

function CheckIcon() {
  return (
    <svg
      className="sales-path__check-icon"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-hidden
    >
      <path
        d="M4 9.2 7.2 12.4 14 5.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SalesPathRoot({
  children,
  activeIndex: activeIndexProp,
  defaultActiveIndex = 0,
  onActiveIndexChange,
  onStepClick,
  className,
}: SalesPathProps) {
  const isControlled = activeIndexProp !== undefined
  const [internalIndex, setInternalIndex] = useState(defaultActiveIndex)
  const resolvedActive = isControlled ? activeIndexProp : internalIndex

  const steps = useMemo(() => {
    return Children.toArray(children).filter((c) =>
      isStepElement(c, SalesPathStep),
    ) as ReactElement<SalesPathStepProps>[]
  }, [children])

  const rootClass = ['sales-path', className].filter(Boolean).join(' ')

  return (
    <div className={rootClass} role="list">
      {steps.map((step, index) => {
        const { label, completed: completedProp, disabled } = step.props
        const isLast = index === steps.length - 1
        const isFirst = index === 0

        const isCompleted =
          completedProp === false
            ? false
            : completedProp === true
              ? true
              : index < resolvedActive

        const isActive = index === resolvedActive

        const pos = isFirst ? 'first' : isLast ? 'last' : 'mid'

        const stepClasses = [
          'sales-path__step',
          `sales-path__step--${pos}`,
          isActive && 'sales-path__step--active',
          isCompleted && 'sales-path__step--completed',
          !isCompleted && !isActive && 'sales-path__step--upcoming',
          disabled && 'sales-path__step--disabled',
        ]
          .filter(Boolean)
          .join(' ')

        const ariaLabel =
          isCompleted && !isActive
            ? `${label}, completed`
            : isActive
              ? `${label}, current step`
              : label

        const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
          onStepClick?.(index, event)
          if (disabled) return
          if (!isControlled) {
            setInternalIndex(index)
          }
          onActiveIndexChange?.(index)
        }

        return (
          <button
            key={index}
            type="button"
            role="listitem"
            className={stepClasses}
            disabled={disabled}
            aria-disabled={disabled || undefined}
            aria-current={isActive ? 'step' : undefined}
            aria-label={ariaLabel}
            onClick={handleClick}
          >
            <span className="sales-path__shape" aria-hidden />
            <span className="sales-path__body">
              {isCompleted && !isActive ? (
                <span className="sales-path__swap">
                  <span className="sales-path__check" aria-hidden>
                    <CheckIcon />
                  </span>
                  <span className="sales-path__label sales-path__label--hover">
                    {label}
                  </span>
                </span>
              ) : (
                <span className="sales-path__label">{label}</span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export const SalesPath = Object.assign(SalesPathRoot, { Step: SalesPathStep })
