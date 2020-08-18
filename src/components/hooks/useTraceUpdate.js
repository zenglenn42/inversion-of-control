// Courtesy: https://stackoverflow.com/questions/41004631/trace-why-a-react-component-is-re-rendering

import {useRef, useEffect} from 'react'

function useTraceUpdate(props) {
  const prev = useRef(props)
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v]
      }
      return ps
    }, {})
    if (Object.keys(changedProps).length > 0) {
      console.log('Changed props:', changedProps)
    } else {
      console.log('No changed props:', prev.current)
    }
    prev.current = props
  })
}

export default useTraceUpdate
