import React from "react";
import { Footer } from "../components/Footer";
import { useAppContext } from "../Context";
import { Route, Routes } from "react-router-dom";
import TestFormPostRedirect from "../components/TestFormPostRedirect";

const Main = () => {
  const { name, setName } = useAppContext();

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
          <Route path="/sign-up" element={<div>Sign up</div>} />
          <Route path="/login" element={<TestFormPostRedirect />} />
          {/* <Route path='/create-listing' element={<ProtectedRoute roles={['standard', 'admin', 'moderator']}><ItemCreate /></ProtectedRoute>} /> */}
          <Route path="/item">
            <Route path=":itemId" element={<div>Item Number</div>} />
          </Route>
          <Route index element={<div>Home Page</div>} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default Main;
