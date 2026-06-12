CREATE TABLE users (id serial PRIMARY KEY, email text, password text); -- FLAW-8: no UNIQUE(email), plaintext password column
CREATE TABLE invoices (id serial PRIMARY KEY, status text, total numeric);
