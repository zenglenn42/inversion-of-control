import React from 'react'

const actionTypes = { toggle_index: 'toggle_index' }

function combineExpansionReducers(...reducers) {
  // Run reducers in defined order, all getting the same input state.
  // Stop at the first one to returns some expanded items.
  return (state, action) => {
    for (const reducer of reducers) {
      const result = reducer(state, action)
      if (result && result.length) return result
    }
  }
}

function multiExpandedReducer(expandedItems = [], action) {
  switch (action.type) {
    case actionTypes.toggle_index: {
      const closeIt = expandedItems.includes(action.index)
      const nextExpandedItems = closeIt
        ? expandedItems.filter((i) => i !== action.index)
        : [...expandedItems, action.index]
      return nextExpandedItems
    }
    default: {
      throw new Error(
        'Unhandled type in Accordion multiExpandedReducer: ' + action.type
      )
    }
  }
}

function preventCloseReducer(expandedItems = [], action) {
  if (action.type === actionTypes.toggle_index) {
    const preventClose = expandedItems.length === 1
    if (preventClose) {
      return expandedItems
    }
  }
}

function singleExpandedReducer(expandedItems = [], action) {
  if (action.type === actionTypes.toggle_index) {
    const openIt = !expandedItems.includes(action.index)
    if (openIt) {
      return [action.index] // return a single open item
    }
  }
}

const dfltExpandedReducer = multiExpandedReducer

function useExpandable({
  reducer = dfltExpandedReducer,
  initialState = [],
  items = []
} = {}) {
  const memoizedReducer = React.useCallback(reducer, [])
  const [expandedItems, dispatch] = React.useReducer(
    memoizedReducer,
    initialState
  )
  const toggleItem = (index) => {
    dispatch({
      type: actionTypes.toggle_index,
      index: index,
      items: items
    })
  }
  return { expandedItems, toggleItem }
}

export {
  useExpandable,
  combineExpansionReducers,
  preventCloseReducer,
  singleExpandedReducer,
  multiExpandedReducer,
  actionTypes
}
