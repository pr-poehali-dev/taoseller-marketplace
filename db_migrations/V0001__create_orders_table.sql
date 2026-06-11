CREATE TABLE t_p8290427_taoseller_marketplac.orders (
  id SERIAL PRIMARY KEY,
  order_num VARCHAR(20) UNIQUE NOT NULL,
  buyer_name VARCHAR(255) NOT NULL,
  buyer_phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  link TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  variant VARCHAR(255),
  comment TEXT,
  photo TEXT,
  price_yuan NUMERIC(10,2),
  price_rub INTEGER,
  total_rub INTEGER,
  status VARCHAR(30) NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
