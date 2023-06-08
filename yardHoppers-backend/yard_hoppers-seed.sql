-- Seed file for yard_hoppers

-- Insert 20 users
INSERT INTO users (username, password, first_name, last_name, email, is_host)
VALUES
  ('user1', 'password1', 'John', 'Doe', 'john.doe@example.com', FALSE),
  ('user2', 'password2', 'Jane', 'Smith', 'jane.smith@example.com', FALSE),
  ('user3', 'password3', 'Michael', 'Johnson', 'michael.johnson@example.com', FALSE),
  ('user4', 'password4', 'Emily', 'Williams', 'emily.williams@example.com', FALSE),
  ('user5', 'password5', 'David', 'Brown', 'david.brown@example.com', TRUE),
  ('user6', 'password6', 'Sarah', 'Taylor', 'sarah.taylor@example.com', FALSE),
  ('user7', 'password7', 'Matthew', 'Anderson', 'matthew.anderson@example.com', TRUE),
  ('user8', 'password8', 'Olivia', 'Thomas', 'olivia.thomas@example.com', FALSE),
  ('user9', 'password9', 'Daniel', 'Martinez', 'daniel.martinez@example.com', FALSE),
  ('user10', 'password10', 'Sophia', 'Hernandez', 'sophia.hernandez@example.com', TRUE),
  ('user11', 'password11', 'Alexander', 'Lopez', 'alexander.lopez@example.com', FALSE),
  ('user12', 'password12', 'Mia', 'Gonzalez', 'mia.gonzalez@example.com', FALSE),
  ('user13', 'password13', 'Ethan', 'Moore', 'ethan.moore@example.com', TRUE),
  ('user14', 'password14', 'Ava', 'Young', 'ava.young@example.com', FALSE),
  ('user15', 'password15', 'Jacob', 'Lee', 'jacob.lee@example.com', FALSE),
  ('user16', 'password16', 'Isabella', 'Clark', 'isabella.clark@example.com', TRUE),
  ('user17', 'password17', 'William', 'Lewis', 'william.lewis@example.com', FALSE),
  ('user18', 'password18', 'Sophie', 'Walker', 'sophie.walker@example.com', TRUE),
  ('user19', 'password19', 'James', 'Hall', 'james.hall@example.com', FALSE),
  ('user20', 'password20', 'Charlotte', 'Adams', 'charlotte.adams@example.com', FALSE);

-- Insert 5 listings
INSERT INTO listings (host_user, price, city, state, zipcode, description, photo_url)
VALUES
  ('user5',
  100,
  'Denver',
  'Colorado',
  '80210',
  'Shabby chic bitters iPhone, yuccie adaptogen shaman dreamcatcher etsy lo-fi fam chartreuse taiyaki umami squid.',
  'http://example.com/listing1.jpg'),

  ('user7',
  150,
  'Denver',
  'Colorado',
  '80210',
  'Tonx helvetica mumblecore typewriter, readymade PBR&B polaroid taiyaki DIY deep v',
  'http://example.com/listing2.jpg'),

  ('user10',
  200,
  'Denver',
  'Colorado',
  '80210',
  'Pickled tonx chartreuse, trust fund pop-up hot chicken post-ironic selvage 8-bit schlitz',
  'http://example.com/listing3.jpg'),

  ('user13',
  120,
  'Denver',
  'Colorado',
  '80210',
  'Banjo venmo intelligentsia man braid la croix before they sold out YOLO pinterest',
  'http://example.com/listing4.jpg'),

  ('user16',
  180,
  'Denver',
  'Colorado',
  '80210',
  'Salvia meggings plaid man bun poke squid keytar paleo pug same unicorn skateboard asymmetrical vexillologist.',
  'http://example.com/listing5.jpg');

-- Insert 5 messages
INSERT INTO messages (listing_id, from_user, read, msg_body)
VALUES
  (1, 'user1', FALSE, 'Message 1'),
  (2, 'user2', FALSE, 'Message 2'),
  (3, 'user3', FALSE, 'Message 3'),
  (4, 'user4', FALSE, 'Message 4'),
  (5, 'user5', FALSE, 'Message 5');

-- Insert 5 bookings
INSERT INTO bookings (listing_id, booking_user, check_in_date, check_out_date)
VALUES
  (1, 'user1', '2023-06-10', '2023-06-15'),
  (2, 'user2', '2023-06-12', '2023-06-18'),
  (3, 'user3', '2023-06-14', '2023-06-20'),
  (4, 'user4', '2023-06-16', '2023-06-22'),
  (5, 'user5', '2023-06-18', '2023-06-24');
