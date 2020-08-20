import React from 'react'

const actionTypes = { toggle_index: 'toggle_index' }

function dfltReducer(expandedItems, action) {
  switch (action.type) {
    case actionTypes.toggle_index: {
      const closing = expandedItems.includes(action.index)
      const nextExpandedItems = closing
        ? expandedItems.filter((i) => i !== action.index)
        : [...expandedItems, action.index]
      return nextExpandedItems
    }
    default: {
      throw new Error('Unhandled type in Accordion dfltReducer: ' + action.type)
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

function preventCloseReducer(expandedItems, action) {
  if (action.type === actionTypes.toggle_index) {
    const closing = expandedItems.includes(action.index)
    const isLast = expandedItems.length < 2
    if (closing && isLast) {
      return expandedItems
    }
  }
}

function singleReducer(expandedItems, action) {
  if (action.type === actionTypes.toggle_index) {
    const closing = expandedItems.includes(action.index)
    if (!closing) {
      return [action.index]
    }
  }
}

function useExpandable({ reducer = dfltReducer, initialState = [] } = {}) {
  const memoizedReducer = React.useCallback(reducer, [])
  const [expandedItems, dispatch] = React.useReducer(
    memoizedReducer,
    initialState,
  )
  const toggleItem = (index) => {
    dispatch({
      type: actionTypes.toggle_index,
      index: index,
    })
  }
  return { expandedItems, toggleItem }
}

export { useExpandable, combineReducers, preventCloseReducer, singleReducer }
