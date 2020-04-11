import React from "react";
import { Link } from "gatsby";
import "../css/styles.scss";

const Navbar = () => {
  return (
    <header>
      <nav className="container" aria-label="main-navigation">
        <div className="navbar__content">
          <div className="navbar__logo-wrapper">
            <Link to="/" title="Logo">
              The Gamekeeper
            </Link>
          </div>
          <div className="navbar__items">
            <Link to="/about">About</Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
