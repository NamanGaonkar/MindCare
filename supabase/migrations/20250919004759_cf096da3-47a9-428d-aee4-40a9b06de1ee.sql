-- Fix the function search path security issue
CREATE OR REPLACE FUNCTION create_appointment_from_booking()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
    -- When booking status changes to 'confirmed' and appointment_date is set
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' AND NEW.appointment_date IS NOT NULL THEN
        INSERT INTO appointments (
            booking_id,
            appointment_date,
            duration_minutes,
            status
        ) VALUES (
            NEW.id,
            NEW.appointment_date,
            CASE 
                WHEN NEW.session_type = 'crisis' THEN 90
                WHEN NEW.session_type = 'group' THEN 120
                ELSE 60
            END,
            'scheduled'
        );
    END IF;
    
    RETURN NEW;
END;
$$;