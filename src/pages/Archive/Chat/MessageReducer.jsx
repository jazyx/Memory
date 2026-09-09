/**
 * MessageReducer.jsx
 * 
 * Use useReducer when:
 * + The next state depends on the previous state
 * + The state is complex
 * + You want to keep business logic:
 *   + as a pure function
 *   + in a separate module
 * + You want to be able to test easily
 */


const initialState = {
  messages: []
}


const reducer = (state, action) => {
  const { type, payload } = action
  
  switch (type) {
    case "ADD_MESSAGE":
      return addMessage(state, payload)

    case "ACKNOWLEDGE_MESSAGE":
      return acknowledgeMessage(state, payload)

    case "CONFIRM_MESSAGE_READ":
      return confirmMessageRead(state, payload)

    default:
      return {...state}
  }
}


function addMessage( state, message ) {
  let { messages } = state

  // Convert recipients array of names to map of confirmation times
  message.recipients = message.recipients
    .reduce(( map, name ) => {
      map[name] = false // receipt not confirmed yet
      return map
    }, {})
  messages = [...messages, message]

  return { ...state, messages }
}


function acknowledgeMessage( state, message ) {
  let { messages } = state
  const { message_id, time_stamp } = message

  // Recreate messages at a new RAM address (semi-clone),
  // with time_stamp added to the appropriate message
  messages = messages.map( message => {
    if (message.message_id === message_id) {
      message.time_stamp = time_stamp
      return { ...message }
    }
    
    return message
  })

  return { ...state, messages }
}


function confirmMessageRead( state, message ) {
  let { messages } = state
  const { message_id, sender_id, sender_name } = message

  // Recreate messages at a new RAM address (semi-clone), with
  // time_stamp set 
  messages = messages.map( message => {
    if (message.message_id === message_id) {
      const recipients = message.recipients
      // Set the confirmation time for the given recipient, unless
      // this is already set
      if (recipients[sender_id] === false) {
        recipients[sender_id] = time_stamp
      } else if (recipients[sender_name] === false) {
        recipients[sender_name] = time_stamp
      }
      
      return { ...message }
    }
    
    return message
  })

  return { ...state, messages }
}


export { reducer, initialState }
