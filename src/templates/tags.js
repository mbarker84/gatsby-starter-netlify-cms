import React from "react";
import Helmet from "react-helmet";
import { Link, graphql } from "gatsby";
import Layout from "../components/Layout";
import "../css/styles.scss";

class TagRoute extends React.Component {
  render() {
    const posts = this.props.data.allMarkdownRemark.edges;
    const postLinks = posts.map((post) => (
      <li className="blog-list__item" key={post.node.fields.slug}>
        <article className="blog-list__article">
          <div className="blog-list__content">
            <h3 className="blog-list__post-heading">
              <Link to={post.node.fields.slug}>
                {post.node.frontmatter.title}
              </Link>
            </h3>
            <time datetime={post.node.frontmatter.date}>
              {post.node.frontmatter.date}
            </time>
            <p>{post.node.excerpt}</p>
          </div>
        </article>
      </li>
    ));
    const tag = this.props.pageContext.tag;
    const title = this.props.data.site.siteMetadata.title;
    const totalCount = this.props.data.allMarkdownRemark.totalCount;
    const tagHeader = `${totalCount} post${
      totalCount === 1 ? "" : "s"
    } tagged with “${tag}”`;

    return (
      <Layout>
        <section className="section">
          <Helmet title={`${tag} | ${title}`} />
          <div className="container-sm">
            <div>
              <h3>{tagHeader}</h3>
              <ul className="tagged-posts__list">{postLinks}</ul>
              <div className="tagged-posts__link">
                <Link className="link link--secondary" to="/tags/">
                  Browse all tags
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }
}

export default TagRoute;

export const tagPageQuery = graphql`
  query TagPage($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          excerpt(pruneLength: 400)
          id
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`;
