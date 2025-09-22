-- Ensure all existing users have a role assigned
INSERT INTO user_roles (user_id, role)
SELECT auth.users.id, 'user'::app_role
FROM auth.users 
LEFT JOIN user_roles ON auth.users.id = user_roles.user_id
WHERE user_roles.user_id IS NULL;