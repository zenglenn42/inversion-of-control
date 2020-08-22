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
    title: '⋯',
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
        title: '⋯',
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

function App() {
  return (
    <>
      <h3 style={header}>Kent C. Dodds' Component Pattern</h3>
      <h4 style={header}>Inversion of Control with State Reducer</h4>
      <div style={twoColumns}>
        <div style={accordionStyle}>
          <h4 style={header}>with Hooks</h4>
          <hr />
          <div style={scrollY}>
            <AccordionWithHooks items={nestedItems} />
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
