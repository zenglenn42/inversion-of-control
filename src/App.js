import React from 'react'
import { FaGithubAlt as GithubIcon } from 'react-icons/fa'
import { BsFillBriefcaseFill as PortfolioIcon } from 'react-icons/bs'
import { Accordion } from './components/hooks/Accordion'
import {
  combineExpansionReducers,
  preventCloseReducer,
  singleExpandedReducer,
  actionTypes as expandableActionTypes
} from './components/hooks/useExpandable'
import {
  appFrame,
  header,
  headerTitle,
  headerSubTitle,
  main,
  article,
  articleTitle,
  accordion,
  footer,
  iconButton,
  grow
} from './style.js'
import { items, nestedItems } from './inputdata'

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
      <div style={appFrame}>
        <header style={header}>
          <p style={headerTitle}>Inversion of Control Software Pattern</p>
          <p style={headerSubTitle}>Case Study Demo</p>
        </header>
        <main style={main}>
          <article style={article}>
            <header style={articleTitle}>Kent Dodds' Accordion</header>
            <div style={accordion}>
              <Accordion
                items={items}
                initialExpanded={[0]}
                expansionReducer={combineExpansionReducers(
                  singleExpandedReducer,
                  preventCloseReducer
                )}
              />
            </div>
          </article>
          <article style={article}>
            <header style={articleTitle}>Nested Accordion</header>
            <div style={accordion}>
              <Accordion
                items={nestedItems}
                initialExpanded={[0]}
                expansionReducer={singlePeerExpandedReducer}
              />
            </div>
          </article>
        </main>
        <div style={grow} />
        <footer style={footer}>
          <span>Incremental Industries &copy; 2020</span>
          <span style={{ flex: 1 }}></span>
          <a
            style={iconButton}
            href="https://zenglenn42.github.io/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="portfolio"
          >
            <PortfolioIcon />
          </a>
          <a
            style={iconButton}
            href="https://github.com/zenglenn42/inversion-of-control/blob/master/README.md"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="github"
          >
            <GithubIcon />
          </a>
        </footer>
      </div>
    </>
  )
}

export default App
