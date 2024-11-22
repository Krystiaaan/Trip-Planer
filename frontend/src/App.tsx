import TripMain from './pages/home/HomePage'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ShowTrip from './pages/home/ShowTrip';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TripMain />} />
        <Route path="/trip/:id" element={<ShowTrip />} />
      </Routes>
    </Router>
  );
};

export default App;