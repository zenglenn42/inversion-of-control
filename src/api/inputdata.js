import React from 'react'
import { ReactComponent as HorseIcon } from './Horse.svg'
import { ReactComponent as ElephantIcon } from './Elephant.svg'
import { ReactComponent as UnicornIcon } from './Unicorn.svg'
import { ReactComponent as MoreIcon } from './MoreDots.svg'
// import { ReactComponent as DiagramIcon } from './Diagram.svg'

const equusItem = {
  tag: 'equus',
  title: '🐴',
  contents: (
    <div>
      Horses can sleep both lying down and standing up. Domestic horses have a
      lifespan of around 25 years. A 19th century horse named 'Old Billy' is
      said to have lived 62 years.
    </div>
  )
}

const elephantusItem = {
  tag: 'elephantus',
  title: '🐘',
  contents: (
    <div>
      Elephants are mammals of the family Elephantidae and the largest existing
      land animals. Three species are currently recognised: the African bush
      elephant, the African forest elephant, and the Asian elephant.
    </div>
  )
}

const unicornisItem = {
  tag: 'unicornis',
  title: '🦄',
  contents: (
    <div>
      If you’re looking to hunt a unicorn, but don’t know where to begin, try
      Lake Superior State University in Sault Ste. Marie, Michigan. Since 1971,
      the university has issued permits to unicorn questers.
    </div>
  )
}

export const items = [equusItem, elephantusItem, unicornisItem]

export const nestedItems = [
  equusItem,
  elephantusItem,
  unicornisItem,
  {
    tag: 'parent',
    icon: '⋱',
    title: '',
    items: [
      elephantusItem,
      unicornisItem,
      {
        tag: 'parent',
        icon: '⋱',
        title: '',
        items: [unicornisItem]
      }
    ]
  }
]

export const nestedItemOverrides = {
  tag: {
    equus: {
      icon: <HorseIcon width="100%" height="2em" />,
      title: 'Equus'
    },
    elephantus: {
      icon: <ElephantIcon width="100%" height="2em" />,
      title: 'Elephantus'
    },
    unicornis: {
      icon: <UnicornIcon width="100%" height="2em" />,
      title: 'Unicornis'
    },
    parent: {
      icon: <MoreIcon width="100%" height="2em" />
    }
  }
}
