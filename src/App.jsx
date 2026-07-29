import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Checkout from "./Checkout";
import Success from "./Success";
import Settings from "./Settings";

function App() {
  return (
    <Router>
      <nav className="bg-indigo-700 text-white p-4 flex gap-4">
        <Link to="/checkout" className="hover:underline">
          Checkout
        </Link>
        <Link to="/settings" className="hover:underline">
          Settings
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Settings />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
