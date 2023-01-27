import React, { useEffect } from "react";
import Footer from "../components/Footer";
import { useAppContext } from "../Context";
import { Route, Routes } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import { RoutesEnum } from "../../utils/enums";
import RegisterConfirm from "./RegisterConfirm";
import Navbar from "../components/Navbar";
import { connect } from "react-redux";
import RequireLogin from "../components/RequireLogin";
import CreatePost from "../components/CreatePost";
import RequireLogout from "../components/RequireLogout";
import MyProfile from "./MyProfile";
import verifyAuthState from "../../utils/verifyAuthState";
import { useState } from "react";
import axios from "axios";
const threeMinute = 180000;

const Main = () => {
  const { name, setName } = useAppContext();
  const [loadingCredentials, setLoadingCredentials] = useState(true);

  useEffect(() => {
    verifyAuthState()
      .then(() => setLoadingCredentials(false))
      .catch(() => setLoadingCredentials(false));

    const interval = setInterval(async () => {
      await axios.get("/api/auth/refresh-perms").then(() => console.log(`${Date.now} - refresh user permissions`));
    }, threeMinute);

    return () => clearInterval(interval);
  }, []);

  if (loadingCredentials) {
    return (
      <div className="d-flex w-100 h-100 justify-content-center">
        <div className="spinner-border text-danger" role="status" />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column" style={{ minHeight: "95vh" }}>
      <Navbar />
      <section className="container-fluid" style={{ flex: 1 }}>
        <div className="row">
          <Routes>
            {/* Do not use Raw Strings as routes. Add it to enums stored in ./utils/enums */}
            {/* TODO add all URLS in the enum and replace them on server and client */}
            <Route index element={<div>Home Page</div>} />
            <Route path={RoutesEnum.REGISTERCONFIRM} element={<RegisterConfirm />} />
            <Route path={RoutesEnum.REGISTER} element={<RequireLogout view={<Register />} />} />
            <Route path={RoutesEnum.LOGIN} element={<RequireLogout view={<Login />} />} />
            <Route path="/list-project" element={<RequireLogin view={<CreatePost />} />} />
            <Route path={RoutesEnum.MYPROFILE} element={<RequireLogin view={<MyProfile />} />} />
            <Route path="/project/:projectId" element={<div>Item Number</div>} />
            <Route path="*" element={<p>Theres nothing here: 404!</p>} />
          </Routes>
        </div>
      </section>

      <Footer />
    </div>
  );
};
{
  /* <Route path="/project">
      <Route path=":projectId" element={<div>Item Number</div>} />
    </Route> */
}

export default connect()(Main);
