-- migrate:up
CREATE TABLE seasons (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  seasons VARCHAR(200) NOT NULL
);

-- migrate:down
DROP TABLE seasons;
