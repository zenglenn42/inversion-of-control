import React from 'react'

const actionTypes = {toggle_index: 'toggle_index'}

function accordionReducer(openedItems, action) {
  switch (action.type) {
    case actionTypes.toggle_index: {
      console.log('curr state:', openedItems)
      const closing = openedItems.includes(action.index)
      console.log('closing:   ', closing)
      const nextOpenIndices = closing
        ? openedItems.filter((i) => i !== action.index)
        : [...openedItems, action.index]
      console.log('next state:', nextOpenIndices)
      return nextOpenIndices
    }
    default: {
      throw new Error('Unhandled type in accordionReducer: ' + action.type)
    }
  }
}

function useAccordion({reducer = accordionReducer} = {}) {
  const memoizedReducer = React.useCallback(reducer, [])
  const initialOpenedItems = []
  const [openedItems, dispatch] = React.useReducer(
    memoizedReducer,
    initialOpenedItems,
  )
  const toggleIndex = (index) => {
    return dispatch({type: actionTypes.toggle_index, index: index})
  }
  return {openedItems, toggleIndex}
}

export {useAccordion, accordionReducer, actionTypes}
