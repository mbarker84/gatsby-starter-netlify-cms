import React from "react";
import { Link } from "gatsby";
import PreviewCompatibleImage from "./PreviewCompatibleImage";

import "../css/styles.scss";

const renderImage = (image, title) => {
  if (!image) return;

  return (
    <div className="featured__image">
      <PreviewCompatibleImage
        imageInfo={{
          image: image,
          alt: `featured image thumbnail for post ${title}`
        }}
      ></PreviewCompatibleImage>
    </div>
  );
};

const FeaturedArticle = props => {
  const { title, featuredImage, date, slug, excerpt } = props;

  console.log(featuredImage);

  return (
    <article className="featured">
      <div className="container">
        {renderImage(featuredImage, title)}
        <div className="featured__content">
          <h3 className="featured__sm-title">Latest</h3>
          <div className="featured__heading">
            <h2 className="heading-1 featured__title">
              <Link to={slug}>{title}</Link>
            </h2>
            <time datetime={date}>{date}</time>
          </div>
          <div className="featured__body">
            <p>{excerpt}</p>
            <Link to={slug}>Read more</Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default FeaturedArticle;
