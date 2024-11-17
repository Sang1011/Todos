import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "../src/components/Login";
import Todos from "../src/components/Todos"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="/" element={<Todos />} />
      </Routes>
    </Router>
  );
}

export default App;
