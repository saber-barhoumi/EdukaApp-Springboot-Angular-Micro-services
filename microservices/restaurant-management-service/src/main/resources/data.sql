-- Sample restaurants for initial database population
-- This file will only run if the database is empty

-- INSERT INTO restaurant (id, name, type, address, phone_number, email, description, opening_hours, image_url, is_active, created_at, updated_at)
-- VALUES 
--     (1, 'Campus Cafeteria', 'Cafeteria', 'Building A, Ground Floor', '+1234567890', 'cafeteria@eduka.com', 'Main campus cafeteria serving breakfast, lunch and dinner', 'Mon-Fri: 7:00-20:00, Sat-Sun: 9:00-18:00', 'https://via.placeholder.com/300x200?text=Cafeteria', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
--     (2, 'Student Pizza Corner', 'Fast Food', 'Student Center, 2nd Floor', '+1234567891', 'pizza@eduka.com', 'Quick service pizza restaurant with various toppings', 'Mon-Sun: 11:00-22:00', 'https://via.placeholder.com/300x200?text=Pizza', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
--     (3, 'Healthy Bites', 'Health Food', 'Library Building, 1st Floor', '+1234567892', 'healthy@eduka.com', 'Organic and healthy meal options', 'Mon-Fri: 8:00-19:00', 'https://via.placeholder.com/300x200?text=Healthy', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
--     (4, 'Coffee & More', 'Café', 'Main Entrance, Building B', '+1234567893', 'coffee@eduka.com', 'Coffee shop with pastries and light snacks', 'Mon-Fri: 7:00-17:00', 'https://via.placeholder.com/300x200?text=Coffee', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Note: Commented out because with ddl-auto=update, Spring Boot will handle schema creation
-- and we don't want to insert duplicate data if the database already exists
-- To enable initial data, uncomment the INSERT statements above after first startup
