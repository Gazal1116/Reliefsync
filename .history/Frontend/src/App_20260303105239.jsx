import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/register";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Make Register the default page */}
        <Route path="/" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;