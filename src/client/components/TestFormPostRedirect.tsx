import React from "react";

const TestFormPostRedirect = () => (
  <form method="GET" action="/api/auth/login">
    <button className="btn btn-primary" type="submit">
      Call /api/test
    </button>
  </form>
);

export default TestFormPostRedirect;
