import React, { useCallback, useEffect, useReducer, useRef } from 'react'
import posed from 'react-pose'
import styled from '@emotion/styled'
import {
  useExpandable,
  multiExpandedReducer as dfltExpansionReducer
} from './useExpandable'

const AccordionButton = styled('button')(
  {
    textAlign: 'left',
    minWidth: 80,
    cursor: 'pointer',
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    paddingRight: 0,
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
    gridAutoFlow: props.direction === 'horizontal' ? 'column' : 'row',
    paddingLeft: `${props.indent * 2}em`
  })
)

export const layoutActionTypes = { map_items: 'map_items' }

function createButton(
  index,
  isOpen = false,
  toggleFn,
  text,
  expandedEmoji,
  collapsedEmoji
) {
  return (
    <AccordionButton isOpen={isOpen} onClick={() => toggleFn(index)}>
      <div
        style={{
          display: 'inline-block',
          minWidth: '25px',
          textAlign: 'center'
        }}
      >
        {text}
      </div>{' '}
      <span>{isOpen ? expandedEmoji : collapsedEmoji}</span>
    </AccordionButton>
  )
}

function createContents(isOpen = false, contents) {
  return <AccordionContents isOpen={isOpen}>{contents}</AccordionContents>
}

function verticalBelowLayoutReducer(components, action) {
  console.log('layout reducer:', action.toggleItemFn)
  switch (action.type) {
    case layoutActionTypes.map_items:
      return action.items.map((item, index) => {
        return (
          <AccordionItem
            key={`${item.depth}_${item.title}_${index}`}
            direction="vertical"
            indent={item.depth}
          >
            {createButton(
              index,
              action.expandedItems.includes(index),
              action.toggleItemFn,
              item.title,
              '👇',
              '👈'
            )}
            {createContents(
              action.expandedItems.includes(index),
              item.contents
            )}
          </AccordionItem>
        )
      })
    default: {
      throw new Error(
        'Unhandled type in useAccordion verticalBelowLayoutReducer: ' +
          action.type
      )
    }
  }
}

const dfltInputItemsReducer = (items) => {
  return items
}
const dfltLayoutReducer = verticalBelowLayoutReducer

function useAccordion({
  inputItemsReducer = dfltInputItemsReducer,
  layoutReducer = dfltLayoutReducer,
  expansionReducer = dfltExpansionReducer,
  items = [],
  initialExpanded = []
} = {}) {
  const normalizedItems = useRef(inputItemsReducer(items))
  const { expandedItems, toggleItemFn } = useExpandable({
    initialState: initialExpanded,
    reducer: expansionReducer,
    items: normalizedItems.current
  })
  const memoizedToggleItem = useCallback(toggleItemFn, [])

  const memoizedLayoutReducer = useCallback(layoutReducer, [])
  const [components, dispatch] = useReducer(memoizedLayoutReducer, [])

  useEffect(() => {
    dispatch({
      type: layoutActionTypes.map_items,
      items: normalizedItems.current,
      toggleItemFn: memoizedToggleItem,
      expandedItems: expandedItems || []
    })
    return
  }, [normalizedItems, memoizedToggleItem, expandedItems])
  return { components }
}

export { useAccordion }
