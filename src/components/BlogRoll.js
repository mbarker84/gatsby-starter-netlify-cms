import React from "react";
import PropTypes from "prop-types";
import { Link, graphql, StaticQuery } from "gatsby";
import PreviewCompatibleImage from "./PreviewCompatibleImage";

class BlogRoll extends React.Component {
  render() {
    const { data } = this.props;
    let { edges: posts } = data.allMarkdownRemark;

    posts = posts.filter((el, index) => index !== 0);

    return (
      <ul className="blog-list">
        {posts &&
          posts.map(({ node: post }) => (
            <li className="blog-list__item" key={post.id}>
              <article className="blog-list__article">
                {post.frontmatter.featuredimage ? (
                  <div className="blog-list__img-wrapper">
                    <PreviewCompatibleImage
                      imageInfo={{
                        image: post.frontmatter.featuredimage,
                        alt: `featured image thumbnail for post ${post.frontmatter.title}`
                      }}
                    />
                  </div>
                ) : null}
                <div>
                  <h3 className="blog-list__post-heading">
                    <Link to={post.fields.slug}>{post.frontmatter.title}</Link>
                  </h3>
                  <time datetime={post.frontmatter.date}>
                    {post.frontmatter.date}
                  </time>
                  <p>{post.excerpt}</p>
                  <Link className="link link--secondary" to={post.fields.slug}>
                    Keep Reading →
                  </Link>
                </div>
              </article>
            </li>
          ))}
      </ul>
    );
  }
}

BlogRoll.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array
    })
  })
};

export default () => (
  <StaticQuery
    query={graphql`
      query BlogRollQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
        ) {
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
                featuredpost
                featuredimage {
                  childImageSharp {
                    fluid(maxWidth: 120, quality: 100) {
                      ...GatsbyImageSharpFluid
                    }
                  }
                }
              }
            }
          }
        }
      }
    `}
    render={(data, count) => <BlogRoll data={data} count={count} />}
  />
);
