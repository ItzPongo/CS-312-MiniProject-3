CREATE TABLE users (
  user_id VARCHAR(255) PRIMARY KEY,
  password VARCHAR(255),
  name VARCHAR(255)
);

CREATE TABLE blogs (
  blog_id SERIAL PRIMARY KEY,
  creator_name VARCHAR(255),
  creator_user_id VARCHAR(255) REFERENCES users(user_id),
  title VARCHAR(255),
  body TEXT,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (user_id, password, name) VALUES
('Hey_Its_Bee', '1234', 'Abby Ward'),
('SaxGuy', 'saxophone', 'Sean McLaughlin'),
('DanBird', 'bird', 'Dan Bird');

INSERT INTO blogs (creator_name, creator_user_id, title, body, date_created) VALUES
('Abby Ward', 'Hey_Its_Bee', 'Welcome to My Theater Blog', 'Excited to share my upcoming musical: The Addams Family!', '2025-03-15 10:00:00'),
('Sean McLaughlin', 'SaxGuy', 'Why saxophones are Awesome', 'Saxophones are the most enjoyable instruments to listen to in a band.', '2025-05-20 14:15:00'),
('Dan Bird', 'DanBird', 'Let me code cybersecurity for your website!', 'Hello, I want to offer my coding skills to anyone who needs help with cybersecurity.', '2025-01-24 06:30:00'),
('Abby Ward', 'Hey_Its_Bee', 'New theater opening soon', 'Hey all! There is a new theater opening up downtown soon!! Hope to see you all there to support the grand opening next week.', '2025-06-28 18:45:00'),
('Sean McLaughlin', 'SaxGuy', 'Fundraising for school instrument repairs', 'The schools nearby are in desperate need of money to fix their instruments. Fundraiser next month at Chick-Fil-A', '2025-05-30 01:05:00');
