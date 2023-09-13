-- migrate:up
CREATE TABLE followers (
  user_id INT,
  followed_id INT,
  UNIQUE (user_id, followed_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (followed_id) REFERENCES users(id)
);

-- migrate:down
DROP TABLE followers;
