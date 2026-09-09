/**
 * Project/frontend/src/contexts/Messages.jsx
 */


const getTime = ( time_stamp ) => {
  const date = new Date(time_stamp)
  let MM = date.getMinutes()
  if (MM < 10) {
    MM = "0" + MM
  }
  return date.getHours() + `:${MM}`
}


export const Messages = ({ messages, userId }) => {

  const messageList = messages.map( message => {
    const {
      sender_id,
      sender_name,
      content,
      time_stamp,
      recipients // [{ name: <string>, confirmed: <boolean> }, ...]
    } = message


    // TODO: Create :hover tooltip with recipient names, where
    // confirmed recipients are shown in bold.

    let [className, time ] = time_stamp
      ? ["acknowledged", getTime(time_stamp)]
      : ["", ""]

    if (sender_id === userId) {
      const confirmed = recipients.reduce(
        ( confirmed, recipientData ) => {
          confirmed[1] += 1 // set total of recipients
          confirmed[0] += !!recipientData.confirmed // true => +1
          return confirmed
      }, [0, 0])

      if (confirmed[0]) {
        // At least one recipient confirmed reception
        className += ((confirmed[0] === confirmed[1])
          ? " all"
          : " some"
        )
      }

      className = className.trim() // remove leading space
      if ( !className || !recipients.length ) {
        // Server has not acknowledged sent message, or message
        // was not sent by this user. Don't show confirmations.
        className = null // never create a class of ""
      }

    } else {
      // Don't show acknowledgement or confirmation in recipient
      className = null
    }


    return (
      <li
        key={message.message_id}
        className={className}
      >
        <p className="sender">
          {sender_name || "Me"}
          <span className="time">
            {time}
          </span>
        </p>
        <p className="message">
          <span className="text">
            {content.text}
          </span>
        </p>
      </li>
    )
  })

  if (!messageList.length) {
    messageList.push("No messages yet")
  }


  return (
    <ul className="messages">
      {messageList}
    </ul>
  )
}