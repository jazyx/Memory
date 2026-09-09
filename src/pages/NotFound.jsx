/**
 * frontend/src/pages/NotFound.jsx
 * 
 * Simply redirects invalid paths to the root
 */


import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


export default function NotFound(props) {
  const navigate = useNavigate()

  useEffect(() =>  navigate("/"))
}