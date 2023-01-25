// @ts-ignore
import React, { ReactElement, useEffect, useState } from "React";
import { Navigate } from "react-router-dom";
import { store } from "../redux/store";
import { connect } from "react-redux";
import verifyAuthState from "../../utils/verifyAuthState";

interface ComponentProps {
  view: ReactElement;
}

const RequireLogin: React.FC<ComponentProps> = ({ view }: { view: ReactElement<any> }) => {
  // const user = useSelector((rootState: RootState) => rootState.auth.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyAuthState().then(() => setLoading(false));
  }, []);

  const authState = store.getState().auth;

  if (loading) {
    // TODO replace with loading component
    return <div>loading</div>;
  }

  if (!authState.user) {
    return <Navigate to="/login?error=login to complete operation" replace />;
  }

  return view;
};

export default connect()(RequireLogin);
