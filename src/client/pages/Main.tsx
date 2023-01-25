import React from "react";
import Footer from "../components/Footer";
import { useAppContext } from "../Context";
import { Route, Routes } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import { RoutesEnum } from "../../../types/enums";
import RegisterConfirm from "./RegisterConfirm";
import Navbar from "../components/Navbar";
import { connect } from "react-redux";

const Main = () => {
  const { name, setName } = useAppContext();

  return (
    <div className="d-flex flex-column" style={{ minHeight: "95vh" }}>
      <Navbar />
      <section className="container-fluid" style={{ flex: 1 }}>
        <div className="row">
          <Routes>
            {/* Do not use Raw Strings as routes. Add it to enums stores in ./types/enums */}
            <Route index element={<div>Home Page</div>} />
            <Route path="/register-confirm" element={<RegisterConfirm />} />
            <Route path={RoutesEnum.REGISTER} element={<Register />} />
            <Route path={RoutesEnum.LOGIN} element={<Login />} />
            {/* <Route path='/create-listing' element={<ProtectedRoute roles={['standard', 'admin', 'moderator']}><ItemCreate /></ProtectedRoute>} /> */}
            <Route path="/item">
              <Route path=":itemId" element={<div>Item Number</div>} />
            </Route>
            <Route path="*" element={<p>Theres nothing here: 404!</p>} />
          </Routes>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default connect()(Main);
