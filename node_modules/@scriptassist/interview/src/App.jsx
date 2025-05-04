import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import ResourceList from "./components/ResourceList";
import ResourceDetail from "./components/ResourceDetail";
import PrivateRoute from "./components/PrivateRoute";
import Rockets from "./components/Rockets";
import RocketDetail from "./components/RocketsDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />

      <Route
        path="/resources"
        element={
          <PrivateRoute>
            <ResourceList />
          </PrivateRoute>
        }
      />

      <Route
        path="/launch/:id"
        element={
          <PrivateRoute>
            <ResourceDetail />
          </PrivateRoute>
        }
      />

      <Route
        path="/rockets"
        element={
          <PrivateRoute>
            <Rockets />
          </PrivateRoute>
        }
      />

      <Route
        path="/rocket/:id"
        element={
          <PrivateRoute>
            <RocketDetail />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
