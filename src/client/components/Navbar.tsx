import React, { useState } from "react";
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { RootState } from "../redux/store";

function Navbar() {
  const [isCollapsed, setIsCollapse] = useState(true);
  const user = useSelector((reduxState: RootState) => reduxState.auth.user);
  console.log(user);

  const dynamicClassName = isCollapsed ? "collapse navbar-collapse" : "navbar-collapse";
  return (
    // <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
    //   <div className="container-fluid">
    //     <a className="navbar-brand" href="#">
    //       Fixed navbar
    //     </a>
    //     <button
    //       onClick={() => setIsCollapse(!isCollapsed)}
    //       className="navbar-toggler"
    //       type="button"
    //       data-bs-toggle="collapse"
    //       data-bs-target="#navbarCollapse"
    //       aria-controls="navbarCollapse"
    //       aria-expanded="false"
    //       aria-label="Toggle navigation"
    //     >
    //       <span className="navbar-toggler-icon"></span>
    //     </button>
    //     <div className={dynamicClassName} id="navbarCollapse">
    //       <ul className="navbar-nav me-auto mb-2 mb-md-0">
    //         <li className="nav-item">
    //           <a className="nav-link active" aria-current="page" href="#">
    //             Home
    //           </a>
    //         </li>
    //         <li className="nav-item">
    //           <a className="nav-link" href="#">
    //             Link
    //           </a>
    //         </li>
    //         <li className="nav-item">
    //           <a className="nav-link disabled">Disabled</a>
    //         </li>
    //       </ul>
    //       <form className="d-flex">
    //         <input className="form-control me-2 rounded-pill bg-dark" type="search" placeholder="Search" aria-label="Search" />
    //         <button className="btn btn-outline-success rounded-pill" type="submit">
    //           <i className="bi bi-search" />
    //         </button>
    //       </form>
    //     </div>
    //   </div>
    // </nav>

    <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark px-0">
      <div className="container-xl">
        {/* <!-- Logo --> */}
        <a className="navbar-brand" href="/">
          <img src="./static/android-chrome-512x512.png" style={{ width: "40px" }} className="h-8" alt="..." />
          <span className="text-white ps-2" style={{ fontSize: "1em" }}>
            Makit
          </span>
        </a>
        {/* <!-- Navbar toggle --> */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        {/* <!-- Collapse --> */}
        <div className="collapse navbar-collapse" id="navbarCollapse">
          {/* <!-- Nav --> */}
          <div className="navbar-nav mx-lg-auto">
            <a className="nav-item nav-link active" href="#" aria-current="page">
              Home
            </a>
            <a className="nav-item nav-link" href="#">
              Product
            </a>
            <a className="nav-item nav-link" href="#">
              Features
            </a>
            <a className="nav-item nav-link" href="#">
              Pricing
            </a>
          </div>
          {/* <!-- Right navigation --> */}
          {!user && (
            <div className="navbar-nav ms-lg-4">
              <a className="nav-item nav-link" href="/login">
                Sign in
              </a>
            </div>
          )}
          {/* <!-- Action --> */}
          {!user && (
            <div className="d-flex align-items-lg-center mt-3 mt-lg-0">
              <a href="/register" className="btn btn-sm btn-primary w-full w-lg-auto">
                Register
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default connect()(Navbar);
