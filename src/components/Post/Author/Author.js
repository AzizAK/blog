// @flow
import React from "react";
import { getContactHref } from "../../../utils";
import styles from "./Author.module.scss";
import { useSiteMetadata } from "../../../hooks";

const Author = () => {
  const { author } = useSiteMetadata();

  return (
    <div className={styles["author"]}>
      <p className={styles["author__bio"]}>
        {author.bio}
        <a
          className={styles["author__bio-twitter"]}
          href={getContactHref("twitter", author.contacts.twitter)}
          rel="noopener noreferrer"
          target="_blank"
        >
          تجدني في تويتر <strong>{author.name}</strong>
        </a>
      </p>
    </div>
  );
};

export default Author;
