import React from 'react'

const actionTypes = { toggle_index: 'toggle_index' }

function multiExpandedReducer(expandedItems = [], action) {
  switch (action.type) {
    case actionTypes.toggle_index: {
      const closing = expandedItems.includes(action.index)
      const nextExpandedItems = closing
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

function combineExpansionReducers(...reducers) {
  return (state, action) => {
    for (const reducer of reducers) {
      const result = reducer(state, action)
      if (result) return result
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
    const closing = expandedItems.includes(action.index)
    if (!closing) {
      return [action.index]
    }
  }
}

const dfltExpandedReducer = multiExpandedReducer

function useExpandable({
  reducer = dfltExpandedReducer,
  initialState = []
} = {}) {
  const memoizedReducer = React.useCallback(reducer, [])
  const [expandedItems, dispatch] = React.useReducer(
    memoizedReducer,
    initialState
  )
  const toggleItem = (index) => {
    dispatch({
      type: actionTypes.toggle_index,
      index: index
    })
  }
  return { expandedItems, toggleItem }
}

export {
  useExpandable,
  combineExpansionReducers,
  preventCloseReducer,
  singleExpandedReducer,
  multiExpandedReducer
}
