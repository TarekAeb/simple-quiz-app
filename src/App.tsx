import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Game from './components/Game';
import TeamRoutes from './components/TeamRoutes';
import PeerDebug from './components/PeerDebug';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/join/:gameCode" element={<TeamRoutes />} />
        <Route path="/join/:gameCode/:teamId" element={<TeamRoutes />} />
        <Route path="/peerdebug" element={<PeerDebug />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;