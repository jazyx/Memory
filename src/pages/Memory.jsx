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
import Settings from '../components/Settings'
import { toneColor } from '../utilities/colors'
import '../css/memory.css'


const FOUND_DELAY = 1000


export default function Memory({ role }) {
  const {
    user_name,
    sendMessage
  } = useContext(WSContext)
  const { json } = useContext(GameContext) // initially {}

  const [ cards, setCards ] = useState([])
  const [ players, setPlayers ] = useState([])
  const [ toFind, setToFind ] = useState(json.to_find || 999)

  const [ flippedCards, setFlippedCards ] = useState([])
  const [ settings, setSettings ] = useState()


  const flipCard = ({ target }) => {
    if (players[json.player].name !== user_name) {
      // It's not this player's turn. `pointer-actions: none`
      // should already have prevented the click
      return
    }

    target = target.closest("div") // target may initially be img
    const index = Number(target.dataset.index)

    if (cards[index].found) { return }

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

    if (highlight) {
      color = `#${toneColor(color, 2.)}`
    }

    const className = highlight
      ? "current"
      : null

    const style = {
      color
    }

    const settingsClass = (settings === name)
      ? "settings"
      : "settings hide"

    return (
      <div className="player"
        key={`${name}`}
      >
        <p
          className={className}
          style={style}
          onClick={showSettings}
        >
          {name}:
          <span>{score}</span>
        </p>

        { role === "teacher" &&
          <Settings
            name={name}
            className={settingsClass}
            close={setSettings}
            peek={name === user_name || playerCanPeek(name)}
          />
        }
      </div>
    )


    function playerCanPeek(name) {
      const playerData = players.find(data => data.name === name)
      return !!(playerData && playerData.peek)
    }


    function showSettings() {
      if (settings === name) {
        return setSettings()
      }
      setSettings(name)
    }
  })


  const startGame = () => {
    if (json.players) {
      setPlayers(json.players)
      setCards(json.cards)
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
    setToFind(to_find)

    const custom = (players[json.player].name === user_name)
      ? "all"
      : "none"

    document.documentElement.style.setProperty("--events", custom)
  }


  useEffect(startGame, [json.players])
  useEffect(gameUpdate, [json])


  const data = players.find(data => data.name === user_name) || {}
  const canPeek = role === "teacher" || data.peek
  const layoutClass = `layout${canPeek
    ? " peek"
    : ""
  }`


  return (
    <div
      id="memory"
    >
      <div className="score">{score}</div>
      <div className={layoutClass}>{layout}</div>
    </div>
  )
}