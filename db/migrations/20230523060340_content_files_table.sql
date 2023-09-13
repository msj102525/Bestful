-- migrate:up
CREATE TABLE content_files (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  feed_id INT NOT NULL,
  content_url VARCHAR(2000) NOT NULL,
  FOREIGN KEY (feed_id) REFERENCES feed(id)
);

-- migrate:down
DROP TABLE content_files;
