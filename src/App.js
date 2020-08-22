import React from 'react'
import { Accordion as AccordionWithHooks } from './components/hooks/Accordion'
import { Accordion as AccordionWithClasses } from './components/classes/Accordion'

const accordionStyle = {
  maxWidth: '40vw',
  marginLeft: 'auto',
  marginRight: 'auto',
  borderRadius: '0.125em',
  padding: '1em'
  //border: 'solid 1px red',
}
const twoColumns = {
  display: 'flex',
  justifyContent: 'space-evenly'
}
const header = {
  margin: '0 auto',
  textAlign: 'center'
}
const scrollY = {
  maxHeight: '50vh',
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
    title: 'more ⋯',
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
        title: 'more ⋯',
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

const debug_items = [
  {
    title: '1 🐴',
    contents: (
      <div>
        Horses can sleep both lying down and standing up. Domestic horses have a
        lifespan of around 25 years. A 19th century horse named 'Old Billy' is
        said to have lived 62 years.
      </div>
    )
  },
  {
    title: '2 ⋯',
    items: [
      {
        title: '3 🐘',
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
        title: '4 🦄',
        contents: (
          <div>
            If you’re looking to hunt a unicorn, but don’t know where to begin,
            try Lake Superior State University in Sault Ste. Marie, Michigan.
            Since 1971, the university has issued permits to unicorn questers.
          </div>
        )
      },
      {
        title: '5 ⋯',
        items: [
          {
            title: '6 🦄',
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
    title: '7 🐘',
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
    title: '8 🦄',
    contents: (
      <div>
        If you’re looking to hunt a unicorn, but don’t know where to begin, try
        Lake Superior State University in Sault Ste. Marie, Michigan. Since
        1971, the university has issued permits to unicorn questers.
      </div>
    )
  }
]

function nested2Flattened(nestedItems, depth = 0, acc = [], parent) {
  const flattenedItems = nestedItems.reduce((acc, item, index) => {
    const hasNestedItems = item.items
    if (hasNestedItems) {
      acc.push({
        title: item.title,
        contents: undefined,
        depth: depth,
        parent: parent
      })
      const newParent = acc.length - 1
      return nested2Flattened(item.items, depth + 1, acc, newParent)
    } else {
      acc.push({
        ...item,
        depth: depth,
        parent: parent
      })
    }
    return acc
  }, acc)
  return flattenedItems
}

const flattenedItems = nested2Flattened(debug_items)

function App() {
  console.log(flattenedItems)
  return (
    <>
      <h3 style={header}>Kent C. Dodds' Component Pattern</h3>
      <h4 style={header}>Inversion of Control with State Reducer</h4>
      <div style={twoColumns}>
        <div style={accordionStyle}>
          <h4 style={header}>with Hooks</h4>
          <hr />
          <div style={scrollY}>
            <AccordionWithHooks items={flattenedItems} />
          </div>
        </div>
        <div style={accordionStyle}>
          <h4 style={header}>with Classes</h4>
          <hr />
          <div style={scrollY}>
            <AccordionWithClasses items={items} />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
