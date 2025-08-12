-- Insert default roles if they don't exist
INSERT OR IGNORE INTO Role (id, name) VALUES (1, 'Admin');
INSERT OR IGNORE INTO Role (id, name) VALUES (2, 'User');
INSERT OR IGNORE INTO Role (id, name) VALUES (3, 'Manager');
INSERT OR IGNORE INTO Role (id, name) VALUES (4, 'Viewer');