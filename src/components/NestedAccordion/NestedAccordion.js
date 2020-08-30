import React from 'react'
import posed from 'react-pose'
import styled from '@emotion/styled'
import { layoutActionTypes } from '../Accordion/useAccordion'
import { actionTypes as expandableActionTypes } from '../Accordion/useExpandable'
import { ReactComponent as DropdownIcon } from '../../api/Dropdown2.svg'
import { ReactComponent as ArrowupIcon } from '../../api/ArrowUp.svg'

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

const PoseAccordionContents = posed.div({
  open: { maxHeight: 200 },
  closed: { maxHeight: 0 }
})

function AccordionContents({ isOpen, ...props }) {
  return (
    <PoseAccordionContents
      pose={isOpen ? 'open' : 'closed'}
      style={{
        overflowY: 'hidden',
        textAlign: 'justify',
        marginBottom: '0.5em'
      }}
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
    // paddingTop: 10,
    // paddingBottom: 10,
    // paddingLeft: 0,
    // paddingRight: 0,
    padding: 0,
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

function createButton(
  index,
  isOpen = false,
  toggleFn,
  icon,
  text,
  expandedEmoji,
  collapsedEmoji
) {
  console.log('createButton: icon = ', icon)
  return (
    <AccordionButton isOpen={isOpen} onClick={() => toggleFn(index)}>
      <div
        style={{
          display: 'inline-flex',
          width: '100%',
          padding: '0.125em 0',
          borderRadius: '0.125em',
          border: '1px solid rgba(0, 0, 128, 0.1)'
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
          <span>{text}</span>
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

function isVisible(item, items, expandedItems = []) {
  // Item has no parent so can't be occluded by that.
  if (!item.parent) return true

  // Item has a parent but expandedItems is undefined.
  if (item.parent && expandedItems === undefined) return false

  // Item is visible if all it's ancestors are expanded.
  return (
    expandedItems.includes(item.parent) &&
    isVisible(items[item.parent], items, expandedItems)
  )
}

function nestedLayoutReducer(components, action) {
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

function singlePeerExpandedReducer(expandedItems = [], action) {
  function isaParent(item) {
    return item.contents === undefined
  }
  function removePeersOf(index, array, items) {
    const depth = items[index].depth
    return array.filter(
      (i) =>
        items[i].depth !== depth ||
        // don't remove peers that are parents of sub-accordions
        (items[i].depth === depth &&
          (isaParent(items[i]) || isaParent(items[index])))
    )
  }
  if (action.type === expandableActionTypes.toggle_index) {
    return expandedItems.includes(action.index)
      ? // closeIt
        expandedItems.length > 1
        ? expandedItems.filter((i) => i !== action.index)
        : undefined // allow combineReducers to chain reducers
      : // openIt
        [
          ...removePeersOf(action.index, expandedItems, action.items),
          action.index
        ]
  }
}

export { nestedItemsClosure, nestedLayoutReducer, singlePeerExpandedReducer }
