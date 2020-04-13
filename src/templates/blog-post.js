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

const renderGameInfo = (hasData, url, name, price, currency) => {
  if (hasData) {
    return (
      <h2>
        <a href={url} rel="noopener noreferrer">
          {name}: {price} {currency}
        </a>
      </h2>
    );
  } else {
    return <h2>Fetching latest prices...</h2>;
  }
};

export const BlogPostTemplate = ({
  content,
  contentComponent,
  description,
  tags,
  title,
  helmet,
  date,
  gameID
}) => {
  const PostContent = contentComponent || Content;
  const [name, setName] = useState(null);
  const [price, setPrice] = useState(null);
  const [url, setUrl] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    if (gameID) {
      fetch(`https://boardgameprices.co.uk/api/info?id=${gameID}`)
        .then(response => response.json())
        .then(data => {
          setName(data.items[0].name);
          setPrice(getSortedPrices(data.items[0].prices));
          setUrl(data.items[0].url);
          setCurrency(data.currency);
          setHasData(true);
        });
    }
  }, []);

  return (
    <article className="post">
      {helmet || ""}
      <header className="post__header">
        <div className="post__header-content">
          <div className="container">
            <h1 className="post__title">{title}</h1>
            {renderGameInfo(hasData, url, name, price, currency)}
            <time datetime={date}>{date}</time>
            <p className="post__desc">{description}</p>
          </div>
        </div>
      </header>
      <div className="container-sm">
        <div class="post__content">
          <PostContent content={content} />
          {tags && tags.length ? (
            <div>
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
  const { date, description, title, tags, gameID } = post.frontmatter;

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
        gameID={gameID}
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
        gameID
      }
    }
  }
`;
