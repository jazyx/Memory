/**
 * frontend/src/pages/Carousel/Board.jsx
 */


import { useContext, useEffect } from 'react'
import { CarouselContext } from '../../../state'
import Character from './Character'


const GENERATOR = {
  PHRASES: {
    "what_in":    "What is in the %1?",
    "which":      "Which container is the %1 in?",
    "how_many":   "How many things are in the %1?",
    "has_count":  "Which container holds %1 things?",
    "together":   "Are the %1 and the %2 in the same container?",
    "count_them": "How many containers are there?",
    "which_next": "Which container will come out next?"
  },
  CONTAINER: "container",
  CONTAINERS: [
    "backpack",
    "briefcase",
    "cardboard box",
    "carpet bag",
    "dustbin",
    "guitar case",
    "laundry basket",
    "plastic crate",
    "sack",
    "shopping bag",
    "suitcase",
    "trunk"
  ],
  THINGS: [
    // should be 12 characters or fewer
    "ball",
    "book",
    "elephant",
    "hammer",
    "phone",
    "slide",
    "sports car",
    "tennis racket"
  ]
}
const WIDTH = 22 // "How many containers "
const ROWS = 3
const CHARSET = " ABCDEFGHIJKLMNOPQRSTUVWXYZ.?-"



export default function Board({ phrase, type, _1, _2 }) {
  const { previous } = useContext(CarouselContext)
  console.log("previous:", previous)

  const source = GENERATOR[type]
  const first = source[_1]
  const second = source[_2]
  const lettering = substitute(
    GENERATOR.PHRASES[phrase],
    first,
    second
  )
  console.log("lettering:", lettering)


  function substitute(phrase, first, second) {
    if (first) {
      phrase = phrase.replace("%1", first)
    }
    if (second) {
      phrase = phrase.replace("%2", second)
    }

    phrase = hardCodeLineBreaks(phrase)

    return phrase
  }


  function hardCodeLineBreaks(phrase) {
    // Find the last space in the first remaining WIDTH characters
    
    const lines = []
    let line, lastSpace
    for ( let ii = 0; ii < ROWS; ii += 1 ) {
      lastSpace = phrase.lastIndexOf(" ", WIDTH)
      if (lastSpace < 0) {
        // No more spaces
        line = phrase
        phrase = ""

      } else {
        if (phrase.length <= WIDTH) {
          lastSpace = WIDTH
        }
        // Wrap the phrase at lastSpace
        line = phrase.slice(0, lastSpace)
        phrase = phrase.slice(lastSpace).trim()
      }

      lines.push(line + " ".repeat(WIDTH - line.length))
    }
    
    console.log("lines:", lines)

    return lines.join("").toUpperCase().split("")
  }


  const charDisplay = lettering.map((character, index) => {
    const start = Math.max(0, CHARSET.indexOf(previous[index]))
    const end = CHARSET.indexOf(character) + 1 // less than start?
    const sequence = (start < end)
      ? CHARSET.slice(start, end)
      : CHARSET.slice(start) + CHARSET.slice(0, end)

    console.log("sequence:", sequence.replace(" ", "_"))

    return (
      <Character
        key={index+"_"+character}
        sequence={sequence}
      />
    )
})


  function setBoardCSS() {
    document.documentElement.style.setProperty("--board", WIDTH)
  }


  useEffect(setBoardCSS, [])


  return (
    <div id="board">
      {charDisplay}
    </div>
  )
}