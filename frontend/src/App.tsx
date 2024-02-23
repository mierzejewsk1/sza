import "./index.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Inhabitant from "./pages/Dashboards/Inhabitant";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/LoginPage";
import { useAuth } from "./context/AuthContext";
import { USER_TYPES } from "./config/Enum";
import Administrator from "./pages/Dashboards/Administrator";
import Conservator from "./pages/Dashboards/Conservator";
import Recepcionist from "./pages/Dashboards/Recepcionist";
import Faults from "./pages/Faults";
import RoomSelect from "./pages/RoomSelect";

function App() {
  const { user, isRestoreFinished, authActions } = useAuth();

  useEffect(() => {
    authActions.restore();
  }, []);

  return (
    <>
      <BrowserRouter>
        {isRestoreFinished ? (
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/dashboard"
              element={
                user && user.userTypeName === USER_TYPES.INHABITANT ? (
                  <Inhabitant />
                ) : user && user.userTypeName === USER_TYPES.ADMIN ? (
                  <Administrator />
                ) : user && user.userTypeName === USER_TYPES.CONSERVATOR ? (
                  <Conservator />
                ) : user && user.userTypeName === USER_TYPES.RECEPCIONIST ? (
                  <Recepcionist />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/faults"
              element={user ? <Faults /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/rooms"
              element={user ? <RoomSelect /> : <Navigate to="/dashboard" />}
            />
          </Routes>
        ) : null}
      </BrowserRouter>
    </>
  );
}

export default App;
