import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../Context";
import { useSearchParams } from "react-router-dom";

export default function Login() {
  const { name, setName } = useAppContext();
  const [urlQuery, setUrlQuery] = useSearchParams();
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    console.log("register page mounted the DOM with server data >>", name, serverError);

    // setting page error from url and removing it immediately
    if (urlQuery.has("error")) {
      setServerError(urlQuery.get("error") || "");
      urlQuery.delete("error");
      setUrlQuery(urlQuery);
    }
  }, []);

  return (
    <div className="">
      <div className="container">
        <h2>Login</h2>
        <section>{serverError}</section>
        <form action="/api/auth/login" method="POST">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" className="form-control" name="username" />
          </div>
          <div className="form-group">
            <label htmlFor="Password">Password</label>
            <input type="password" className="form-control" name="password" />
          </div>
          <button type="submit" className="btn btn-primary" name="create">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
