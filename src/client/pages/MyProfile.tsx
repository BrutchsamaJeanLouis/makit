import React from "react";
import { useSelector, connect } from "react-redux";
import { RootState } from "../redux/store";

const MyProfile = props => {
  const user: any = useSelector((rootState: RootState) => rootState.auth.user);

  //TODO design myProfile Section. similar to a dashboard
  // shows project posted (concat like a box with number)
  return (
    <div>
      <h5>My Profile {user && user.username}</h5>
    </div>
  );
};

export default connect()(MyProfile);
