import React, { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { useAppContext } from "../Context";
import { Route, Routes, useSearchParams } from "react-router-dom";
import TestFormPostRedirect from "../components/TestFormPostRedirect";
import Register from "./Register";
import stringToBoolean from "../../sharedFuncs/stringToBoolean";

const Main = () => {
  const { name, setName } = useAppContext();
  const [urlQuery, setUrlQuery] = useSearchParams();
  const [serverError, setServerError] = useState("");
  const error: string = urlQuery.get("error") || "";
  const didRequestSucceed = stringToBoolean(urlQuery.get("valid"));

  const fetchTest = () => {
    fetch("/api/test")
      .then(res => res)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };

  return (
    <div className="flex bg-white-100 font-sans items-center flex-col justify-between h-screen">
      <div className="flex items-center flex-col pt-10">
        <Routes>
          <Route index element={<div>Home Page</div>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<TestFormPostRedirect />} />
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
