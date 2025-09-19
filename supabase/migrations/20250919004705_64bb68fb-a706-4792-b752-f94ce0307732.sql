-- Add booking appointment functionality
-- Create enhanced booking system with more fields and better structure

-- First, let's add more comprehensive booking fields
ALTER TABLE counseling_bookings ADD COLUMN IF NOT EXISTS appointment_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE counseling_bookings ADD COLUMN IF NOT EXISTS session_type TEXT DEFAULT 'individual' CHECK (session_type IN ('individual', 'group', 'crisis'));
ALTER TABLE counseling_bookings ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE counseling_bookings ADD COLUMN IF NOT EXISTS confirmed_by UUID;

-- Create appointments table for confirmed bookings
CREATE TABLE IF NOT EXISTS appointments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID NOT NULL REFERENCES counseling_bookings(id) ON DELETE CASCADE,
    counselor_id UUID,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    location TEXT,
    meeting_link TEXT,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show')),
    reminder_sent_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policies for appointments
CREATE POLICY "Users can view their own appointments" 
ON appointments 
FOR SELECT 
USING (
    booking_id IN (
        SELECT id FROM counseling_bookings WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can update their own appointments" 
ON appointments 
FOR UPDATE 
USING (
    booking_id IN (
        SELECT id FROM counseling_bookings WHERE user_id = auth.uid()
    )
);

-- Add trigger for updated_at on appointments
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically create appointment when booking is confirmed
CREATE OR REPLACE FUNCTION create_appointment_from_booking()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger to auto-create appointments
CREATE TRIGGER create_appointment_on_booking_confirm
    AFTER UPDATE ON counseling_bookings
    FOR EACH ROW
    EXECUTE FUNCTION create_appointment_from_booking();