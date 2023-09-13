-- migrate:up
CREATE TABLE clothes (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(250) NOT NULL,
  information VARCHAR(500) NOT NULL,
  sex VARCHAR(200),
  buying_link VARCHAR(500),
  price DECIMAL(12,2) NOT NULL,
  season_id INT,
  style_id INT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (season_id) REFERENCES seasons(id),
  FOREIGN KEY (style_id) REFERENCES styles(id)
);

-- migrate:down
DROP TABLE clothes;
