CREATE OR REPLACE FUNCTION get_total_students()
RETURNS integer AS $$
BEGIN
  RETURN (SELECT count(*) FROM auth.users);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_session_trends()
RETURNS TABLE(date text, sessions bigint) AS $$
BEGIN
  RETURN QUERY
  WITH all_dates AS (
    SELECT generate_series(
      date_trunc('day', NOW() - interval '6 day'),
      date_trunc('day', NOW()),
      '1 day'
    )::date AS date
  ),
  daily_sessions AS (
    SELECT
      date_trunc('day', created_at)::date AS date,
      count(*) AS sessions
    FROM chat_sessions
    GROUP BY 1
  )
  SELECT
    to_char(all_dates.date, 'Dy') as date,
    COALESCE(daily_sessions.sessions, 0) AS sessions
  FROM all_dates
  LEFT JOIN daily_sessions ON all_dates.date = daily_sessions.date
  ORDER BY all_dates.date;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_booking_types()
RETURNS TABLE(type text, count bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT
    booking_type,
    count(*)
  FROM counseling_bookings
  GROUP BY 1;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_mood_distribution()
RETURNS TABLE(mood_range text, count bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT
    CASE
      WHEN mood_rating BETWEEN 1 AND 3 THEN '1-3 (Low)'
      WHEN mood_rating BETWEEN 4 AND 6 THEN '4-6 (Medium)'
      WHEN mood_rating BETWEEN 7 AND 10 THEN '7-10 (High)'
    END AS mood_range,
    count(*)
  FROM chat_sessions
  WHERE mood_rating IS NOT NULL
  GROUP BY 1;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_platform_health()
RETURNS json AS $$
BEGIN
  RETURN json_build_object(
    'resource_usage', '5 available',
    'crisis_response', 'All Clear',
    'system_status', 'Operational'
  );
END;
$$ LANGUAGE plpgsql;
