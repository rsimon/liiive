-- Monthly room statistics table
CREATE TABLE room_stats (
    year INT NOT NULL,
    month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    rooms_created INT DEFAULT 0,
    rooms_deleted INT DEFAULT 0,
    presentation_v2_count INT DEFAULT 0,
    presentation_v3_count INT DEFAULT 0,
    image_v2_count INT DEFAULT 0,
    image_v3_count INT DEFAULT 0,
    PRIMARY KEY (year, month)
);

ALTER TABLE room_stats ENABLE ROW LEVEL SECURITY;

-- Function to increment room stats
CREATE OR REPLACE FUNCTION increment_room_stats()
RETURNS TRIGGER
SET search_path = public
AS $$
DECLARE
    current_year INT;
    current_month INT;
BEGIN
    -- Get current year and month
    SELECT EXTRACT(YEAR FROM CURRENT_TIMESTAMP)::INT, 
           EXTRACT(MONTH FROM CURRENT_TIMESTAMP)::INT 
    INTO current_year, current_month;

    -- Ensure stats record exists for current month
    INSERT INTO room_stats (year, month)
    VALUES (current_year, current_month)
    ON CONFLICT (year, month) DO NOTHING;

    -- Update stats based on the new room
    UPDATE room_stats 
    SET 
        rooms_created = rooms_created + 1,
        presentation_v2_count = presentation_v2_count + 
            CASE WHEN NEW.iiif_type = 'MANIFEST' AND NEW.major_version = 2 THEN 1 ELSE 0 END,
        presentation_v3_count = presentation_v3_count + 
            CASE WHEN NEW.iiif_type = 'MANIFEST' AND NEW.major_version = 3 THEN 1 ELSE 0 END,
        image_v2_count = image_v2_count + 
            CASE WHEN NEW.iiif_type = 'IMAGE' AND NEW.major_version = 2 THEN 1 ELSE 0 END,
        image_v3_count = image_v3_count + 
            CASE WHEN NEW.iiif_type = 'IMAGE' AND NEW.major_version = 3 THEN 1 ELSE 0 END
    WHERE year = current_year AND month = current_month;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment deletion stats
CREATE OR REPLACE FUNCTION increment_room_deletion_stats()
RETURNS TRIGGER
SET search_path = public
AS $$
DECLARE
    current_year INT;
    current_month INT;
BEGIN
    -- Get current year and month
    SELECT EXTRACT(YEAR FROM CURRENT_TIMESTAMP)::INT, 
           EXTRACT(MONTH FROM CURRENT_TIMESTAMP)::INT 
    INTO current_year, current_month;

    -- Ensure stats record exists for current month
    INSERT INTO room_stats (year, month)
    VALUES (current_year, current_month)
    ON CONFLICT (year, month) DO NOTHING;

    -- Update deletion stats
    UPDATE room_stats 
    SET rooms_deleted = rooms_deleted + 1
    WHERE year = current_year AND month = current_month;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for room creation and deletion
CREATE TRIGGER track_room_creation
    AFTER INSERT ON room
    FOR EACH ROW
    EXECUTE FUNCTION increment_room_stats();

CREATE TRIGGER track_room_deletion
    AFTER DELETE ON room
    FOR EACH ROW
    EXECUTE FUNCTION increment_room_deletion_stats();