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
import '../css/memory.css'


const FOUND_DELAY = 1000


export default function Memory() {
  const { user_name } = useContext(WSContext)
  const { json } = useContext(GameContext) // initially {}

  const [ cards, setCards ] = useState([])
  const [ players, setPlayers ] = useState([])
  const [ flippedCards, setFlippedCards ] = useState([])
  const [ player, setPlayer ] = useState()
  const [ playerCount, setPlayerCount ] = useState(0)

  const [ turnOver, setTurnOver ] = useState(false)
  const [ toFind, setToFind ] = useState(cards.length / 2)


  const flipCard = ({ target }) => {
    if (players[player].name !== user_name) { return }

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

    cards[index].turned = true
  }


  const flipACard = index => {
    if (flippedCards[0] === index) {
      return
    }

    const flippedNow = [...flippedCards]
    flippedNow.push(index)
    setFlippedCards(flippedCards => flippedNow)

    if (flippedNow.length === 2) {
      if ( cards[flippedNow[0]].image
       === cards[flippedNow[1]].image) {
        showFound(flippedNow)
      }

      setTurnOver(true)
    }
  }


  const showFound = flippedNow => {
    cards[flippedNow[0]].found =
      cards[flippedNow[1]].found =
      "_found_"
  }


  const pairFound = () => {
    cards[flippedCards[0]].turned =
      cards[flippedCards[1]].turned =
      false

    cards[flippedCards[0]].found =
      cards[flippedCards[1]].found =
      players[player].name

    players[player].score += 1
    setToFind(toFind - 1)

    setFlippedCards([])
  }


  const nextPlayer = () => {
    setPlayer((player + 1) % playerCount)
    cards[flippedCards[0]].turned =
      cards[flippedCards[1]].turned =
      false
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

    const foundClass = (found === "_found_" || (turned && found))
      ? "show-found"
      : "found"

    return (
      <div
        onClick={flipCard}
        data-index={index}
        key={key}
      >
        { found
          ? <img
              src={image}
              alt=""
              className={foundClass}
            />
          : turned
            ?
              <img
                src={image}
                alt=""
              />
            : <p>{`${name}`}</p>
        }
      </div>
    )
  })


  const score = players.map(({name, score}, index) => {
    const className = index === player
      ? "current"
      : null
    return (
      <p
        key={`${name}`}
        className={className}
      >
        {name}:
        <span>{score}</span>
      </p>
    )
  })


  const nextTurn = () => {
    if (!turnOver) {
      return
    }

    if ( cards[flippedCards[0]].image
      === cards[flippedCards[1]].image) {
      setTimeout(pairFound, FOUND_DELAY)
    } else {
      setTimeout(nextPlayer, FOUND_DELAY)
    }

    setTurnOver(false)
  }


  const startGame = () => {
    if (json.players) {
      setPlayers(json.players)
      setPlayerCount(json.players.length)
      setCards(json.cards)
      setPlayer(0)
    }
  }


  const enablePlayer = () => {
    if (!players.length) { return }

    const custom = (players[player].name === user_name)
      ? "all"
      : "none"

    document.documentElement.style.setProperty("--events", custom)
  }


  useEffect(startGame, [json.players])
  useEffect(nextTurn, [turnOver])
  useEffect(allFound, [toFind])
  useEffect(enablePlayer, [player])


  return (
    <div
      id="memory"
    >
      <div className="score">{score}</div>
      <div className="layout">{layout}</div>
    </div>
  )
}