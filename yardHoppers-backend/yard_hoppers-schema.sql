CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  is_host BOOLEAN NOT NULL DEFAULT FALSE,
  bookings INT[]
);
-- TODO: add second PK to prevent double listings
CREATE TABLE listings (
  listing_id SERIAL PRIMARY KEY,
  host_user VARCHAR(25) REFERENCES users(username),
  price INT NOT NULL,
  city VARCHAR(30) NOT NULL,
  state VARCHAR(30) NOT NULL,
  zipcode CHAR(5) CHECK (zipcode ~ '^[0-9]{5}$'),
  description TEXT NOT NULL,
  photo_url VARCHAR(100) NOT NULL
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
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL
);



