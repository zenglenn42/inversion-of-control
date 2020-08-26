import React from 'react'
import { Accordion } from './components/hooks/Accordion'
import {
  combineExpansionReducers,
  preventCloseReducer,
  singleExpandedReducer,
  actionTypes as expandableActionTypes
} from './components/hooks/useExpandable'
import {
  container,
  gutter,
  titleBox,
  title,
  contentBox,
  content,
  subcontentRight,
  subcontentLeft
} from './style.js'

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
    <>
      <div style={container}>
        <div style={gutter}>gutter</div>
        <div style={titleBox}>
          <div style={title}>
            <h2>Inversion of Control Software Pattern</h2>
          </div>
          <div style={title}>
            <h3>Case Study Demo</h3>
          </div>
        </div>
        <div style={gutter}>gutter</div>
        <div style={contentBox}>
          <div style={content}>
            <div style={title}>
              <h4>Kent Dodds' Accordion</h4>
            </div>
            <div style={gutter}>gutter</div>
            <div style={subcontentLeft}>
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
          <div style={gutter}>gutter</div>
          <div style={content}>
            <div style={title}>
              <h4>Nested Accordion</h4>
            </div>
            <div style={gutter}>gutter</div>
            <div style={subcontentRight}>
              <Accordion
                items={nestedItems}
                initialExpanded={[0]}
                expansionReducer={singlePeerExpandedReducer}
              />
            </div>
          </div>
        </div>
        <div style={gutter}>gutter</div>
      </div>
    </>
  )
}

export default App
