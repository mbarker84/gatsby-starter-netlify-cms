import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import "../css/styles.scss";

const NotFoundPage = () => (
  <Layout>
    <div className="container section">
      <h1 className="post__title">404: Page not found</h1>
      <Link className="link link--secondary" to={`/`}>
        Back to homepage
      </Link>
    </div>
  </Layout>
);

export default NotFoundPage;
