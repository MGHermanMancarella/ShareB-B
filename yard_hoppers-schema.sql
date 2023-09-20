CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL CHECK (position('@' IN email) > 1),
  is_host BOOLEAN NOT NULL DEFAULT FALSE,
  bookings INT []
);
CREATE TABLE listings (
  listing_id SERIAL PRIMARY KEY,
  title VARCHAR(30),
  host_user VARCHAR(25) REFERENCES users(username),
  price INT NOT NULL,
  city VARCHAR(30) NOT NULL,
  state VARCHAR(30) NOT NULL,
  zipcode CHAR(5) CHECK (zipcode ~ '^[0-9]{5}$'),
  address VARCHAR(25),
  description TEXT NOT NULL,
  photo_url VARCHAR(500) NOT NULL,
  CONSTRAINT unique_address UNIQUE (address)
);
CREATE TABLE messages (
  msg_id SERIAL PRIMARY KEY,
  listing_id INT REFERENCES listings(listing_id),
  from_user VARCHAR(25) REFERENCES users(username),
  read BOOLEAN NOT NULL DEFAULT FALSE,
  msg_body TEXT NOT NULL
);
CREATE TABLE bookings (
  booking_id SERIAL PRIMARY KEY,
  listing_id INT REFERENCES listings(listing_id),
  booking_user VARCHAR(25) REFERENCES users(username),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL
);
-- FUNCTION: book_slot checks dates and books if no conflict
-- else returns COUNT if overlap
CREATE OR REPLACE FUNCTION book_slot(
    desired_start_date TIMESTAMP,
    desired_end_date TIMESTAMP
  ) RETURNS BOOLEAN AS $$
DECLARE overlap_count INT;
BEGIN -- Check for overlaps
SELECT COUNT(*) INTO overlap_count
FROM bookings
WHERE (
    check_in < desired_end_date
    AND check_out > desired_start_date
  );
-- If no overlap, insert the booking
IF overlap_count = 0 THEN
INSERT INTO bookings (check_in, check_out)
VALUES (desired_start_date, desired_end_date);
RETURN TRUE;
END IF;
RETURN FALSE;
END;
$$ LANGUAGE plpgsql;
-- FUNCTION: available_slots returns available booking windows
CREATE OR REPLACE FUNCTION available_slots(
    listing_id INT,
    start_date DATE,
    end_date DATE
  ) RETURNS TABLE (slot_start DATE, slot_end DATE) AS $$
DECLARE prev_end_date DATE;
next_start_date DATE;
BEGIN -- Initialize the previous end date to the start date.
prev_end_date := start_date;
-- Loop through bookings within the given date range.
FOR next_start_date IN (
  SELECT check_in
  FROM bookings
  WHERE listing_id = listing_id
    AND check_in BETWEEN start_date AND end_date
  ORDER BY check_in
) LOOP IF prev_end_date < next_start_date THEN RETURN NEXT;
-- This returns an available slot
END IF;
prev_end_date := (
  SELECT check_out
  FROM bookings
  WHERE listing_id = listing_id
    AND check_in = next_start_date
);
END LOOP;
-- After looping through all bookings, check if there's an available slot between the last booking and the end date.
IF prev_end_date < end_date THEN slot_start := prev_end_date;
slot_end := end_date;
RETURN NEXT;
END IF;
END;
$$ LANGUAGE plpgsql;