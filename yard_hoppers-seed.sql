-- Seed file for yard_hoppers

-- Insert 20 users
INSERT INTO users (username, password, first_name, last_name, email, is_host) VALUES
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

-- Insert 6 listings
INSERT INTO listings (host_user, price, city, state, zipcode, address, title, description, photo_url) VALUES
('user5', 100, 'Chicago', 'Illinois', '60614', '1234 N Clark St', 'Cozy Chicago Spot', 'Salvia meggings plaid man bun poke squid keytar paleo pug same unicorn skateboard asymmetrical vexillologist.', 'https://media1.popsugar-assets.com/files/thumbor/-aSWpZA0somPvkCIfYH4XcOY5mg/fit-in/2048xorig/filters:format_auto-!!-:strip_icc-!!-/2016/01/11/892/n/24155406/7562f3624b188f92_Ralph__Parties_A_La_Carte_DSC7675copy_low/i/Outdoor-Camping-Birthday-Party-Ideas.jpg'),
('user7', 200, 'Los Angeles', 'California', '90001', '5678 S Broadway', 'Sunny LA Getaway', 'Banjo venmo intelligentsia man braid la croix before they sold out YOLO pinterest', 'https://i.pinimg.com/564x/04/0f/ec/040feca04c7eb333bc874c01ce81c97d--pool-ideas-backyard-ideas.jpg'),
('user10', 150, 'Houston', 'Texas', '77002', '9012 Main St', 'Texas Charm', 'Pickled tonx chartreuse, trust fund pop-up hot chicken post-ironic selvage 8-bit schlitz', 'https://assets.inman.com/wp-content/uploads/2017/08/Trovita_Norte_The_Horizon_0576_web-3-1024x684.jpg'),
('user13', 180, 'Chicago', 'Illinois', '60614', '3456 W Fullerton Ave', 'Chic Chicago Condo', 'Tonx helvetica mumblecore typewriter, readymade PBR&B polaroid taiyaki DIY deep v', 'https://secure.img1-cg.wfcdn.com/im/88274930/resize-h755-w755%5Ecompr-r85/1794/179430865/Kiddie+Pool.jpg'),
('user16', 250, 'Phoenix', 'Arizona', '85001', '7890 N Central Ave', 'Phoenix Paradise', 'Shabby chic bitters iPhone, yuccie adaptogen shaman dreamcatcher etsy lo-fi fam chartreuse taiyaki umami squid.', 'https://lifebyleanna.com/wp-content/uploads/2020/07/IMG_9637.jpg'),
('user18', 300, 'Los Angeles', 'California', '90001', '1112 W 3rd St', 'LA Luxe Loft', 'Lorem ipsum dolor sit amet consectetur adipiscing elit', 'https://content.api.news/v3/images/bin/d0bd88926b06d7984bfa5e7114deeb9b');

-- Insert 5 messages
INSERT INTO messages (listing_id, from_user, read, msg_body) VALUES
(1, 'user1', FALSE, 'Message1'),
(2, 'user2', FALSE, 'Message2'),
(3, 'user3', FALSE, 'Message3'),
(4, 'user4', FALSE, 'Message4'),
(5, 'user5', FALSE, 'Message5');

-- Insert 5 bookings
INSERT INTO bookings (listing_id, booking_user, check_in_date, check_out_date) VALUES
(1, 'user1', '2023-06-10', '2023-06-15'),
(2, 'user2', '2023-06-12', '2023-06-18'),
(3, 'user3', '2023-06-14', '2023-06-20'),
(4, 'user4', '2023-06-16', '2023-06-22'),
(5, 'user5', '2023-06-18', '2023-06-24');