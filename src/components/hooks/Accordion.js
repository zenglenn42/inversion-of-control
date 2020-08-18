import React from 'react'
import posed from 'react-pose'
import styled from '@emotion/styled'
import {useAccordion, accordionReducer, actionTypes} from './useAccordion'

function combineReducers(...reducers) {
  return (state, action) => {
    for (const reducer of reducers) {
      const result = reducer(state, action)
      if (result) return result
    }
  }
}

function preventCloseReducer(openedItems, action) {
  if (action.type === actionTypes.toggle_index) {
    const closing = openedItems.includes(action.index)
    const isLast = openedItems.length < 2
    if (closing && isLast) {
      return openedItems
    }
  }
}

function singleReducer(openedItems, action) {
  if (action.type === actionTypes.toggle_index) {
    const closing = openedItems.includes(action.index)
    if (!closing) {
      return [action.index]
    }
  }
}

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
  ({isOpen}) =>
    isOpen
      ? {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        }
      : null,
)

const PoseAccordionContents = posed.div({
  open: {maxHeight: 200},
  closed: {maxHeight: 0},
})

function AccordionContents({isOpen, ...props}) {
  return (
    <PoseAccordionContents
      pose={isOpen ? 'open' : 'closed'}
      style={{overflowY: 'hidden', textAlign: 'justify'}}
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

function Accordion({items, reducer = () => {}, ...props}) {
  const {openedItems, toggleIndex} = useAccordion({
    reducer: combineReducers(reducer, accordionReducer),
  })

  return (
    <div>
      {items.map((item, index) => (
        <AccordionItem key={item.title} direction="vertical">
          <AccordionButton
            isOpen={openedItems.includes(index)}
            onClick={() => toggleIndex(index)}
          >
            {item.title}{' '}
            <span>{openedItems.includes(index) ? '👇' : '👈'}</span>
          </AccordionButton>
          <AccordionContents isOpen={openedItems.includes(index)}>
            {item.contents}
          </AccordionContents>
        </AccordionItem>
      ))}
    </div>
  )
}

export {
  Accordion,
  AccordionButton,
  AccordionContents,
  AccordionItem,
  combineReducers,
  singleReducer,
  preventCloseReducer,
}
