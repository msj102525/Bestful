-- migrate:up
ALTER TABLE likes ADD CONSTRAINT unique_user_feed UNIQUE(user_id,feed_id)

-- migrate:down

