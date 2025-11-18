CREATE TABLE products (
  id bigserial PRIMARY KEY,
  product_code varchar(19) NOT NULL UNIQUE,
  product_code_clean varchar(16) NOT NULL,
  barcode_type varchar(20) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);


CREATE INDEX idx_products_code_clean ON products (product_code_clean);
