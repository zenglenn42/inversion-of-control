import React from 'react'
import { useAccordion } from './useAccordion'

function Accordion(props) {
  const { items, ...optional } = props
  const { components } = useAccordion({ items, ...optional })
  return <div>{components}</div>
}

export { Accordion }
