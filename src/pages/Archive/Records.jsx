/**
 * frontend/src/pages/Records.jsx
 */

import { useContext, useState } from "react";
import { Link } from 'react-router-dom'
import { RecordsContext } from "../../logic";


export const Records = () => {
  const { records, addRecord } = useContext(RecordsContext)
  const [ title, setTitle ] = useState("")
  const [ message, setMessage ] = useState("")
  
  
  const treatChange = ({ target }) => {
    const { name, value } = target
    if (name === "title") {
      setTitle(value)

    } else {
      setMessage(value)
    }
  }


  const submitRecord = event => {
    event.preventDefault() // don't reload the page

    addRecord({ title, message })

    // Reset form values
    setTitle("")
    setMessage("")
  }


  const recordList = records.map( record => (
    <li
      key={record._id}
    >
      <h3 className="title">{record.title}</h3>
      <span className="message">"{record.message}"</span>
    </li>
  ))


  const disabled = !title || !message


  const form = (
    <form>
      <h3>Add a Record</h3>
      <label>
        <span>Title:</span>
        <input 
          type="text" 
          name="title" 
          placeholder="title"
          value={title}
          onChange={treatChange}
        />
      </label>
      <label>
        <span>Message:</span>
        <input 
          type="text" 
          name="message"
          placeholder="message"
          value={message}
          onChange={treatChange}
        />
      </label>
      <button
        disabled={disabled}
        onClick={submitRecord}
      >
        Submit
      </button>
    </form>
  )


  return (
    <main id="records">
      <h1>Records goes here</h1>
      <ol>
        {recordList}
      </ol>
      {form}
      <Link to="/page1" draggable="false">Page 1</Link>
      <Link to="/page2" draggable="false">Page 2</Link>
      <Link to="/chat"  draggable="false">Chat</Link>
    </main>
  );
};
