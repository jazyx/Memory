/**
 * frontend/src/pages/Carousel.jsx
 */


import React from 'react'
import Board from  './Board'
import '../../css/carousel.css'


export default function Carousel(props) {

  // const board = {
  //   phrase: "what_in",
  //   type: "CONTAINERS",
  //   _1: 0
  // }

  const board = {
    phrase: "together",
    type: "THINGS",
    _1: 6,
    _2: 7
  }


  return (
    <div id="carousel">
      <Board {...board}/>
    </div>
  )
}