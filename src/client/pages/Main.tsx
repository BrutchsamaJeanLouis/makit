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

const Main = () => {
  const { name, setName } = useAppContext();

  useEffect(() => {
    verifyAuthState();
  }, []);

  return (
    <div className="d-flex flex-column" style={{ minHeight: "95vh" }}>
      <Navbar />
      <section className="container-fluid" style={{ flex: 1 }}>
        <div className="row">
          <Routes>
            {/* Do not use Raw Strings as routes. Add it to enums stores in ./utils/enums */}
            {/* TODO add all URLS in the enum and replace them on server and client */}
            <Route index element={<div>Home Page</div>} />
            <Route path="/register-confirm" element={<RegisterConfirm />} />
            <Route path={RoutesEnum.REGISTER} element={<RequireLogout view={<Register />} />} />
            <Route path={RoutesEnum.LOGIN} element={<RequireLogout view={<Login />} />} />
            <Route path="/create-post" element={<RequireLogin view={<CreatePost />} />} />
            <Route path="/my-profile" element={<RequireLogin view={<MyProfile />} />} />
            {/* <Route path="/item">
              <Route path=":itemId" element={<div>Item Number</div>} />
            </Route> */}
            <Route path="*" element={<p>Theres nothing here: 404!</p>} />
          </Routes>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default connect()(Main);
