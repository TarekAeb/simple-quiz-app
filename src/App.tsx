import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Game from './components/Game';
import TeamRoutes from './components/TeamRoutes';
// Other imports

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/join/:gameCode" element={<TeamRoutes />} />
        {/* Other routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;