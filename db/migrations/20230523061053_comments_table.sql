-- migrate:up
CREATE TABLE comments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  parents_id INT,
  user_id INT NOT NULL,
  feed_id INT NOT NULL,
  contents VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (feed_id) REFERENCES feed(id),
  FOREIGN KEY (parents_id) REFERENCES comments(id)
);

-- migrate:down
DROP TABLE comments;
