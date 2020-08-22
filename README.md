## Inversion of Control Software Pattern

### _Fighting prop-bloat and maintenance blues in your React components_

Imagine you've written a [transcendent](https://www.youtube.com/watch?v=uVQ8nNxcmrM) new React component with a luminescent set of props to support a reasonable collection of use-cases.

![alt](docs/images/christian-paul-stobbe-IhM0m7AZh4Q-unsplash-1.jpg)
_<a href="https://unsplash.com/@stobbewtf?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Photo Christian Paul Stobbe</a>_

You soar to new personal heights like Jonathan Livingston Seagull with a desire to share your breakthrough.

So you publish to the world, blog a bit, search for the perfect evocative unsplash image, make a signifying reference to Joseph Campbell and the [Hero's Journey](https://en.wikipedia.org/wiki/Hero%27s_journey), and maybe take a shower.

If the gods of SEO and open source smile, you're rewarded with the blessing (and curse?) of widespread interest and adoption.

The curse comes in the form of requests and (hopefully) PRs for extensions and use-cases you hadn't anticpated. Initially, you bask in the glow of acknowledged value ...

![alt](docs/images/ryan-parker-U2t3g6BuXhg-unsplash.jpg)
_<a href="https://unsplash.com/@dryanparker?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Photo by Ryan Parker</a>_

... but soon realize your crisp code descends into a maintenance muddle. The prop count grows. You struggle to add test cases to handle the combinatorial complexity implied by so many options. It's hard keeping up with the demand for modifications while still maintaining quality and coherence to your original concept.

Has your gift to the world become an [albatross](https://en.wiktionary.org/wiki/albatross_around_one%27s_neck) around your neck?

![alt](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Dore-I_watched_the_Water-Snakes-Detail.jpg/198px-Dore-I_watched_the_Water-Snakes-Detail.jpg)
_<a href="https://commons.wikimedia.org/wiki/Template:PD-US">
Engraving by Gustave Doré, 1876
[ CC-PD-Mark ]</a>_

### Solution: Bring Your Own Behavior Reducer

---

Sometimes the answer may be to pass control _back_ to the flock of eager adoptees with an implementation that _encourages_ extension without having to rewrite the underlying component at each turn.

I've recently become a fan of [Kent C. Dodds](https://kentcdodds.com) after watching his two **'Simply React'** keynotes in [2018](https://youtu.be/AiJ8tRRH0f8) and [2020](https://youtu.be/5io81WLgXtg) where he discusses 'inversion of control' in the context of a highly extensible Accordion component.

The key points are:

- expose layout logic for easy modification by clients
- support extensible component behavior through chainable, developer-supplied state reducers

Importantly, you still craft reasonable defaults for layout and behavior to meet your needs (and hopefully those of many others). However, if you allow one or more DIY behavior reducers to be passed in, then you may side-step the need to anticipate or laboriously support variant policies such as:

- only allow 1 visible item at a time
- require that at least 1 item be visible at all times
- allow multiple visible items

![alt](docs/images/kcd-accordion.png)

### 2. Nested Accordion

To illustrate Kent's point about extensibility, I implement my own _nested_ Accordion variant.

In the process, I sketch out an Accordion that supports two more types of reducers (besides the 'expansion behavior' reducer):

- input data reducers

  - For a nested Accordion, the input data may include nested items.
  - However, rendering is currently a map across a 1-dimensional array of items.
  - Can we craft a _data reducer_ to linearize that input so renders still work?

- layout reducers
  - How might we decouple layout from being tied to a given component library such as Emotion or Material-UI?
  - Can we address the unique requirements of a nested Accordion if we pass in our own layout reducer?

Initial attempts at answering these questions look promising.

Here's the UI for my hook's based implementation:

---

![alt](docs/images/nested-accordion.png)

#### Here are the recursively defined input data:

App.js

```javascript
const nestedItems = [
  {
    title: '🐴',
    contents: (
      <div>
        Horses can sleep both lying ...
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
            Elephants are mammals of the ...
          </div>
        )
      },
      ...
    ]
  }
  ...
]

function App() {
  return (<Accordion items={nestedItems} />)
}
```

---

Accordion.js

```javascript
import React from 'react'
import { useAccordion } from './useAccordion'

function Accordion({ items, ...props }) {
  const { components } = useAccordion({ items })
  return <div>{components}</div>
}

export { Accordion }
```

---

useAccordion.js

```javascript
...

// Support indented layouts ...

function dfltLayoutReducer(components, action) {
  switch (action.type) {
    case layoutActionTypes.map_items:
      return action.items.map((item, index) => {
        if (isVisible(item, action.items, action.expandedItems)) {
          return (
            <AccordionItem
              key={`${item.depth}_${item.title}_${index}`}
              direction="vertical"
              indent={item.depth}
            >
              {createButton(
                index,
                action.expandedItems.includes(index),
                action.toggleItem,
                item.title,
                '👇',
                '👈'
              )}
              {createContents(
                action.expandedItems.includes(index),
                item.contents
              )}
            </AccordionItem>
          )
        }
        return createEmptyItem(item.depth, index)
      })
    default: {
      throw new Error(
        'Unhandled type in useAccordion dfltLayoutReducer: ' + action.type
      )
    }
  }
}

// Flatten nested input json into a single dimension
// array, augmented with knowledge of parent index
// to support visibility calculation in layout reducer.

function flattenItemsReducer(nestedItems, depth = 0, acc = [], parent) {
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
      return flattenItemsReducer(item.items, depth + 1, acc, newParent)
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

const dfltInputItemsReducer = flattenItemsReducer

// Augment useAccordion to support layout and input data reduction...

function useAccordion({
  layoutReducer = dfltLayoutReducer,
  inputItemsReducer = dfltInputItemsReducer,
  items = [],
  initialExpanded = []
} = {}) {
  const normalizedItems = useRef(inputItemsReducer(items))
  const { expandedItems, toggleItem } = useExpandable({
    initialState: initialExpanded
  })
  const memoizedToggleItem = useCallback(toggleItem, [])

  const memoizedLayoutReducer = useCallback(layoutReducer, [])
  const [components, dispatch] = useReducer(memoizedLayoutReducer, [])

  useEffect(() => {
    dispatch({
      type: layoutActionTypes.map_items,
      items: normalizedItems.current,
      toggleItem: memoizedToggleItem,
      expandedItems: expandedItems
    })
    return
  }, [normalizedItems, memoizedToggleItem, expandedItems])
  return { components }
}
```
