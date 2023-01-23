import React from "react";

export const Footer = () => {
  return (
    <footer className={"justify-center items-center"}>
      &copy; {new Date().getFullYear()} - <a href="#">My Footer</a> -{" "}
      <a className={"p-1"} href="#">
        Link
      </a>
    </footer>
  );
};
