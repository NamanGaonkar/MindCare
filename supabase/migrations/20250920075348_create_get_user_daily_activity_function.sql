CREATE OR REPLACE FUNCTION get_user_daily_activity(user_id_param uuid)
RETURNS TABLE(date text, sessions bigint, posts bigint) AS $$
BEGIN
  RETURN QUERY
  WITH all_dates AS (
    SELECT generate_series(
      date_trunc('day', NOW() - interval '30 day'),
      date_trunc('day', NOW()),
      '1 day'
    )::date AS date
  ),
  daily_sessions AS (
    SELECT
      date_trunc('day', created_at)::date AS date,
      count(*) AS sessions
    FROM chat_sessions
    WHERE user_id = user_id_param
    GROUP BY 1
  ),
  daily_posts AS (
    SELECT
      date_trunc('day', created_at)::date AS date,
      count(*) AS posts
    FROM peer_support_posts
    WHERE user_id = user_id_param
    GROUP BY 1
  )
  SELECT
    to_char(all_dates.date, 'YYYY-MM-DD') as date,
    COALESCE(daily_sessions.sessions, 0) AS sessions,
    COALESCE(daily_posts.posts, 0) AS posts
  FROM all_dates
  LEFT JOIN daily_sessions ON all_dates.date = daily_sessions.date
  LEFT JOIN daily_posts ON all_dates.date = daily_posts.date
  ORDER BY all_dates.date;
END;
$$ LANGUAGE plpgsql;