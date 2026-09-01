import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Checkout from "./Checkout";
import Success from "./Success";
import Settings from "./Settings";
import OnBoarding from "./OnBoarding";
import Payments from "./Payments";
import Subscriptions from "./Subscriptions";

function App() {
  return (
    <Router>
      <nav className="bg-indigo-700 text-white p-4 flex gap-4">
        <Link to="/onboarding" className="hover:underline">
          Onboarding
        </Link>
        <Link to="/payments" className="hover:underline">
          Payments
        </Link>
        <Link to="/subscriptions" className="hover:underline">
          Subscriptions
        </Link>
        <Link to="/checkout" className="hover:underline">
          Checkout
        </Link>
        <Link to="/settings" className="hover:underline">
          Settings
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Settings />} />
        <Route path="/onboarding" element={<OnBoarding />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
