-- migrate:up
ALTER TABLE comments MODIFY COLUMN user_id INT DEFAULT 0;

ALTER TABLE comments MODIFY COLUMN feed_id INT DEFAULT 0;

ALTER TABLE comments MODIFY contents VARCHAR(500) DEFAULT 'default value';
-- migrate:down

