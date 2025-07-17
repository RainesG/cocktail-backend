-- Create database with UTF8MB4 support for Chinese characters
CREATE DATABASE IF NOT EXISTS cocktail_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE cocktail_db;

-- Create cocktails table
CREATE TABLE IF NOT EXISTS cocktails (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_zh VARCHAR(255), -- Chinese name
  description TEXT,
  description_zh TEXT, -- Chinese description
  category VARCHAR(100),
  glass VARCHAR(100),
  instructions_zh TEXT, -- Chinese instructions
  image_url VARCHAR(500),
  alcoholic BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_category (category),
  INDEX idx_alcoholic (alcoholic)
) CHARACTER SET utf8mb4 utf8b4_unicode_ci;

-- Create ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_zh VARCHAR(255), -- Chinese name
  type VARCHAR(100), -- spirit, mixer, garnish, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_type (type)
) CHARACTER SET utf8mb4 utf8b4_unicode_ci;

-- Create cocktail_ingredients junction table
CREATE TABLE IF NOT EXISTS cocktail_ingredients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cocktail_id INT NOT NULL,
  ingredient_id INT NOT NULL,
  amount VARCHAR(50), -- e.g., "15 oz",2 dashes"
  unit VARCHAR(50), -- e.g.,oz", "ml", "dash"
  order_index INT DEFAULT 0,
  FOREIGN KEY (cocktail_id) REFERENCES cocktails(id) ON DELETE CASCADE,
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE,
  INDEX idx_cocktail_id (cocktail_id),
  INDEX idx_ingredient_id (ingredient_id)
) CHARACTER SET utf8mb4 utf8b4_unicode_ci;

-- Insert sample data
INSERT INTO cocktails (name, name_zh, description, description_zh, category, glass, instructions, instructions_zh) VALUES
(Margarita', 玛格丽塔,A classic tequila-based cocktail',经典龙舌兰鸡尾酒',Cocktail,Cocktail glass', 'Shake all ingredients with ice, strain into a salt-rimmed glass,将所有材料与冰块摇匀，过滤到盐边杯中),
(Mojito', '莫吉托',A refreshing rum-based cocktail,清爽的朗姆酒鸡尾酒',Cocktail,Highball glass',Muddle mint with sugar and lime, add rum and soda,将薄荷与糖和青柠捣碎，加入朗姆酒和苏打水');

-- Insert sample ingredients
INSERT INTO ingredients (name, name_zh, type) VALUES
(Tequila, 龙舌兰酒',spirit),
(Lime juice',青柠汁,mixer),
(Triple sec,橙味利口酒', 'liqueur'),
(White rum, 白朗姆酒',spirit'),
(Mint leaves, 薄荷叶', 'garnish),
(Simple syrup', 糖浆', 'mixer),
(Soda water', 苏打水', 'mixer');

-- Insert cocktail-ingredient relationships
INSERT INTO cocktail_ingredients (cocktail_id, ingredient_id, amount, unit, order_index) VALUES
(112oz, 1), -- Margarita: 2 oz Tequila
(121oz, 2), -- Margarita: 1 oz Lime juice
(131oz, 3), -- Margarita: 1 oz Triple sec
(242, 'oz, 1), -- Mojito: 2 oz White rum
(2,5, 6-8, 'leaves, 2- Mojito: 6-8 Mint leaves
(2, 600.75, 'oz,3), -- Mojito: 0.75 oz Simple syrup
(221, 'oz, 4), -- Mojito: 1 oz Lime juice
(272, 'oz, 5); -- Mojito: 2 oz Soda water 