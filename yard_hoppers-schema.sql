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
CREATE OR REPLACE FUNCTION book_slot(
    desired_start_date TIMESTAMP,
    desired_end_date TIMESTAMP
  ) RETURNS BOOLEAN AS $$
DECLARE overlap_count INT;
BEGIN 
-- Check for overlaps
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