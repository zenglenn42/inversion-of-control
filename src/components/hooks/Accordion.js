import React from 'react'
import { useAccordion } from './useAccordion'

function Accordion({ items, ...props }) {
  const { components } = useAccordion({ items })
  return <div>{components}</div>
}

export { Accordion }
