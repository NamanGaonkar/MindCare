CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, student_id, university)
  VALUES (
    NEW.id,
    NEW.raw_app_meta_data->>'full_name',
    NEW.email,
    NEW.raw_app_meta_data->>'student_id',
    NEW.raw_app_meta_data->>'university'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;