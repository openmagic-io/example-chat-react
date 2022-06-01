import { Switch } from '@headlessui/react'
import { classNames, truncate } from '../helpers'

type ToggleProps = {
  enabled: boolean
  toggleEnabled: () => void
  label: string
  subtext: string
}

export default function Toggle({
  enabled,
  toggleEnabled,
  label,
  subtext,
}: ToggleProps) {
  return (
    <Switch.Group as="div" className="flex items-center justify-between my-4">
      <span className="flex flex-col flex-grow">
        <Switch.Label
          as="span"
          className="font-medium text-gray-900 text-md"
          passive
        >
          {label ? (
            truncate(label, 30)
          ) : (
            <span className="text-gray-500">No Name</span>
          )}
        </Switch.Label>
        <Switch.Description as="p" className="text-sm text-gray-500 ">
          {truncate(subtext, 36)}
        </Switch.Description>
      </span>
      <Switch
        checked={enabled}
        onChange={toggleEnabled}
        className={classNames(
          enabled ? 'bg-indigo-600' : 'bg-gray-200',
          'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
          )}
        />
      </Switch>
    </Switch.Group>
  )
}
