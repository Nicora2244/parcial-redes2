-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS social_messages;

-- Usar la base de datos
USE social_messages;

CREATE TABLE messages (
    id INT PRIMARY KEY AUTO_INCREMENT, 
    user_id INT NOT NULL,
    message VARCHAR(10000) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);