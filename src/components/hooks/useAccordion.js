import React from 'react'
import posed from 'react-pose'
import styled from '@emotion/styled'

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
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
  },
  ({ isOpen }) =>
    isOpen
      ? {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        }
      : null,
)

const PoseAccordionContents = posed.div({
  open: { maxHeight: 200 },
  closed: { maxHeight: 0 },
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
    gridAutoFlow: 'row',
  },
  (props) => ({
    gridAutoFlow: props.direction === 'horizontal' ? 'column' : 'row',
  }),
)

const behaviorActionTypes = { toggle_index: 'toggle_index' }

function defaultBehaviorReducer(openedItems, action) {
  switch (action.type) {
    case behaviorActionTypes.toggle_index: {
      const closing = openedItems.includes(action.index)
      const nextOpenIndices = closing
        ? openedItems.filter((i) => i !== action.index)
        : [...openedItems, action.index]
      return nextOpenIndices
    }
    default: {
      throw new Error(
        'Unhandled type in Accordion defaultBehaviorReducer: ' + action.type,
      )
    }
  }
}

function combineReducers(...reducers) {
  return (state, action) => {
    for (const reducer of reducers) {
      const result = reducer(state, action)
      if (result) return result
    }
  }
}

function preventCloseReducer(openedItems, action) {
  if (action.type === behaviorActionTypes.toggle_index) {
    const closing = openedItems.includes(action.index)
    const isLast = openedItems.length < 2
    if (closing && isLast) {
      return openedItems
    }
  }
}

function singleReducer(openedItems, action) {
  if (action.type === behaviorActionTypes.toggle_index) {
    const closing = openedItems.includes(action.index)
    if (!closing) {
      return [action.index]
    }
  }
}

const layoutActionTypes = { map_items: 'map_items' }

function defaultLayoutReducer(components, action) {
  switch (action.type) {
    case layoutActionTypes.map_items:
      // console.log('defaultLayoutReducer action:', action)
      console.log('typeof action.toggle:', action.toggle)
      return action.items.map((item, index) => (
        <AccordionItem key={item.title} direction="vertical">
          <AccordionButton
            isOpen={action.openedItems.includes(index)}
            onClick={() => action.toggle(index)}
          >
            {item.title}{' '}
            <span>{action.openedItems.includes(index) ? '👇' : '👈'}</span>
          </AccordionButton>
          <AccordionContents isOpen={action.openedItems.includes(index)}>
            {item.contents}
          </AccordionContents>
        </AccordionItem>
      ))
    default: {
      throw new Error(
        'Unhandled type in Accordion defaultLayoutReducer: ' + action.type,
      )
    }
  }
}

function useAccordion({
  behaviorReducer = defaultBehaviorReducer,
  layoutReducer = defaultLayoutReducer,
  items = [],
} = {}) {
  const inputItems = React.useRef(items)
  const memoizedBehaviorReducer = React.useCallback(behaviorReducer, [])
  const initialOpenedItems = []
  const [openedItems, mutateOpenedItems] = React.useReducer(
    memoizedBehaviorReducer,
    initialOpenedItems,
  )
  const toggleIndex = (index) => {
    mutateOpenedItems({
      type: behaviorActionTypes.toggle_index,
      index: index,
    })
  }

  const memoizedLayoutReducer = React.useCallback(layoutReducer, [])
  const [components, mutateComponents] = React.useReducer(
    memoizedLayoutReducer,
    [],
  )

  const getComponents = () => {
    if (components.length === 0) {
      mutateComponents({
        type: layoutActionTypes.map_items,
        items: inputItems.current,
        toggle: toggleIndex,
        openedItems: openedItems,
      })
    }
    return components
  }

  return { getComponents }
}

export {
  useAccordion,
  defaultBehaviorReducer,
  preventCloseReducer,
  singleReducer,
  combineReducers,
  behaviorActionTypes,
  defaultLayoutReducer,
  layoutActionTypes,
}
