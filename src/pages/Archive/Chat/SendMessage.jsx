/**
 * Project/frontend/src/pages/Chat/SendMessage.jsx
 */




import { useState } from 'react'


export const SendMessage = ({
  postMessage,
  canPost // at least one recipient has been selected
}) => {

  const [ text, setText ] = useState("")
  

  const checkForEnter = event => {
    if (event.key === "Enter") {
      event.preventDefault()
      sendMessage()
    }
  }


  const updateMessage = ({ target }) => {
    setText(target.value)
  }


  const sendMessage = () => {
    if (text && canPost) {
      postMessage(text)
      setText("")
    }
  }


  return (
    <>
      <input
        type="text"
        value={text}
        placeholder="Edit message"
        onKeyDown={checkForEnter}
        onChange={updateMessage}
        autoFocus={true}
      />
      <button
        onClick={sendMessage}
        disabled={!text || !canPost}
      >
        Send Message
      </button>
    </>
  )
}