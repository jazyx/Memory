/**
 * Project/frontend/src/pages/Chat.jsx
 */


import {
  useContext,
  useEffect,
  useState,
  useRef
} from 'react'
import { v4 as uuid } from 'uuid'
import { Link } from 'react-router-dom'
import { WSContext } from '../../logic'

import { LogIn } from './LogIn'
import { Messages } from './Messages'
import { Recipients } from './Recipients'
import { SendMessage } from './SendMessage'



export const Chat = () => {
  const {
    userId,
    user_name,
    requestSocket,
    sendMessage,
    treatMessageListener,
  } = useContext(WSContext)
  

  // renders state used only to force an update when useRef changes
  const [ renders, setRenderCount ] = useState(0)

  // User must log in with a userName before sending messages
  const [ userName, setUserName ] = useState(user_name)
  const [ to, setTo ] = useState([])

  const messagesRef = useRef([])
  const membersRef = useRef([{
    name: "placeholder", online: false
  }])



  // LOGIN // LOGIN // LOGIN // LOGIN // LOGIN // LOGIN // LOGIN //

  const logIn = () => {
    if (!userName) { return }

    sendMessage({
      subject: "LOG_IN",
      recipient_id: "SYSTEM",
      user_name: userName
    })
  }


  const chatLogin = message => {
    // const { user_name } = message
    // user_name will have been set in WSReducer, and will be
    // available from WSContext after the next re-render
    console.log("user_name:", user_name, ", message.user_name:", message.user_name)

    // Automatically join the Chat activity, since this demo
    // only handles this one activity
    sendMessage({
      subject: "CHAT.JOIN",
      sender_id: userId
      // recipient_id not needed
    })

    // Server responds with message with subject "CHAT.SET_MEMBERS"
    // which triggers chatGroupMembers() below.
  }


  // GROUP MEMBERS //////// GROUP MEMBERS //////// GROUP MEMBERS //

  const chatGroupMembers = ({ members }) => {
    membersRef.current = members
    setRenderCount(renders => renders + 1) // force rerender
  }


  const userCameOnline = ({name}) => {
    const groupMembers = membersRef.current
    const userData = groupMembers.find( data => data.name === name)

    if (userData) {
      userData.online = true // update existing status in place
    } else { // new group member
      groupMembers.push({ name, online: true })
    }

    setRenderCount(renders => renders + 1) // force rerender

  }


  const userWentOffline = ({name}) => {
    const groupMembers = membersRef.current
    const userData = groupMembers.find(
      data => data.name === name
    )

    if (userData) {
      // should always be true
      userData.online = false // update status in place
    } else {
      groupMembers.push({ name, online: false })
    }

    setRenderCount(renders => renders + 1) // force rerender
  }


  // MESSAGE MANAGEMENT // MESSAGES // MESSAGE MANAGEMENT //

  const treatIncoming = (message) => {
    // { sender_id:    <uuid>
    //   recipient_id: userId,
    //   subject:      "CHAT",
    //   message_id:   <uuid>,
    //   time_stamp:   <integer time stamp>,
    //   content:      <string>
    // }
    // NOTE: the time_stamp and content fields may be missing

    messagesRef.current = [...messagesRef.current, message]
    confirmMessageReceived(message)
    setRenderCount(renders => renders + 1) // => rerender
  }


  const receivedByServer = (message) => {
    const messages = messagesRef.current
    const { message_id, time_stamp, recipients } = message
    const sentMessage = messages.find( message => (
      message.message_id === message_id
    ))

    if (sentMessage) {
      sentMessage.time_stamp = time_stamp
      sentMessage.recipients = recipients.map( recipient_id => (
        { recipient_id, confirmed: false }
      ))
    }

    setRenderCount(renders => renders + 1) // => rerender

    return true
  }


  const confirmMessageReceived = ({ sender_id, message_id }) => {
    // Inform the sender that this message was received
    const message = {
      // this userId will be added as sender_id in sendMessage()
      recipient_id: sender_id,
      subject: "CHAT.CONFIRMED",
      message_id
    }

    console.log("confirmation message:", message)

    sendMessage(message)
  }


  const confirmReceipt = message => {
    const messages = messagesRef.current
    const {
      message_id,
      time_stamp,
      sender_id,
      user_name
    } = message
    const sentMessage = messages.find( message => (
      message.message_id === message_id
    ))

    if (sentMessage) {
      const recipientData = sentMessage.recipients.find( data => (
           data.recipient_id === sender_id
        || data.recipient_id === user_name
      ))

      if (recipientData) {
        recipientData.confirmed = time_stamp
      }
    }

    setRenderCount(renders => renders + 1) // => rerender

    return true
  }


  const postMessage = (text) => {
    const message = {
      // sender_id: userId to be added by WSContext.sendMessage
      recipients: to, // [ <string user_name>, ... ]
      subject: "CHAT.MESSAGE",
      message_id: uuid(),
      content: { text }
    }

    // Store the outgoing message...
    messagesRef.current = [ ...messagesRef.current, message ]

    // ... and then send it to the WebSocket server
    sendMessage(message)
  }


  // WEBSOCKET LISTENERS // LISTENERS // WEBSOCKET LISTENERS //
  const registerListeners = () => {
    const listeners = [
      { subject: "LOGGED_IN",         callback: chatLogin },
      // "LOGGED_IN" is also handled by the SYSTEM in WSContext
      { subject: "CHAT.SET_MEMBERS",  callback: chatGroupMembers },
      { subject: "CHAT.MESSAGE",      callback: treatIncoming },
      { subject: "CHAT.ACKNOWLEDGED", callback: receivedByServer },
      { subject: "CHAT.CONFIRMED",    callback: confirmReceipt },
      { subject: "CHAT.USER_ONLINE",  callback: userCameOnline },
      { subject: "CHAT.USER_OFFLINE", callback: userWentOffline }
    ]

    treatMessageListener("add", listeners)

    return () => {
      treatMessageListener("delete", listeners)
    }
  }


  const initializeConnection = () => {
    const isAlreadyOpen = requestSocket()
    if (isAlreadyOpen && user_name) {
      logIn(user_name)
    }

    return () => console.log("Connection resumed. userId:", userId, ", userName:", user_name)
  }


  // Open WebSocket connection as soon as page is first rendered
  useEffect(initializeConnection, [])
  useEffect(registerListeners, [])


  // RENDER // RENDER // RENDER // RENDER // RENDER //  RENDER //
   
  const messages     = messagesRef.current
  const groupMembers = structuredClone(membersRef.current)
  const canPost      = to.length
  const logInOptions    = { userName, setUserName, logIn }
  const messagesOptions = { messages, userId }
  const toOptions       = { groupMembers, to, setTo }
  const sendOptions     = { postMessage, canPost }
  const connectionInfo  = (userId)
    ? `Connected as: ${userId.substring(0, 8)}...`
    : "Connecting..."

    
  const display = (user_name) // user_name is set when logged in
  ? <div id="chat">
      <Messages { ...messagesOptions} />
      <Recipients { ...toOptions } />
      <SendMessage { ...sendOptions } />
    </div>
  : <LogIn { ...logInOptions } />


  return (
    <main>
      <h1>Chat</h1>
      <p>{connectionInfo}</p>

      {display}

      <Link to="/page1"   draggable="false">Page 1</Link>
      <Link to="/page2"   draggable="false">Page 2</Link>
      <Link to="/records" draggable="false">Records</Link>
    </main>
  )
}