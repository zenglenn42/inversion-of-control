import React, { useCallback, useEffect, useReducer } from 'react'
import posed from 'react-pose'
import styled from '@emotion/styled'
import { useExpandable } from './useExpandable'

const AccordionButton = styled('button')(
  {
    textAlign: 'left',
    minWidth: 80,
    cursor: 'pointer',
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 20,
    border: 'none',
    backgroundColor: 'unset',
    ':focus': {
      outline: 'none',
      backgroundColor: 'rgba(255, 255, 255, 0.4)'
    }
  },
  ({ isOpen }) =>
    isOpen
      ? {
          backgroundColor: 'rgba(255, 255, 255, 0.2)'
        }
      : null
)

const PoseAccordionContents = posed.div({
  open: { maxHeight: 200 },
  closed: { maxHeight: 0 }
})

function AccordionContents({ isOpen, ...props }) {
  return (
    <PoseAccordionContents
      pose={isOpen ? 'open' : 'closed'}
      style={{ overflowY: 'hidden', textAlign: 'justify' }}
      {...props}
    />
  )
}

const AccordionItem = styled('div')(
  {
    display: 'grid',
    gridTemplate: 'auto auto',
    gridGap: 4,
    gridAutoFlow: 'row'
  },
  (props) => ({
    gridAutoFlow: props.direction === 'horizontal' ? 'column' : 'row'
  })
)

const layoutActionTypes = { map_items: 'map_items' }

function dfltLayoutReducer(components, action) {
  switch (action.type) {
    case layoutActionTypes.map_items:
      // console.log('dfltLayoutReducer action:', action)
      return action.items.map((item, index) => (
        <AccordionItem key={`${item.depth}_${item.title}`} direction="vertical">
          <AccordionButton
            isOpen={action.expandedItems.includes(index)}
            onClick={() => action.toggleItem(index)}
          >
            {item.title}{' '}
            <span>{action.expandedItems.includes(index) ? '👇' : '👈'}</span>
          </AccordionButton>
          <AccordionContents isOpen={action.expandedItems.includes(index)}>
            {item.contents}
          </AccordionContents>
        </AccordionItem>
      ))
    default: {
      throw new Error(
        'Unhandled type in Accordion dfltLayoutReducer: ' + action.type
      )
    }
  }
}

function useAccordion({
  layoutReducer = dfltLayoutReducer,
  items = [],
  initialExpanded = []
} = {}) {
  const { expandedItems, toggleItem } = useExpandable(items, initialExpanded)
  const memoizedToggleItem = useCallback(toggleItem, [])

  const memoizedLayoutReducer = useCallback(layoutReducer, [])
  const [components, dispatch] = useReducer(memoizedLayoutReducer, [])

  useEffect(() => {
    dispatch({
      type: layoutActionTypes.map_items,
      items: items,
      toggleItem: memoizedToggleItem,
      expandedItems: expandedItems
    })
    return
  }, [items, memoizedToggleItem, expandedItems])
  return { components }
}

export { useAccordion }
