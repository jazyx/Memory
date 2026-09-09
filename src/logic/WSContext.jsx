/**
 * Project/frontend/src/contexts/WSContext/index.jsx
 *
 * This context provides access to a WebSocket connection. It
 * allows other scripts to add and remove listeners for particular
 * messages, and to send messages in object format.
 *
 * The socket will not be opened until it is requested by another
 * script. Even so, the socket is only opened after a re-render, to
 * ensure that registerConnectionCallback() is called before the
 * socket is opened (and to ensure that callbacks are deleted when
 * the context is unloaded).
 * 
 * This context does not maintain any record of incoming or
 * outgoing messages; these should be taken care of by other
 * scripts.
 *
 * This provider will re-render when:
 *
 * + a request to open the socket is received
 * + the socket is opened, and immediately after when...
 * + the WebSocket server responds to a connection request with a
 *   message that has "CONNECTION" as the subject. At this point
 *   user_id will be set to a unique user id.
 * + the socket is closed
 *
 * In development mode, this provider will be re-rendered twice at
 * each of the stages mentioned above, in order to check for
 * unexpected side effects.
 *
 * If the app is edited during development, this provider will
 * also be re-rendered, which will lead to treatMessageListener()
 * being called multiple times. SOLUTION: Reload the app in the
 * browser before testing the updated app.
 *
 * Otherwise, for the whole of its life (while the connection in
 * active) it will not re-render, so the functions will maintain
 * the same scope until the connection is closed.
 * 
 * USAGE
 * ---
 * Call treatMessageListener() from a different script, to register
 * functions in that different script to receive messages which 
 * have a given subject, sender_id or recipient_id.
 * 
 * As a rule, every message that is received will have a 
 * recipients array that contains only the state variable `userId`.
 * The only exception is for the very first message received after
 * the connection is opened. This will have the sender_id "SYSTEM"
 * and the subject "CONNECTION". At this point, userId will not yet
 * have been set, so it is set to the recipients[0] of the incoming
 * message.
 * 
 * As a result, registering messages with recipient_id set to the
 * value for recipients[0] in any preceding message will ensure
 * that all subsequent messages are sent to the registering
 * function.
 */



import {
  createContext,
  useEffect,
  useState,
  useRef
} from 'react'

const HOSTNAME = import.meta.env.VITE_HOSTNAME
const PORT = import.meta.env.VITE_PORT

// Determine the URL to use for WebSocket
const SOCKET_URL = `ws://${HOSTNAME}:${PORT}` // no trailing slash


export const WSContext = createContext()

let renders = 0

