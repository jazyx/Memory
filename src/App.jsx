/**
 * frontend/src/App.jsx
 */
 
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import './css/App.css'
import Frame from './pages/Frame'
import GameWrapper from './pages/GameWrapper'
import NotFound from './pages/NotFound'
import { Provider } from './state'


function App() {
  return (
    <Router>
      <Provider>
        <Routes>
          <Route path="/" element={<Frame />}>
            <Route
              index
              element={<GameWrapper />}
            />
            <Route
              path="/:name"
              element={<GameWrapper />}
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Provider>
    </Router>
  )
}

export default App