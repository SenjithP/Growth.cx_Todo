import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

function UserPrivateRoute({ children }) {
  const userEmail = localStorage.getItem("email");
  return userEmail ? <>{children}</> : <Navigate to="/" />;
}

UserPrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserPrivateRoute;
