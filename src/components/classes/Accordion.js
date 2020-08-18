import React from 'react'
import posed from 'react-pose'
import styled from '@emotion/styled'
import {BaseAccordion} from './BaseAccordion'

const combineReducers = (...reducers) => (state, changes) =>
  reducers.reduce((acc, reducer) => reducer(state, acc), changes)

const preventClose = (state, changes) =>
  changes.type === 'closing' && state.openIndices.length < 2
    ? {...changes, openIndices: state.openIndices}
    : changes

const single = (state, changes) =>
  changes.type === 'opening'
    ? {...changes, openIndices: changes.openIndices.slice(-1)}
    : changes

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

function Accordion({items, ...props}) {
  return (
    <BaseAccordion {...props}>
      {({openIndices, handleItemClick}) => (
        <div>
          {items.map((item, index) => (
            <AccordionItem key={item.title} direction="vertical">
              <AccordionButton
                isOpen={openIndices.includes(index)}
                onClick={() => handleItemClick(index)}
              >
                {item.title}{' '}
                <span>{openIndices.includes(index) ? '👇' : '👈'}</span>
              </AccordionButton>
              <AccordionContents isOpen={openIndices.includes(index)}>
                {item.contents}
              </AccordionContents>
            </AccordionItem>
          ))}
        </div>
      )}
    </BaseAccordion>
  )
}

export default App
