import React from 'react'
import { motion } from 'framer-motion'
import styled from '@emotion/styled'
import { layoutActionTypes } from '../Accordion/useAccordion'
import { actionTypes as expandableActionTypes } from '../Accordion/useExpandable'
import { ReactComponent as DropdownIcon } from '../../api/svg/Dropdown2.svg'
import { ReactComponent as ArrowupIcon } from '../../api/svg/ArrowUp.svg'

// The following adds nested behavior to a basic Accordion component using
// inversion-of-control principle.

// ----------------------------------------------------------------------------
// Input reduction
// ----------------------------------------------------------------------------

// Take nested item json and flatten it into a single-dimension array.
// augmented with a depth field and knowledge of one's parent index
// (for visibility calculation later on in layout reducer).

function nestedItemsClosure(overrides = {}) {
  const itemOverrides = overrides
  return function nestedItemsReducer(nestedItems, depth = 0, acc = [], parent) {
    const flattenedItems = nestedItems.reduce((acc, item, index) => {
      const hasNestedItems = item.items
      const tagOverrides = itemOverrides.tag ? itemOverrides.tag[item.tag] : {}
      if (hasNestedItems) {
        acc.push({
          icon: item.icon,
          title: item.title,
          ...tagOverrides,
          contents: undefined,
          depth: depth,
          parent: parent
        })
        const newParent = acc.length - 1
        return nestedItemsReducer(item.items, depth + 1, acc, newParent)
      } else {
        acc.push({
          ...item,
          ...tagOverrides,
          depth: depth,
          parent: parent
        })
      }
      return acc
    }, acc)
    return flattenedItems
  }
}

// ----------------------------------------------------------------------------
// Layout
// ----------------------------------------------------------------------------

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
      variants={variants}
      transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
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
    gridGap: 2,
    gridAutoFlow: 'row'
  },
  (props) => ({
    gridAutoFlow: props.direction === 'horizontal' ? 'column' : 'row',
    paddingLeft: `${props.indent * 2}em`
  })
)

function createContents(isOpen = false, contents) {
  return <AccordionContents isOpen={isOpen}>{contents}</AccordionContents>
}

const AccordionButton = styled('button')(
  {
    textAlign: 'left',
    minWidth: 80,
    cursor: 'pointer',
    flex: 1,
    padding: 0,
    fontSize: 20,
    border: 'none',
    backgroundColor: 'unset'
    // Feels a bit annoying, actually.
    //
    // '&:hover': {
    //   borderLeft: '1px solid #ddd'
    // }
  }
  // ,
  // ({ isOpen }) =>
  //   isOpen
  //     ? {
  //         backgroundColor: '#ddd'
  //       }
  //     : null
)

function createButton(
  index,
  focalIndex,
  isOpen = false,
  toggleFn,
  icon,
  text,
  expandedEmoji,
  collapsedEmoji
) {
  return (
    <AccordionButton isOpen={isOpen} onClick={() => toggleFn(index)}>
      <div
        style={{
          display: 'inline-flex',
          width: '100%',
          padding: '0.125em 0',
          borderRadius: '0.125em',
          backgroundColor: index === focalIndex ? '#ddd' : 'inherit'
        }}
      >
        <span
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {icon ? <span style={{ marginRight: '1em' }}>{icon}</span> : <></>}
          <span
          // style={{
          //   fontWeight: isOpen ? 'bold' : null
          // }}
          >
            {text}
          </span>
        </span>
        <div style={{ flex: '1' }} />
        <span>{isOpen ? expandedEmoji : collapsedEmoji}</span>
      </div>{' '}
    </AccordionButton>
  )
}

function createEmptyItem(depth, index) {
  return <div key={`${depth}_empty_${index}`} style={{ display: 'none' }}></div>
}

function isVisible(item, expandedItems = [], allItems) {
  // Item has no parent so can't be occluded by that.
  if (!item.parent) return true

  // Item has a parent but expandedItems is undefined.
  if (item.parent && expandedItems === undefined) return false

  // Item is visible if all its parents are expanded.
  const parentItem = allItems[item.parent]
  return (
    expandedItems.includes(item.parent) &&
    isVisible(parentItem, expandedItems, allItems)
  )
}

function nestedLayoutReducer(components, action) {
  switch (action.type) {
    case layoutActionTypes.map_items:
      return action.allItems.map((item, index) => {
        if (isVisible(item, action.expandedItems, action.allItems)) {
          return (
            <AccordionItem
              key={`${item.depth}_${item.title}_${index}`}
              direction="vertical"
              indent={item.depth}
            >
              {createButton(
                index,
                action.focalIndex,
                action.expandedItems.includes(index),
                action.toggleItemFn,
                item.icon,
                item.title,
                <ArrowupIcon width="100%" height="2em" />,
                <DropdownIcon width="100%" height="2em" />
                // '👇',
                // '👈'
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
      throw new Error('Unhandled type in nestedLayoutReducer: ' + action.type)
    }
  }
}

// ----------------------------------------------------------------------------
// Expansion behavior
// ----------------------------------------------------------------------------

// Allow only one peer item at a given nested depth to be visible.

function singlePeerExpandedReducer(state, action) {
  const { expandedItems = [], focalIndex } = state

  function isaParent(item) {
    return item.contents === undefined
  }

  function parentOf(itemIndex, allItems) {
    if (itemIndex <= 0) return undefined

    const itemDepth = allItems[itemIndex].depth
    let pIndex = itemIndex - 1
    while (pIndex >= 0) {
      const pDepth = allItems[pIndex].depth
      if (isaParent(allItems[pIndex]) && pDepth === itemDepth - 1) {
        return pIndex
      }
      pIndex = pIndex - 1
    }
    return undefined
  }

  function removeExpandedPeersOf(itemIndex, expandedItems, allItems) {
    if (isaParent(allItems[itemIndex])) return expandedItems

    const depth = allItems[itemIndex].depth
    const parent = parentOf(itemIndex, allItems)

    return expandedItems.filter((i) => {
      const iDepth = allItems[i].depth
      // things at different levels are not peers by definition, so keep
      if (iDepth !== depth) return true

      // if item is a parent, then keep
      if (isaParent(allItems[i])) return true

      // if item has same parent, then it is a peer by definition, so remove
      const iParent = parentOf(i, allItems)
      if (iParent === parent) return false

      return true
    })
  }

  if (action.type === expandableActionTypes.toggle_index) {
    let nextExpandedItems = []
    let nextFocalIndex = focalIndex
    const closeIt = expandedItems.includes(action.index)
    if (closeIt) {
      if (!isaParent(action.allItems[action.index])) {
        // leaf node, so update focal index
        nextFocalIndex = focalIndex === action.index ? undefined : focalIndex
      }
      if (expandedItems.length > 1) {
        nextExpandedItems = expandedItems.filter((i) => i !== action.index)
      }
    } else {
      // openIt
      nextFocalIndex = isaParent(action.allItems[action.index])
        ? focalIndex
        : action.index
      nextExpandedItems = [
        ...removeExpandedPeersOf(action.index, expandedItems, action.allItems),
        action.index
      ]
    }
    return { expandedItems: nextExpandedItems, focalIndex: nextFocalIndex }
  }
}

export { nestedItemsClosure, nestedLayoutReducer, singlePeerExpandedReducer }
