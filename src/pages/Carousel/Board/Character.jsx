/**
 * frontend/src/pages/Carousel/Board/Character.jsx
 */


import { useState, useRef, useEffect } from 'react'


const FLIP_DELAY = 100


export default function Character({ sequence }) {
  const [ rerender, setRerender ] = useState(0)
  const [ charIndex, setCharIndex ] = useState(0)
  
  const targetIndex = sequence.length - 1
  
  const intervalRef = useRef()

  const startSequence = () => {
    if (intervalRef.current) { return }
    intervalRef.current = setInterval(update, FLIP_DELAY)
  }

  const update = () => {
    setRerender(previous => previous + 1)
  }

  const runSequence = () => {
    if (charIndex < targetIndex) {
      setCharIndex(previous => previous + 1)
    } else {
      clearInterval(intervalRef.current)
      setCharIndex(targetIndex)
    }
  }
 
  useEffect(startSequence, [])
  useEffect(runSequence, [rerender])

  return (
    // <span>{sequence[charRef.current]}</span>
    <span>{sequence[charIndex]}</span>
  )
}