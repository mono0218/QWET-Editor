import { Routes, Route } from "react-router-dom";
import ListenerPage from "./page/listener/page.tsx";
import LiverPage from "./page/liver/page.tsx"

function App() {
  return (
      <Routes>
          <Route path="/live/listener" element={ <ListenerPage /> } />

          <Route path="/live/liver" element={ <LiverPage /> } />
      </Routes>
  )
}

export default App
