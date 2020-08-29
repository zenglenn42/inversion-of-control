import React from 'react'
import { ReactComponent as HorseIcon } from './Horse.svg'
import { ReactComponent as ElephantIcon } from './Elephant.svg'
import { ReactComponent as UnicornIcon } from './Unicorn.svg'
import { ReactComponent as MoreIcon } from './MoreDots.svg'

export const nestedItemOverrides = {
  tag: {
    horse: {
      title: <HorseIcon width="100%" height="2em" />
    },
    elephant: {
      title: <ElephantIcon width="100%" height="2em" />
    },
    unicorn: {
      title: <UnicornIcon width="100%" height="2em" />
    },
    parent: {
      title: <MoreIcon width="100%" height="2em" />
    }
  }
}

const horseItem = {
  tag: 'horse',
  title: '🐴',
  contents: (
    <div>
      Horses can sleep both lying down and standing up. Domestic horses have a
      lifespan of around 25 years. A 19th century horse named 'Old Billy' is
      said to have lived 62 years.
    </div>
  )
}

const elephantItem = {
  tag: 'elephant',
  title: '🐘',
  contents: (
    <div>
      Elephants are mammals of the family Elephantidae and the largest existing
      land animals. Three species are currently recognised: the African bush
      elephant, the African forest elephant, and the Asian elephant.
    </div>
  )
}

const unicornItem = {
  tag: 'unicorn',
  title: '🦄',
  contents: (
    <div>
      If you’re looking to hunt a unicorn, but don’t know where to begin, try
      Lake Superior State University in Sault Ste. Marie, Michigan. Since 1971,
      the university has issued permits to unicorn questers.
    </div>
  )
}

export const items = [horseItem, elephantItem, unicornItem]

export const nestedItems = [
  horseItem,
  elephantItem,
  unicornItem,
  {
    tag: 'parent',
    title: '⋱',
    items: [
      elephantItem,
      unicornItem,
      {
        tag: 'parent',
        title: '⋱',
        items: [unicornItem]
      }
    ]
  }
]
