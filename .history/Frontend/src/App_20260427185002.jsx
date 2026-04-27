import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Register from "./components/register";
import Login from "./components/login";
import ReliefRequests from "./components/reliefrequest";
import Profile from "./components/profile";
import RequestDetails from "./components/requestdetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ReliefRequests />} />
        <Route path="/request/:id" element={<RequestDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/request" element={<ReliefRequests />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;