/**
 * frontend/src/pages/Page1.jsx
 */


import { Link } from 'react-router-dom'
import { Ping } from '../../components/Ping'


export const Page1 = (props) => {
  return (
    <main>
      <h1>Page 1 goes here</h1>
      <img src="/nodoc.svg" alt="don't read docs"></img>
      <Ping />
      <Link to="/page2"   draggable="false">Page 2</Link>
      <Link to="/records" draggable="false">Records</Link>
      <Link to="/chat"    draggable="false">Chat</Link>
    </main>
  )
}