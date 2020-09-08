import React, { useCallback, useEffect, useReducer, useRef } from 'react'
import { motion } from 'framer-motion'
import styled from '@emotion/styled'
import {
  useExpandable,
  permissiveReducer as dfltExpansionReducer
} from './useExpandable'

const MotionAccordionContents = (props) => {
  const { isOpen, ...other } = props
  const variants = {
    open: { maxHeight: 200 },
    closed: { maxHeight: 0 }
  }

  return (
    <motion.div
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
      transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
      variants={variants}
      {...other}
    />
  )
}

function AccordionContents(props) {
  return (
    <MotionAccordionContents
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
    '&:hover': {
      outline: '1px solid #ccc'
    }
  },
  ({ isOpen }) =>
    isOpen
      ? {
          backgroundColor: '#ddd'
        }
      : null
)

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
  switch (action.type) {
    case layoutActionTypes.map_items:
      return action.allItems.map((item, index) => {
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
  initialExpandedItems = [],
  initialFocalIndex = undefined
} = {}) {
  const normalizedItems = useRef(inputItemsReducer(items))
  const initialState = {
    expandedItems: initialExpandedItems,
    focalIndex: initialFocalIndex
  }
  const { expandedItems, focalIndex, toggleItemFn } = useExpandable({
    initialState,
    reducer: expansionReducer,
    items: normalizedItems.current
  })
  const memoizedToggleItem = useCallback(toggleItemFn, [])

  const memoizedLayoutReducer = useCallback(layoutReducer, [])
  const [components, dispatch] = useReducer(memoizedLayoutReducer, [])

  useEffect(() => {
    dispatch({
      type: layoutActionTypes.map_items,
      toggleItemFn: memoizedToggleItem,
      expandedItems: expandedItems || [],
      focalIndex: focalIndex,
      allItems: normalizedItems.current
    })
    return
  }, [normalizedItems, memoizedToggleItem, expandedItems, focalIndex])
  return { components }
}

export { useAccordion }
