-- Migration: Add full-text search indexes for chat search functionality
-- This migration adds PostgreSQL full-text search capabilities

-- Create a GIN index on chat titles for fast text search
CREATE INDEX IF NOT EXISTS idx_chat_title_gin 
ON "Chat" USING gin(to_tsvector('english', title));

-- Create a GIN index on message content for fast text search
CREATE INDEX IF NOT EXISTS idx_message_content_gin 
ON "Message_v2" USING gin(to_tsvector('english', parts::text));

-- Create a composite index for chat search with relevance scoring
CREATE INDEX IF NOT EXISTS idx_chat_search_composite 
ON "Chat" ("createdAt" DESC, visibility);

-- Create an index on message chatId and createdAt for efficient joins
CREATE INDEX IF NOT EXISTS idx_message_chat_created 
ON "Message_v2" ("chatId", "createdAt" DESC);

-- Create a function to calculate search relevance score
CREATE OR REPLACE FUNCTION calculate_search_relevance(
  chat_title text,
  message_content text,
  search_query text
) RETURNS integer AS $$
BEGIN
  RETURN 
    CASE 
      WHEN LOWER(chat_title) LIKE '%' || LOWER(search_query) || '%' THEN 3
      WHEN LOWER(chat_title) LIKE LOWER(search_query) || '%' THEN 2
      ELSE 1
    END +
    CASE 
      WHEN LOWER(message_content) LIKE '%' || LOWER(search_query) || '%' THEN 2
      ELSE 0
    END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create a function to extract text from message parts JSON
CREATE OR REPLACE FUNCTION extract_message_text(parts_json json) 
RETURNS text AS $$
DECLARE
  result text := '';
  part json;
BEGIN
  FOR part IN SELECT * FROM json_array_elements(parts_json)
  LOOP
    IF part->>'type' = 'text' THEN
      result := result || COALESCE(part->>'text', '') || ' ';
    END IF;
  END LOOP;
  RETURN TRIM(result);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create a materialized view for search optimization (optional)
-- This can be refreshed periodically for better performance
CREATE MATERIALIZED VIEW IF NOT EXISTS chat_search_index AS
SELECT 
  c.id,
  c.title,
  c."createdAt",
  c.visibility,
  c."userId",
  COUNT(m.id) as message_count,
  MAX(m."createdAt") as last_message_at,
  COALESCE(
    (SELECT extract_message_text(m2.parts) 
     FROM "Message_v2" m2 
     WHERE m2."chatId" = c.id 
     ORDER BY m2."createdAt" DESC 
     LIMIT 1), 
    ''
  ) as last_message_text,
  to_tsvector('english', c.title || ' ' || COALESCE(
    (SELECT extract_message_text(m2.parts) 
     FROM "Message_v2" m2 
     WHERE m2."chatId" = c.id 
     ORDER BY m2."createdAt" DESC 
     LIMIT 1), 
    ''
  )) as search_vector
FROM "Chat" c
LEFT JOIN "Message_v2" m ON c.id = m."chatId"
GROUP BY c.id, c.title, c."createdAt", c.visibility, c."userId";

-- Create index on the materialized view
CREATE INDEX IF NOT EXISTS idx_chat_search_vector 
ON chat_search_index USING gin(search_vector);

-- Create a function to refresh the search index
CREATE OR REPLACE FUNCTION refresh_chat_search_index() 
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY chat_search_index;
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON INDEX idx_chat_title_gin IS 'GIN index for fast full-text search on chat titles';
COMMENT ON INDEX idx_message_content_gin IS 'GIN index for fast full-text search on message content';
COMMENT ON INDEX idx_chat_search_composite IS 'Composite index for chat search with relevance scoring';
COMMENT ON INDEX idx_message_chat_created IS 'Index for efficient message-chat joins';
COMMENT ON MATERIALIZED VIEW chat_search_index IS 'Materialized view for optimized chat search with pre-computed search vectors';
COMMENT ON FUNCTION calculate_search_relevance IS 'Function to calculate search relevance score';
COMMENT ON FUNCTION extract_message_text IS 'Function to extract text content from message parts JSON';
COMMENT ON FUNCTION refresh_chat_search_index IS 'Function to refresh the chat search materialized view';
