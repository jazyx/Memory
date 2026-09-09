/**
 * frontend/src/pages/Memory.jsx
 *
 * Cards and player scores are read in from a JSON file.
 * The first player can click on two cards.
 *
 * TODO:
 *  + Treat click on found card
 *  + Treat click during FOUND_DELAY
 *  + Make multiuser
 */


import { useState, useEffect, useContext } from 'react'
import { WSContext } from '../state/WSContext'
import { GameContext } from '../state/GameContext'
import { toneColor } from '../utilities/colors'
import '../css/memory.css'


const FOUND_DELAY = 1000


export default function Memory() {
  const {
    user_name,
    sendMessage
  } = useContext(WSContext)
  const { json } = useContext(GameContext) // initially {}

  const [ cards, setCards ] = useState([])
  const [ players, setPlayers ] = useState([])
  // const [ player, setPlayer ] = useState()
  const [ playerCount, setPlayerCount ] = useState(0)
  const [ toFind, setToFind ] = useState(json.to_find || 999)

  const [ flippedCards, setFlippedCards ] = useState([])


  // console.log("player:", player, ", json.player:", json.player)


  // const [ turnOver, setTurnOver ] = useState(false)
  // const [ toFind, setToFind ] = useState(cards.length / 2)


  const flipCard = ({ target }) => {
    if (players[json.player].name !== user_name) {
      // It's not this player's turn. `pointer-actions: none`
      // should already have prevented the click
      return
    }

    target = target.closest("div") // target may initially be img
    const index = Number(target.dataset.index)

    switch (flippedCards.length) {
      case 0:
        // Fall through
      case 1:
        flipACard(index)
        break
      default:
        return
    }

    // Handle the change locally
    cards[index].turned = true
  }


  const flipACard = index => {
    if (flippedCards[0] === index) {
      return
    }

    // Update flippedCards locally before backend confirms
    const flipped = [...flippedCards]
    flipped.push(index)
    setFlippedCards(() => flipped)

    const message = {
      subject: "FLIP_CARD",
      flipped,
      player: user_name
    }
    sendMessage(message)

    // Handle second flip: match or next player?
    if (flipped.length === 2) {
      if ( cards[flipped[0]].image
       === cards[flipped[1]].image) {
        showFound(flipped)
      }

      // setTurnOver(true)
    }
  }


  const showFound = flipped => {
    cards[flipped[0]].found =
      cards[flipped[1]].found =
      "_found_"
  }


  const pairFound = () => {
    cards[flippedCards[0]].turned =
      cards[flippedCards[1]].turned =
      false

    cards[flippedCards[0]].found =
      cards[flippedCards[1]].found =
      players[json.player].name

    players[json.player].score += 1
    setToFind(toFind - 1)

    setFlippedCards([])
  }


  const allFound = () => {
    console.log("still to find:", toFind)
    if (!toFind) {
      cards.forEach(card => card.turned = true)
      setToFind(99)
    }
  }


  const layout = cards.map(({image, turned, found}, index) => {
    const name = image.replace(/^.+\//, "")
                    .replace(/\..+$/, "")
    const key = `${index}_${name}`

    const foundClass = ((!toFind && found))
      ? "show-found"
      : "found"

    const style = toFind
      ? {}
      : playerColor(found)

    return (
      <div
        onClick={flipCard}
        data-index={index}
        key={key}
        style={style}
      >
        { found
          ? <img
              src={image}
              alt={name}
              className={foundClass}
            />
          : turned
            ?
              <img
                src={image}
                alt={name}
              />
            : <p>{`${name}`}</p>
        }
      </div>
    )


    function playerColor(player) {
      const playerData = players.find(data => data.name === player)
      return {
        border: `4px inset ${playerData.color}`,
        boxSizing: "border-box"
      }
    }
  })


  const getHighScore = () => {
    const scores = players.map(({score}) => score)
    return Math.max.apply(null, scores)
  }


  const getPlayerData = name => (
    players.find(data => data.name === name)
  )


  const score = players.map(({name, score, color}, index) => {
    let highlight
    if (toFind){
      highlight = index === json.player

    } else {
      const highScore = getHighScore()
      const data = getPlayerData(name)
      highlight = data.score === highScore
    }

    console.log("name, highlight:", name, highlight)

    if (highlight) {
      color = `#${toneColor(color, 2.)}`
    }

    const className = highlight
      ? "current"
      : null

    const style = {
      color
    }
    return (
      <p
        key={`${name}`}
        className={className}
        style={style}
      >
        {name}:
        <span>{score}</span>
      </p>
    )
  })


  const startGame = () => {
    if (json.players) {
      setPlayers(json.players)
      setPlayerCount(json.players.length)
      setCards(json.cards)
      // setPlayer(0)
    }
  }


  const gameUpdate = () => {
    const {
      cards,
      players=[],
      to_find,
      turn_over
    } = json

    if (!players.length) { return }

    if (turn_over) {
      setFlippedCards([])
    }

    setCards(cards)
    setPlayers(players)
    setPlayerCount(players.length)
    setToFind(to_find)

    const custom = (players[json.player].name === user_name)
      ? "all"
      : "none"

    document.documentElement.style.setProperty("--events", custom)
  }


  useEffect(startGame, [json.players])
  useEffect(gameUpdate, [json])


  return (
    <div
      id="memory"
    >
      <div className="score">{score}</div>
      <div className="layout">{layout}</div>
    </div>
  )
}