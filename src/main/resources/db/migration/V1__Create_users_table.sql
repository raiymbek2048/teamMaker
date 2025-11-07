-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    version BIGINT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    age INTEGER,
    bio TEXT,
    location VARCHAR(255),
    phone VARCHAR(50),
    telegram VARCHAR(255),
    instagram VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'USER'
);

-- Create indexes
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_username ON users(username);

-- Create user_skills table
CREATE TABLE user_skills (
    user_id UUID NOT NULL,
    skill VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
