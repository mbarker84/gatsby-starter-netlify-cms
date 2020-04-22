import React from "react";
import { Link } from "gatsby";
import TwitterLink from "./TwitterLink";
import "../css/styles.scss";

const Navbar = () => {
  return (
    <header className="navbar">
      <nav className="container" aria-label="main-navigation">
        <div className="navbar__content">
          <h3 className="navbar__logo-wrapper">
            <Link to="/" title="Logo">
              The Gamekeeper
            </Link>
            <span className="navbar__desc">Board game reviews and musings</span>
          </h3>
          <div className="navbar__items">
            <Link to="/about">About</Link>
            <TwitterLink />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
