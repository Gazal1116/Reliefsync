import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Register from "./components/register";
import Login from "./components/login";
import ReliefRequests from "./components/reliefrequest";
import Profile from "./components/profile";
import RequestDetails from "./components/requestdetails";
import RequesterDashboard from "./components/RequesterDashboard";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["volunteer"]}>
              <ReliefRequests />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["requester"]}>
              <RequesterDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/request/:id"
          element={
            <RoleProtectedRoute allowedRoles={["requester", "volunteer"]}>
              <RequestDetails />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <RoleProtectedRoute allowedRoles={["requester", "volunteer"]}>
              <Profile />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/request"
          element={
            <RoleProtectedRoute allowedRoles={["volunteer"]}>
              <ReliefRequests />
            </RoleProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;