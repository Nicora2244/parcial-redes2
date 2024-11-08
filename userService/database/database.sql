-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS social_user;

-- Usar la base de datos
USE social_user;

-- Crear la tabla de Usuarios
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT, 
    full_name VARCHAR(255) NOT NULL,                  
    username VARCHAR(255) UNIQUE NOT NULL,           
    password VARCHAR(255) NOT NULL,                  
    role ENUM('admin', 'user') NOT NULL,      
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP    
);
