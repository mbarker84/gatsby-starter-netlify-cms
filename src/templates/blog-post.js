import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { kebabCase } from "lodash";
import Helmet from "react-helmet";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import Content, { HTMLContent } from "../components/Content";

const getLowestPrice = prices => {
  const sortedPrices = prices.map(el => el.price).sort((a, b) => a - b);
  return sortedPrices[0];
};

const gameContent = (item, currency) => {
  const { name, prices, url } = item;

  return (
    <span>
      Lowest price for {name}:{" "}
      <a href={url} rel="noreferrer noopener">
        {getLowestPrice(prices)}
        {currency}
      </a>
    </span>
  );
};

const renderGames = (items, currency) => {
  if (!items.length) return;

  if (items.length > 1) {
    const list = items.map(item => {
      const { name } = item;
      return (
        <li key={name} className="heading-3">
          {gameContent(item, currency)}
        </li>
      );
    });

    return <ul>{list}</ul>;
  }

  return <h4 className="heading-3">{gameContent(items[0])}</h4>;
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
  const [currency, setCurrency] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (gameID) {
      fetch(`https://boardgameprices.co.uk/api/info?id=${gameID}`)
        .then(response => response.json())
        .then(data => {
          setItems(data.items);
          setCurrency(data.currency);
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
            {renderGames(items, currency)}
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
