CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('TECNICO', 'SUPERVISOR') NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  description TEXT NULL,
  status ENUM('ABIERTA', 'EN_PROCESO', 'FINALIZADA') NOT NULL DEFAULT 'ABIERTA',
  assigned_to INT UNSIGNED NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_user FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

-- Contraseña de prueba: 123456. Es un hash bcrypt, no texto plano.
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Técnico SIGMA', 'tecnico@sigma.test', '$2a$10$VcEeCocRLXD44Q5hIPPvKujOCAPK6kuPA2aQNAZVXbXm9QBZXofFW', 'TECNICO'),
  ('Supervisor SIGMA', 'supervisor@sigma.test', '$2a$10$VcEeCocRLXD44Q5hIPPvKujOCAPK6kuPA2aQNAZVXbXm9QBZXofFW', 'SUPERVISOR')
ON DUPLICATE KEY UPDATE email = VALUES(email);

INSERT INTO tasks (title, description, status, assigned_to) VALUES
  ('Revisar impresora', 'La impresora de recepción no imprime en color.', 'ABIERTA', NULL),
  ('Actualizar inventario', 'Controlar equipos disponibles en depósito.', 'EN_PROCESO', 1),
  ('Cambiar cartucho de tóner', 'Solicitar insumo y registrar el cambio.', 'ABIERTA', NULL);
