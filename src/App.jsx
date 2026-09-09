/**
 * frontend/src/App.jsx
 */
 
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import './css/App.css'
import Home from './pages/Home'
import Memory from './pages/Memory'
import { Page1 } from './pages/Archive/Page1'
import { NotFound } from './pages/Archive/NotFound'
import { Provider } from './logic'


function App() {
  return (
    <Router>
      <Provider>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/memory"   element={<Memory />} />
          <Route path="/page1"   element={<Page1 />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Provider>
    </Router>
  )
}

export default App