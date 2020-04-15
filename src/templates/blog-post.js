import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { kebabCase } from "lodash";
import Helmet from "react-helmet";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import Content, { HTMLContent } from "../components/Content";
import PreviewCompatibleImage from "../components/PreviewCompatibleImage";

const getLowestPrice = (prices) => {
  const sortedPrices = prices.map((el) => el.price).sort((a, b) => a - b);
  return sortedPrices[0];
};

const gameContent = (item, currency) => {
  const { name, prices, url } = item;

  return (
    <span>
      <a href={url} rel="noreferrer noopener">
        {getLowestPrice(prices)}
        {currency}
      </a>
    </span>
  );
};

const renderGames = (items, currency, gameID) => {
  if (gameID && !items.length) {
    return <p className="heading-5 blog-post__error">Loading...</p>;
  }

  if (items === "Failed") {
    return (
      <p className="heading-5 post__error">Could not get price information</p>
    );
  }

  if (!items.length) return;

  if (items.length > 1) {
    const list = items.map((item) => {
      const { name } = item;
      return (
        <li key={name} className="heading-5">
          {gameContent(item, currency)}
        </li>
      );
    });

    return (
      <div>
        <h5>Lowest prices for games in this article:</h5>
        <ul>{list}</ul>
      </div>
    );
  }

  return (
    <p className="heading-5">
      Lowest price for {items[0].name}: {gameContent(items[0], currency)}
    </p>
  );
};

const renderImage = (image, title) => {
  if (!image) return;

  return (
    <div className="post__featured-image">
      <PreviewCompatibleImage
        imageInfo={{
          image: image,
          alt: `featured image thumbnail for post ${title}`,
        }}
      ></PreviewCompatibleImage>
    </div>
  );
};

export const BlogPostTemplate = ({
  content,
  contentComponent,
  description,
  tags,
  title,
  helmet,
  date,
  gameID,
  featuredimage,
}) => {
  const PostContent = contentComponent || Content;
  const [currency, setCurrency] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (gameID) {
      fetch(`https://boardgameprices.co.uk/api/info?id=${gameID}`)
        .then((response) => response.json())
        .then((data) => {
          setItems(data.items);
          setCurrency(data.currency);
        })
        .catch((error) => {
          setItems("Failed");
          console.error("Error:", error);
        });
    }
  }, []);

  return (
    <article className="post">
      {helmet || ""}
      <header className="post__header">
        {renderImage(featuredimage)}
        <div className="post__header-content">
          <div className="container">
            <h1 className="post__title">{title}</h1>
            <time class="post__date" datetime={date}>
              {date}
            </time>
            {gameID && (
              <div className="post__game-info">
                {renderGames(items, currency, gameID)}
              </div>
            )}
            <p className="post__desc">{description}</p>
          </div>
        </div>
      </header>
      <div className="container-sm">
        <div class="post__content">
          <PostContent content={content} />
          {tags && tags.length ? (
            <div className="taglist">
              <h4>Tags</h4>
              <ul className="taglist__list">
                {tags.map((tag) => (
                  <li className="taglist__item" key={tag + `tag`}>
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
  helmet: PropTypes.object,
};

const BlogPost = ({ data }) => {
  const { markdownRemark: post } = data;
  const {
    date,
    description,
    title,
    tags,
    gameID,
    featuredimage,
  } = post.frontmatter;

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
        featuredimage={featuredimage}
      />
    </Layout>
  );
};

BlogPost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
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
        featuredimage {
          childImageSharp {
            fluid(maxWidth: 1600, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`;
