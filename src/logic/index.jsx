/**
 * frontend/src/logic/index.jsx
 *
 * description
 */


import { APIProvider, APIContext } from './APIContext'
import { RecordsProvider, RecordsContext } from'./RecordsContext'
import { WSProvider, WSContext } from'./WSContext'


const Provider = ({ children }) => {
  return (
    <APIProvider>
      <RecordsProvider>
        <WSProvider>
          {children}
        </WSProvider>
      </RecordsProvider>
    </APIProvider>
  )
}


export {
  Provider,
  APIContext,
  RecordsContext,
  WSContext
}