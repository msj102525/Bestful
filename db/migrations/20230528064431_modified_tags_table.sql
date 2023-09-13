-- migrate:up
ALTER TABLE tags MODIFY COLUMN coordinate_x INT;

ALTER TABLE tags MODIFY COLUMN coordinate_y INT;

-- migrate:down

