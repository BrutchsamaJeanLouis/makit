import React, { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { useAppContext } from "../Context";
import { Route, Routes, useSearchParams } from "react-router-dom";
import Register from "./Register";
import stringToBoolean from "../../sharedFuncs/stringToBoolean";
import Login from "./Login";
import { RoutesEnum } from "../../../types/enums";
import axios from "axios";
import RegisterConfirm from "./RegisterConfirm";

const Main = () => {
  const { name, setName } = useAppContext();

  return (
    <div className="flex bg-white-100 font-sans items-center flex-col justify-between h-screen">
      <div className="flex items-center flex-col pt-10">
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
      <Footer />
    </div>
  );
};

export default Main;
