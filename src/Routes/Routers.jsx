import { Routes, Route } from "react-router-dom";
import NoMatch from "../Pages/NoMatch.jsx";
import UserHome from "../Pages/UserHome.jsx";
import UserLogin from "../Pages/UserLogin.jsx";
import PrivateRoute from "../Components/PrivateRoute.jsx";

const Routers = () => {
  return (
    <Routes>
      <Route path="*" element={<NoMatch />} />
      <Route path="/" element={<UserLogin />} />
      <Route
        path="/userHome"
        element={
          <PrivateRoute>
            <UserHome />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default Routers;
