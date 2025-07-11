// Copy of tables.sql from goldenbites folder for reference and database setup. 

-- Cart and Favorites Tables for Golden Bites App
-- Run this script in your Supabase SQL editor

-- 1. User Table (Standalone version)
-- If using Supabase auth, you'd typically create a 'profiles' table
-- linked to 'auth.users' instead.
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(150) NOT NULL UNIQUE,
    first_name VARCHAR(150),
    last_name VARCHAR(150),
    email VARCHAR(254) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL, -- In Django, this stores a hashed password
    is_staff BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_superuser BOOLEAN DEFAULT FALSE,
    date_joined TIMESTAMPTZ DEFAULT now(),
    last_login TIMESTAMPTZ,
    user_type VARCHAR(10) NOT NULL CHECK (user_type IN ('shop', 'customer')),
    shop_name VARCHAR(100),
    id_number VARCHAR(50),
    contact_number VARCHAR(20)
);

-- 2. FoodStall Table
CREATE TABLE food_stall (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL UNIQUE REFERENCES "user"(id) ON DELETE CASCADE,
    stall_name VARCHAR(100) NOT NULL,
    staff_name VARCHAR(100),
    service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('Pickup', 'Delivery', 'Both'))
);
CREATE INDEX idx_food_stall_owner_id ON food_stall(owner_id);

-- 3. Product Table
CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    food_stall_id INTEGER NOT NULL REFERENCES food_stall(id) ON DELETE CASCADE,
    image_url VARCHAR(2048),
    ingredients TEXT,
    details TEXT
);
CREATE INDEX idx_product_food_stall_id ON product(food_stall_id);

-- 4. Cart Table
CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0) DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, product_id)
);
CREATE INDEX idx_cart_user_id ON cart(user_id);
CREATE INDEX idx_cart_product_id ON cart(product_id);

-- 5. Favorites Table
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, product_id)
);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_product_id ON favorites(product_id);

-- 6. Payment Table
CREATE TABLE payment (
    id SERIAL PRIMARY KEY,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    payment_time TIMESTAMPTZ DEFAULT now()
);

-- 7. Order Table
CREATE TABLE "order" (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    order_time TIMESTAMPTZ DEFAULT now(),
    order_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    order_summary TEXT,
    order_type CHAR(1) NOT NULL CHECK (order_type IN ('P', 'D')),
    queue_id VARCHAR(50),
    payment_id INTEGER UNIQUE REFERENCES payment(id) ON DELETE SET NULL
);
CREATE INDEX idx_order_customer_id ON "order"(customer_id);
CREATE INDEX idx_order_payment_id ON "order"(payment_id);

-- 8. PickupOrder Table
CREATE TABLE pickup_order (
    order_id INTEGER PRIMARY KEY REFERENCES "order"(id) ON DELETE CASCADE,
    pickup_store VARCHAR(100) NOT NULL
);

-- 9. DeliveryOrder Table
CREATE TABLE delivery_order (
    order_id INTEGER PRIMARY KEY REFERENCES "order"(id) ON DELETE CASCADE,
    delivery_address VARCHAR(255) NOT NULL
);

-- 10. OrderItem Table
CREATE TABLE order_item (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES "order"(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL,
    food_stall_id INTEGER NOT NULL REFERENCES food_stall(id) ON DELETE CASCADE -- Tracks which stall fulfilled this item
);
CREATE INDEX idx_order_item_order_id ON order_item(order_id);
CREATE INDEX idx_order_item_product_id ON order_item(product_id);
CREATE INDEX idx_order_item_food_stall_id ON order_item(food_stall_id);

-- 11. Review Table
CREATE TABLE review (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5), -- Assuming a 1-5 rating
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_review_customer_id ON review(customer_id);
CREATE INDEX idx_review_product_id ON review(product_id);

-- 12. Notification Table
CREATE TABLE notification (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    order_id INTEGER REFERENCES "order"(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT now(),
    is_read BOOLEAN DEFAULT FALSE,
    link VARCHAR(2048)
);
CREATE INDEX idx_notification_user_id ON notification(user_id);
CREATE INDEX idx_notification_order_id ON notification(order_id);

-- Add image_url column to product table if it doesn't exist
ALTER TABLE product ADD COLUMN IF NOT EXISTS image_url VARCHAR(2048);
ALTER TABLE product ADD COLUMN IF NOT EXISTS ingredients TEXT;
ALTER TABLE product ADD COLUMN IF NOT EXISTS details TEXT; 