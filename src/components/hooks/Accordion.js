import React from 'react'
import { useAccordion } from './useAccordion'

function Accordion({
  items,
  behaviorReducer = () => {},
  layoutReducer = () => {},
  ...props
}) {
  const { getComponents } = useAccordion({ items })
  // const { renderAccordion } = useAccordion(items)
  // const components = renderAccordion()
  // console.log('Accordion: ', components)
  const components = getComponents()
  // console.log('Accordion components:', components)

  return <div>{components}</div>
}

export { Accordion }
