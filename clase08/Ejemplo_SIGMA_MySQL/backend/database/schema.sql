CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('TECNICO', 'SUPERVISOR') NOT NULL DEFAULT 'TECNICO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  status ENUM('ABIERTA', 'EN_PROCESO', 'FINALIZADA') NOT NULL DEFAULT 'ABIERTA',
  assigned_to INT UNSIGNED NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_assigned_user FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

-- Password de ambos usuarios: 123456
-- El hash fue generado con bcrypt. Nunca guardar contraseñas reales en texto plano.
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Técnico SIGMA', 'tecnico@sigma.test', '$2a$10$VcEeCocRLXD44Q5hIPPvKujOCAPK6kuPA2aQNAZVXbXm9QBZXofFW', 'TECNICO'),
  ('Supervisor SIGMA', 'supervisor@sigma.test', '$2a$10$VcEeCocRLXD44Q5hIPPvKujOCAPK6kuPA2aQNAZVXbXm9QBZXofFW', 'SUPERVISOR')
ON DUPLICATE KEY UPDATE email = VALUES(email);

INSERT INTO tasks (title, status, assigned_to) VALUES
  ('Revisar impresora de recepción', 'ABIERTA', 1),
  ('Actualizar inventario de equipos', 'ABIERTA', NULL);
