// @ts-ignore
import React, { ReactElement } from "React";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { connect } from "react-redux";

interface ProtectedRouteProps {
  element: ReactElement;
}

const ProtectRoute: React.FC<ProtectedRouteProps> = ({ element }: { element: ReactElement<any> }) => {
  const user = useSelector((rootState: RootState) => rootState.auth.user);

  if (!user) {
    return <Navigate to="/login?error=login to complete operation" replace />;
  }

  return element;
};

export default connect()(ProtectRoute);
