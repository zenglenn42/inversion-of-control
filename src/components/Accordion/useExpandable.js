import React from 'react'

const actionTypes = { toggle_index: 'toggle_index' }

function nonTrivialResults(state) {
  return state && state.expandedItems.length
}

function combineExpansionReducers(...reducers) {
  return (state, action) => {
    // Iterate over a set of reducers, typically
    // from most constrictive to least, but only allow one
    // of them to determine the returned state.

    for (const reducer of reducers) {
      const results = reducer(state, action)

      // Defer to the first one to return a non-empty array of
      // expandable items.

      if (nonTrivialResults(results)) return results
    }

    // Otherwise, default to most permissive reducer.
    return permissiveReducer(state, action)
  }
}

// Allow any number of expanded or collapsed items.

function permissiveReducer(state, action) {
  const { expandedItems = [], focalIndex } = state
  switch (action.type) {
    case actionTypes.toggle_index: {
      let nextExpandedItems = []
      let nextFocalIndex = focalIndex
      const closeIt = expandedItems.includes(action.index)
      if (closeIt) {
        nextExpandedItems = expandedItems.filter((i) => i !== action.index)
        nextFocalIndex = focalIndex === action.index ? undefined : focalIndex
      } else {
        nextExpandedItems = [...expandedItems, action.index]
        nextFocalIndex = action.index // make this the new focal index
      }
      return { expandedItems: nextExpandedItems, focalIndex: nextFocalIndex } // return a single open item
    }
    default: {
      throw new Error(
        'Unhandled type in Accordion permissiveReducer: ' + action.type
      )
    }
  }
}

function preventCloseReducer(state, action) {
  const { expandedItems = [] } = state
  if (action.type === actionTypes.toggle_index) {
    const closeIt = expandedItems.includes(action.index)
    const preventClose = expandedItems.length === 1
    if (closeIt && preventClose) {
      return state
    }
  }
}

function singleExpandedReducer(state, action) {
  const { expandedItems = [] } = state
  if (action.type === actionTypes.toggle_index) {
    let nextExpandedItems = []
    let nextFocalIndex = undefined
    const openIt = !expandedItems.includes(action.index)
    if (openIt) {
      // reduce expanded items just to this one
      nextExpandedItems = [action.index]
      nextFocalIndex = action.index
      return { expandedItems: nextExpandedItems, focalIndex: nextFocalIndex }
    }
  }
}

function useExpandable({
  initialState = {
    expandedItems: [],
    focalIndex: undefined
  },
  reducer = permissiveReducer,
  items = []
} = {}) {
  const memoizedReducer = React.useCallback(reducer, [])
  const [
    state = { expandedItems: [], focalIndex: undefined },
    dispatch
  ] = React.useReducer(memoizedReducer, initialState)

  const { expandedItems, focalIndex } = state
  const toggleItemFn = (index) => {
    dispatch({
      type: actionTypes.toggle_index,
      index: index,
      allItems: items
    })
  }

  return { expandedItems, focalIndex, toggleItemFn }
}

export {
  useExpandable,
  combineExpansionReducers,
  preventCloseReducer,
  singleExpandedReducer,
  permissiveReducer,
  actionTypes
}
