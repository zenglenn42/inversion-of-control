import React from 'react'

class BaseAccordion extends React.Component {
  static defaultProps = {
    stateReducer: (state, changes) => changes,
    onStateChange: () => {},
  }
  state = {openIndices: [0]}
  getState(state = this.state) {
    return {
      openIndices:
        this.props.openIndices === undefined
          ? state.openIndices
          : this.props.openIndices,
    }
  }
  internalSetState(changes, callback = () => {}) {
    let allChanges
    this.setState(
      (state) => {
        const actualState = this.getState(state)
        const changesObject =
          typeof changes === 'function' ? changes(actualState) : changes
        allChanges = this.props.stateReducer(actualState, changesObject)
        return allChanges
      },
      () => {
        this.props.onStateChange(allChanges)
        callback()
      },
    )
  }
  handleItemClick = (index) => {
    this.internalSetState((state) => {
      const closing = state.openIndices.includes(index)
      return {
        type: closing ? 'closing' : 'opening',
        openIndices: closing
          ? state.openIndices.filter((i) => i !== index)
          : [...state.openIndices, index],
      }
    })
  }
  render() {
    return this.props.children({
      openIndices: this.getState().openIndices,
      handleItemClick: this.handleItemClick,
    })
  }
}

export {BaseAccordion}
