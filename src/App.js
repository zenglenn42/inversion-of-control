import React from 'react'
import { Accordion } from './components/hooks/Accordion'
import {
  combineExpansionReducers,
  preventCloseReducer,
  singleExpandedReducer,
  actionTypes as expandableActionTypes
} from './components/hooks/useExpandable'

const accordionStyle = {
  maxWidth: '33vw',
  height: '60vh',
  maxHeight: '70vh',
  marginLeft: 'auto',
  marginRight: 'auto',
  borderRadius: '0.125em',
  padding: '1em',
  border: '2em solid transparent',
  background:
    'linear-gradient(white, white) padding-box, url(/images/fixed-border.jpg) border-box  0 / cover',
  overflow: 'auto scroll'
}

const recursiveStyle = {
  maxWidth: '33vw',
  height: '70vh',
  maxHeight: '60vh',
  marginLeft: 'auto',
  marginRight: 'auto',
  borderRadius: '0.125em',
  padding: '1em',
  border: '2em solid transparent',
  background:
    'linear-gradient(white, white) padding-box, url(/images/recursive-border.jpg) border-box  0 / cover',
  overflow: 'auto scroll'
}

const twoColumns = {
  display: 'flex',
  justifyContent: 'space-evenly',
  flex: 1
}

const header = {
  margin: '0 auto',
  marginBottom: '0.5em',
  textAlign: 'center'
}

const scrollY = {
  maxHeight: '80vh',
  overflowY: 'scroll'
}

const items = [
  {
    title: '🐴',
    contents: (
      <div>
        Horses can sleep both lying down and standing up. Domestic horses have a
        lifespan of around 25 years. A 19th century horse named 'Old Billy' is
        said to have lived 62 years.
      </div>
    )
  },
  {
    title: '🐘',
    contents: (
      <div>
        Elephants are mammals of the family Elephantidae and the largest
        existing land animals. Three species are currently recognised: the
        African bush elephant, the African forest elephant, and the Asian
        elephant.
      </div>
    )
  },
  {
    title: '🦄',
    contents: (
      <div>
        If you’re looking to hunt a unicorn, but don’t know where to begin, try
        Lake Superior State University in Sault Ste. Marie, Michigan. Since
        1971, the university has issued permits to unicorn questers.
      </div>
    )
  }
]

const nestedItems = [
  {
    title: '🐴',
    contents: (
      <div>
        Horses can sleep both lying down and standing up. Domestic horses have a
        lifespan of around 25 years. A 19th century horse named 'Old Billy' is
        said to have lived 62 years.
      </div>
    )
  },
  {
    title: '⋱',
    items: [
      {
        title: '🐘',
        contents: (
          <div>
            Elephants are mammals of the family Elephantidae and the largest
            existing land animals. Three species are currently recognised: the
            African bush elephant, the African forest elephant, and the Asian
            elephant.
          </div>
        )
      },
      {
        title: '🦄',
        contents: (
          <div>
            If you’re looking to hunt a unicorn, but don’t know where to begin,
            try Lake Superior State University in Sault Ste. Marie, Michigan.
            Since 1971, the university has issued permits to unicorn questers.
          </div>
        )
      },
      {
        title: '⋱',
        items: [
          {
            title: '🦄',
            contents: (
              <div>
                If you’re looking to hunt a unicorn, but don’t know where to
                begin, try Lake Superior State University in Sault Ste. Marie,
                Michigan. Since 1971, the university has issued permits to
                unicorn questers.
              </div>
            )
          }
        ]
      }
    ]
  },
  {
    title: '🐘',
    contents: (
      <div>
        Elephants are mammals of the family Elephantidae and the largest
        existing land animals. Three species are currently recognised: the
        African bush elephant, the African forest elephant, and the Asian
        elephant.
      </div>
    )
  },
  {
    title: '🦄',
    contents: (
      <div>
        If you’re looking to hunt a unicorn, but don’t know where to begin, try
        Lake Superior State University in Sault Ste. Marie, Michigan. Since
        1971, the university has issued permits to unicorn questers.
      </div>
    )
  }
]

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

function App() {
  return (
    <div
      style={{
        minWidth: '80%',
        minHeight: '80%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly'
      }}
    >
      <div style={{ padding: '2em', flex: 1 }}>
        <h3 style={header}>Inversion of Control</h3>
        <h4 style={header}>Case Study</h4>
      </div>
      <div style={twoColumns}>
        <div style={accordionStyle}>
          <h4 style={header}>Kent Dodds' Accordion</h4>
          <hr />
          <div style={scrollY}>
            <Accordion
              items={items}
              initialExpanded={[0]}
              expansionReducer={combineExpansionReducers(
                singleExpandedReducer,
                preventCloseReducer
              )}
            />
          </div>
        </div>
        <div style={recursiveStyle}>
          <h4 style={header}>Nested Accordion</h4>
          <hr />
          <div style={scrollY}>
            <Accordion
              items={nestedItems}
              initialExpanded={[0]}
              expansionReducer={singlePeerExpandedReducer}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
