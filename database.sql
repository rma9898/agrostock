USE agrostock;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil ENUM('admin', 'comum') DEFAULT 'comum',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50),
    preco_base DECIMAL(10, 2),
    unidade VARCHAR(20) -- Ex: Litros, Kg, Sacos
);

CREATE TABLE estoque_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    produto_id INT,
    quantidade DECIMAL(10, 2),
    data_validade DATE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
);

-- Inserção de Dados Iniciais para Teste
-- Senha 'admin123' em hash: $2b$10$6u7vK7p8p9Z6p6y7y7y7ue3u3u3u3u3u3u3u3u3u3u3u3u3u3u
-- Senha 'user123' em hash: $2b$10$9y8x7w6v5u4t3s2r1q0p.O1O1O1O1O1O1O1O1O1O1O1O1O1O
INSERT INTO usuarios (nome, email, senha, perfil) VALUES 
('Kensley Admin', 'admin@agrostock.com', '$2b$10$7R9f6B5z/E1p8G9H0I1J2K3L4M5N6O7P8Q9R0S1T2U3V4W5X6Y7Z8', 'admin'),
('Produtor Rural', 'produtor@agrostock.com', '$2b$10$A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A', 'comum');

INSERT INTO produtos (nome, categoria, preco_base, unidade) VALUES 
('Fertilizante NPK 10-10-10', 'Fertilizantes', 150.00, 'Saco 50kg'),
('Glifosato 480', 'Herbicidas', 45.00, 'Litro'),
('Semente de Milho Híbrido', 'Sementes', 450.00, 'Saca');