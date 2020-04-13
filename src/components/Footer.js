import React from "react";

import "../css/styles.scss";

const Footer = () => {
  const date = new Date();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <small>&copy; Matthew Little {date.getFullYear()}</small>
          <small>
            Website designed and built by{" "}
            <a href="https://michellebarker.co.uk" rel="noreferrer noopener">
              Michelle Barker
            </a>
          </small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