export const WSProvider = ({ children }) => {

  const [ socketRequested, setSocketRequested ] = useState(false)
  const [ socketIsOpen, setSocketIsOpen ] = useState(false)
  const [ socketError, setSocketError ] = useState("")
  const [ userIdSet, setUserIdSet ] = useState(false)
  const [ user_name, setUserName ] = useState("")
  
  

  const socketRef = useRef()
  const userRef = useRef()
  const listenersRef = useRef({
    subject:      {},
    sender_id:    {},
    recipient_id: {}
  })

  console.log("render:", ++renders, ", socketRequested:", socketRequested)

  // SOCKET MANAGEMENT // SOCKET MANAGEMENT // SOCKET MANAGEMENT //

  const requestSocket = () => {
    setSocketRequested(true)

    return socketIsOpen
  }


  const openSocket = () => {
    if (!socketRequested) { // wait for a request
      return

    } else if (socketRef.current) { // don't open a socket twice
      return
    }

    console.log("openSocket userRef.current:", userRef.current)

    const socket = new WebSocket(SOCKET_URL)
    // console.log("openSocket")

    socket.onopen = socketOpened
    socket.onerror = socketFail
    socket.onmessage = socketMessage
    socket.onclose = socketClosed

    socketRef.current = socket
  }


  const socketOpened = event => {
    // console.log("SOCKET OPENED")
    setSocketIsOpen(true)
    setSocketError("")
  }


  const socketFail = error => {
    console.error("WSContext SOCKET ERROR\n", error)
    setSocketError(error)
    setSocketIsOpen(false)
    setSocketRequested(false)
  }


  const socketMessage = ({data}) => {
    try {
      const json = JSON.parse(data)
      data = json

    } catch (error) {
      // Leave data as it is? Drop it silently?
      return console.warn("Invalid WS message:", data)
    }

    treatIncoming(data)
  }


  const socketClosed = ({ wasClean }) => {
    const error = wasClean
      ? ""
      : "ERROR: Server is not responding."

    setSocketError(error)
    setSocketIsOpen(false)
    setSocketRequested(false)
    socketRef.current = null

    console.log("socketClosed:", socketClosed, { socketIsOpen, socketError, socketRequested })
  }


  // MESSAGE MANAGEMENT // MESSAGES // MESSAGE MANAGEMENT //

  const treatMessageListener = (action, listener) => {
    // Prepare for the worst
    const error = {
      message: `ERROR from treatMessageListener`,
      action,
      listener
    }

    if (action === "add" || action === "delete") {
      // Only allow actions which match Set methods

      if (Array.isArray(listener)) {
        // Treat an array of listeners one by one
        const errors = []
        const error = listener.forEach( listener => {
          treatMessageListener(action, listener)
        })
        errors.push(error)

        if (errors.find( error => isNaN(error))) { // object found
          return errors
        }

        return 0 // no error: all listeners successfully treated
      }

      // Check that listener is valid, with expected fields
      if (typeof listener === "object") {
        const { callback } = listener

        if (callback instanceof Function) {
          // Register the listener with each key that is provided
          let treated = 0
          const messageListeners = listenersRef.current
          const keys = Object.keys(messageListeners)
          // [ "subject", "sender_id", "recipient_id" ]

          keys.forEach( key => {
            const value = listener[key]
            if (value) {
              const listenerMap = messageListeners[key]
              const listeners = listenerMap[value]
                             || (listenerMap[value] = new Set())
              listeners[action](callback)

              treated += 1
            }
          })

          if (treated) {
            return 0 // no error

          // Error treatment from here on...

          } else {
            error.reason = "listener object must provide at least one of 'subject', 'sender_id' or 'recipient_id'"
          }
        } else {
          error.reason = "listener.callback must be a function"
        }
      } else {
        error.reason = "listener argument must be an object"
      }
    } else {
      error.reason = "action must be 'add' or 'delete'"
    }

    // Log errors elegantly
    const replacer = (key, value) => {
      if (typeof value === "function") {
        return `function ${value.name}()`
      }

      return value
    }

    console.log(JSON.stringify(error, replacer, '  '))

    return error
  }


  const treatIncoming = (message) => {
    // console.log(`** INCOMING **
    // ${JSON.stringify(message, null, 2)}`)

    // The same message is normally handled only once, either for
    // its sender_id (such as "SYSTEM") or for its subject.
    // However this method can handle calls to multiple listeners
    // for the same message, but warns later listeners if th
    // message has already been handled.

    // Treat messages with a sender_id (like "SYSTEM") first
    let listeners
    let handled = false
    let heardBy = 0

    const allListeners = listenersRef.current
    const keys = Object.keys(allListeners)
    // [ "subject", "sender_id", "recipient_id" ]
    keys.forEach( key => {
      listeners = Array.from(
        allListeners[key][message[key]] || []
      )

      handled = listeners.some( listener => (
        listener( message, handled )
        // later listeners may choose to ignore a message that has
        // already been handled
      )) || handled

      heardBy += listeners.length
    })

    if (!heardBy) {
      console.log("Unhandled message:", message);
    }
  }


  // INCOMING MESSAGES // INCOMING MESSAGES // INCOMING MESSAGES //

  const systemConnection = message => {
    userRef.current = message.recipient_id
    setUserIdSet(true) // force re-render

    return true
  }


  const systemLogin = message => {
    const { user_name } = message
    setUserName(user_name)

    // dispatch({
    //   type: "SET_USER_NAME",
    //   payload: user_name
    // })
  }


  const registerConnectionCallback = () => {
    const listeners = [
      {
        subject: "CONNECTION",
        callback: systemConnection
      },
      {
        subject: "LOGGED_IN",
        callback: systemLogin
      }
    ]

    treatMessageListener("add", listeners)

    return () => treatMessageListener("delete", listeners)
  }


  // OUTGOING MESSAGES // OUTGOING MESSAGES // OUTGOING MESSAGES //

  function sendMessage(message) {
    if (typeof message !== "object") { return }
    // Server cannot treat a message that does not have a subject
    // or a recipient_id key/value pair.

    message.sender_id = userRef.current
    // console.log("Sending message:", message)

    message = JSON.stringify(message)
    const socket = socketRef.current

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn(
        "WebSocket FAILED TO SEND MESSAGE\n",
        message,
        "state:", socket?.readyState
      )
      return
    }

    socket.send(message)
  }


  // USEEFFECT //

  useEffect(registerConnectionCallback, [])
  useEffect(openSocket, [socketRequested])



  return (
    <WSContext.Provider
      value ={{
        userId: userRef.current, // updated after re-render
        user_name,
        socketIsOpen,
        socketError,
        requestSocket,
        treatMessageListener,
        sendMessage
      }}
    >
      {children}
    </WSContext.Provider>
  )
}