import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/register";
import Login from "./components/login";
import ReliefRequests from "./components/reliefrequest";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Make Register the default page */}
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;