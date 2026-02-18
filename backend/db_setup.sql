

CREATE DATABASE IF NOT EXISTS project_infiniti
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE project_infiniti;


CREATE TABLE IF NOT EXISTS users (
  id          INT           NOT NULL AUTO_INCREMENT,
  sap_id      VARCHAR(50)   NOT NULL UNIQUE,
  full_name   VARCHAR(150)  NOT NULL,
  email       VARCHAR(255)      NULL,
  department  VARCHAR(100)      NULL,
  role        VARCHAR(50)   NOT NULL DEFAULT 'user',  
  is_active   TINYINT(1)    NOT NULL DEFAULT 1,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_sap_id (sap_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS login_logs (
  id           INT           NOT NULL AUTO_INCREMENT,
  user_id      INT               NULL,
  sap_id       VARCHAR(50)   NOT NULL,
  logged_in_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ip_address   VARCHAR(45)       NULL,
  PRIMARY KEY (id),
  INDEX idx_user_id (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO users (sap_id, full_name, email, department, role) VALUES
  ('SAP001', 'Alice Johnson',    'alice@example.com',    'Engineering',  'admin'),
  ('SAP002', 'Bob Sharma',       'bob@example.com',      'Operations',   'operator'),
  ('SAP003', 'Carol Martinez',   'carol@example.com',    'Maintenance',  'user'),
  ('SAP004', 'David Lee',        'david@example.com',    'IT',           'user');




USE project_infiniti;

CREATE TABLE IF NOT EXISTS daily_summary (
  id               INT           NOT NULL AUTO_INCREMENT,
  record_date      DATE          NOT NULL,
  category_label   VARCHAR(20)   NOT NULL,  
  quality_rating   DECIMAL(5,2)  NOT NULL,
  plan_compliance  DECIMAL(5,2)  NOT NULL,
  PRIMARY KEY (id),
  INDEX idx_date (record_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS monthly_summary (
  id               INT           NOT NULL AUTO_INCREMENT,
  record_date      DATE          NOT NULL,
  category_label   VARCHAR(20)   NOT NULL,   
  quality_rating   DECIMAL(5,2)  NOT NULL,
  plan_compliance  DECIMAL(5,2)  NOT NULL,
  PRIMARY KEY (id),
  INDEX idx_date (record_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS kpis (
  id          INT           NOT NULL AUTO_INCREMENT,
  kpi_key     VARCHAR(50)   NOT NULL UNIQUE,
  kpi_label   VARCHAR(150)  NOT NULL,
  kpi_value   DECIMAL(5,2)  NOT NULL,
  color       VARCHAR(20)   NOT NULL DEFAULT '#4ade80',
  sort_order  INT           NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS violations (
  id          INT           NOT NULL AUTO_INCREMENT,
  title       VARCHAR(255)  NOT NULL,
  status      ENUM('open','closed') NOT NULL DEFAULT 'open',
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO daily_summary (record_date, category_label, quality_rating, plan_compliance) VALUES
('2025-06-01','01/06',95,92), ('2025-06-02','02/06',88,85),
('2025-06-03','03/06',92,90), ('2025-06-04','04/06',85,88),
('2025-06-05','05/06',90,86), ('2025-06-06','06/06',93,91),
('2025-06-07','07/06',89,87), ('2025-06-08','08/06',94,92),
('2025-06-09','09/06',91,89);

INSERT INTO monthly_summary (record_date, category_label, quality_rating, plan_compliance) VALUES
('2024-07-01','07/2024',88,85), ('2024-08-01','08/2024',90,88),
('2024-09-01','09/2024',92,90), ('2024-10-01','10/2024',94,82),
('2024-11-01','11/2024',85,87), ('2024-12-01','12/2024',88,86),
('2025-01-01','01/2025',91,89), ('2025-02-01','02/2025',93,91),
('2025-03-01','03/2025',89,88), ('2025-04-01','04/2025',87,85),
('2025-05-01','05/2025',90,88), ('2025-06-01','06/2025',95,92);

INSERT INTO kpis (kpi_key, kpi_label, kpi_value, color, sort_order) VALUES
('monthly_plan_compliance',  'Monthly Plan Compliance',    89.86, '#4ade80', 1),
('mtd_plant_quality_rating', 'MTD Plant Quality Rating',   93.80, '#4ade80', 2),
('ytd_plant_quality_rating', 'YTD Plant Quality Rating',   92.90, '#4ade80', 3);

INSERT INTO violations (title, status) VALUES
('Safety check missed',         'closed'),('PPE not worn',               'closed'),
('Equipment overheating',        'open'),  ('Improper waste disposal',    'closed'),
('Noise level exceeded',         'closed'),('Missing fire extinguisher',  'closed'),
('Chemical spill - minor',       'closed'),('Unlabeled container',        'closed'),
('Exit blocked',                 'open'),  ('Machine guard removed',      'closed'),
('Expired certificate',          'closed'),('Faulty wiring reported',     'closed'),
('Slip hazard - wet floor',      'closed'),('Ventilation issue',          'closed'),
('Unauthorized area access',     'closed'),('Ladder improperly stored',   'closed');