import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { kebabCase } from "lodash";
import Helmet from "react-helmet";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import Content, { HTMLContent } from "../components/Content";

const getSortedPrices = prices => {
  const sortedPrices = prices.map(el => el.price).sort((a, b) => a - b);
  return sortedPrices[0];
};

export const BlogPostTemplate = ({
  content,
  contentComponent,
  description,
  tags,
  title,
  helmet,
  date
}) => {
  const PostContent = contentComponent || Content;
  const [gameInfo, setGameInfo] = useState(0);
  const [name, setName] = useState(0);
  const [price, setPrice] = useState(0);
  const [url, setUrl] = useState(0);
  const [currency, setCurrency] = useState(0);

  const id = 12;

  useEffect(() => {
    fetch(`https://boardgameprices.co.uk/api/info?id=${id}`)
      .then(response => response.json())
      .then(data => {
        setGameInfo(data);
        setName(data.items[0].name);
        setPrice(getSortedPrices(data.items[0].prices));
        setUrl(data.items[0].url);
        setCurrency(data.currency);
      });
  }, []);

  console.log(gameInfo);

  return (
    <article className="post">
      {helmet || ""}
      <header className="post__header">
        <div className="post__header-content">
          <div className="container">
            <h1 className="post__title">{title}</h1>
            <h2>
              <a href={url} rel="noopener noreferrer">
                {name}: {price} {currency}
              </a>
            </h2>
            <time datetime={date}>{date}</time>
            <p className="post__desc">{description}</p>
          </div>
        </div>
      </header>
      <div className="container-sm">
        <div>
          <PostContent content={content} />
          {tags && tags.length ? (
            <div style={{ marginTop: `4rem` }}>
              <h4>Tags</h4>
              <ul className="taglist">
                {tags.map(tag => (
                  <li key={tag + `tag`}>
                    <Link
                      to={`/tags/${kebabCase(tag)}/`}
                      className="link link--secondary"
                    >
                      {tag}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
};

BlogPostTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  title: PropTypes.string,
  helmet: PropTypes.object
};

const BlogPost = ({ data }) => {
  const { markdownRemark: post } = data;
  const { date, description, title, tags } = post.frontmatter;

  return (
    <Layout>
      <BlogPostTemplate
        content={post.html}
        contentComponent={HTMLContent}
        description={description}
        helmet={
          <Helmet titleTemplate="%s | Blog">
            <title>{`${title}`}</title>
            <meta name="description" content={`${description}`} />
          </Helmet>
        }
        tags={tags}
        title={title}
        date={date}
      />
    </Layout>
  );
};

BlogPost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object
  })
};

export default BlogPost;

export const pageQuery = graphql`
  query BlogPostByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        description
        tags
      }
    }
  }
`;
