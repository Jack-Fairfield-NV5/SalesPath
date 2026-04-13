import { useState } from 'react'
import { SalesPath } from './components/SalesPath/SalesPath'

const DEMO_LABELS = [
  'New',
  'Working',
  'Unqualified',
  'Nurturing',
  'Closed',
] as const

function demoSteps(disabledIndex?: number) {
  return DEMO_LABELS.map((label, i) => (
    <SalesPath.Step
      key={label}
      label={label}
      disabled={disabledIndex === i || undefined}
    />
  ))
}

export default function App() {
  const [controlled, setControlled] = useState(2)

  return (
    <main className="app">
      <h1 className="app__title">Sales path</h1>
      <p className="app__lede">
        Uncontrolled example (click steps). Completed steps show a check; hover
        or keyboard focus reveals the label.
      </p>
      <div className="app__panel">
        <SalesPath defaultActiveIndex={2}>{demoSteps()}</SalesPath>
      </div>

      <p className="app__lede app__lede--spaced">
        Controlled example: <code>activeIndex={controlled}</code>
      </p>
      <div className="app__panel">
        <SalesPath
          activeIndex={controlled}
          onActiveIndexChange={setControlled}
        >
          {demoSteps(3)}
        </SalesPath>
      </div>
    </main>
  )
}
