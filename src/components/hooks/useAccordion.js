import React, { useCallback, useEffect, useReducer, useRef } from 'react'
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

const layoutActionTypes = { map_items: 'map_items' }

function createButton(index, isOpen, toggleFn, text, yesEmoji, noEmoji) {
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
      <span>{isOpen ? yesEmoji : noEmoji}</span>
    </AccordionButton>
  )
}

function createContents(isOpen, contents) {
  return <AccordionContents isOpen={isOpen}>{contents}</AccordionContents>
}

function createEmptyItem(depth, index) {
  return <div key={`${depth}_empty_${index}`} style={{ display: 'none' }}></div>
}

function isVisible(item, items, expandedItems) {
  // Item has no parent so can't be occluded by that.
  if (!item.parent) return true

  // Item is visible if all it's ancestors are expanded.
  return (
    expandedItems.includes(item.parent) &&
    isVisible(items[item.parent], items, expandedItems)
  )
}

function dfltLayoutReducer(components, action) {
  switch (action.type) {
    case layoutActionTypes.map_items:
      return action.items.map((item, index) => {
        if (isVisible(item, action.items, action.expandedItems)) {
          return (
            <AccordionItem
              key={`${item.depth}_${item.title}_${index}`}
              direction="vertical"
              indent={item.depth}
            >
              {createButton(
                index,
                action.expandedItems.includes(index),
                action.toggleItem,
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
        }
        return createEmptyItem(item.depth, index)
      })
    default: {
      throw new Error(
        'Unhandled type in Accordion dfltLayoutReducer: ' + action.type
      )
    }
  }
}

// Taked nested item json and flatten it into a single-dimension array.
// augmented with a depth field and knowledge of one's parent index
// (for visibility calculation later on in layout reducer).
function flattenItemsReducer(nestedItems, depth = 0, acc = [], parent) {
  const flattenedItems = nestedItems.reduce((acc, item, index) => {
    const hasNestedItems = item.items
    if (hasNestedItems) {
      acc.push({
        title: item.title,
        contents: undefined,
        depth: depth,
        parent: parent
      })
      const newParent = acc.length - 1
      return flattenItemsReducer(item.items, depth + 1, acc, newParent)
    } else {
      acc.push({
        ...item,
        depth: depth,
        parent: parent
      })
    }
    return acc
  }, acc)
  return flattenedItems
}

const dfltInputItemsReducer = flattenItemsReducer

function useAccordion({
  layoutReducer = dfltLayoutReducer,
  inputItemsReducer = dfltInputItemsReducer,
  items = [],
  initialExpanded = []
} = {}) {
  const normalizedItems = useRef(inputItemsReducer(items))
  const { expandedItems, toggleItem } = useExpandable({
    initialState: initialExpanded
  })
  const memoizedToggleItem = useCallback(toggleItem, [])

  const memoizedLayoutReducer = useCallback(layoutReducer, [])
  const [components, dispatch] = useReducer(memoizedLayoutReducer, [])

  useEffect(() => {
    dispatch({
      type: layoutActionTypes.map_items,
      items: normalizedItems.current,
      toggleItem: memoizedToggleItem,
      expandedItems: expandedItems
    })
    return
  }, [normalizedItems, memoizedToggleItem, expandedItems])
  return { components }
}

export { useAccordion }
