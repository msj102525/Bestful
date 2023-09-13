-- migrate:up
CREATE TABLE tags (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  content_file_id INT NOT NULL,
  cloth_id INT NOT NULL,
  coordinate_x VARCHAR(200),
  coordinate_y VARCHAR(200),
  contents VARCHAR(500),
  FOREIGN KEY (content_file_id) REFERENCES content_files(id),
  FOREIGN KEY (cloth_id) REFERENCES clothes(id)
);

-- migrate:down
DROP TABLE tags;
