-- Seed Tenants
insert into tenants (id, slug, name, logo, primary_color, whatsapp, address, delivery_fee, min_order, working_hours, installments) values
('1', 'acai-do-miqueias', 'Açaí do Miqueias', '🍇', '#7c3aed', '(11) 98765-4321', 'Rua das Palmeiras, 150 - Centro', 5.00, 15.00, '09:00 - 22:00', 'Até 12x'),
('2', 'gelateria-bella', 'Gelateria Bella', '🍦', '#e11d48', '(11) 91234-5678', 'Av. Paulista, 1000 - Bela Vista', 3.00, 20.00, '10:00 - 23:00', 'Até 6x'),
('3', 'acai-da-maria', 'Açaí da Maria', '💜', '#6d28d9', '(11) 95555-1234', 'Rua XV de Novembro, 80 - Centro', 0, 12.00, '08:00 - 21:00', 'Até 10x');

-- Seed Categories
insert into categories (id, tenant_id, name, icon, active, "order") values
('c1', '1', 'Açaís', '🍇', true, 1),
('c2', '1', 'Copos', '🥤', true, 2),
('c3', '1', 'Sorvetes', '🍦', true, 3),
('c4', '1', 'Coberturas', '🍫', true, 4),
('c5', '1', 'Frutas', '🍓', true, 5),
('c1', '2', 'Gelatos', '🍦', true, 1),
('c2', '2', 'Bebidas', '🧃', true, 2),
('c3', '2', 'Sobremesas', '🍰', true, 3),
('c1', '3', 'Açaís', '🍇', true, 1),
('c2', '3', 'Bebidas', '🧃', true, 2),
('c3', '3', 'Complementos', '🥜', true, 3);

-- Seed Products
insert into products (id, tenant_id, name, category, price, old_price, stock, active, featured, sales) values
('p1', '1', 'Açaí Tradicional 500ml', 'Açaís', 19.90, 24.90, 50, true, true, 342),
('p2', '1', 'Açaí Zero 500ml', 'Açaís', 22.90, null, 30, true, false, 156),
('p3', '1', 'Copo Açaí 300ml', 'Copos', 15.00, null, 60, true, false, 210),
('p4', '1', 'Tigela Power 700ml', 'Açaís', 28.90, 34.90, 25, true, true, 198),
('p5', '1', 'Sorvete de Creme 2 bolas', 'Sorvetes', 12.00, 15.00, 40, true, false, 89),
('p1', '2', 'Gelato Cremoso 300ml', 'Gelatos', 18.00, null, 35, true, true, 412),
('p2', '2', 'Gelato de Pistache', 'Gelatos', 22.00, 26.00, 20, true, true, 287),
('p3', '2', 'Milkshake de Chocolate', 'Bebidas', 16.00, null, 40, true, false, 156),
('p4', '2', 'Banana Split Especial', 'Sobremesas', 24.90, null, 15, true, false, 98),
('p5', '2', 'Sorvete Vegano 300ml', 'Gelatos', 25.00, null, 10, true, false, 67),
('p1', '3', 'Açaí Médio 500ml', 'Açaís', 17.90, 21.90, 45, true, true, 521),
('p2', '3', 'Açaí Pequeno 300ml', 'Açaís', 13.90, null, 70, true, false, 334),
('p3', '3', 'Açaí Gigante 1L', 'Açaís', 30.00, null, 20, true, true, 178),
('p4', '3', 'Suco Natural 500ml', 'Bebidas', 9.00, null, 50, true, false, 210);

-- Seed Orders
insert into orders (id, tenant_id, customer, items, total, status, payment, method, date, address) values
('GO-4521', '1', 'Maria Silva', '["Açaí Tradicional 500ml","Granola","Banana"]', 27.40, 'delivered', 'PIX', 'Entrega', '2024-07-20 19:32', 'Rua das Flores, 123'),
('GO-4520', '1', 'João Santos', '["Copo Açaí 300ml","Nutella"]', 18.00, 'shipped', 'Cartão', 'Entrega', '2024-07-20 19:15', 'Av. Principal, 456'),
('GO-4519', '1', 'Ana Oliveira', '["Tigela Power 700ml","Paçoca"]', 34.90, 'preparing', 'Dinheiro', 'Retirada', '2024-07-20 18:50', '-'),
('GB-301', '2', 'Carlos Lima', '["Gelato Cremoso 300ml"]', 18.00, 'delivered', 'Cartão', 'Entrega', '2024-07-20 20:10', 'Rua Augusta, 500'),
('GB-300', '2', 'Julia Costa', '["Milkshake de Chocolate"]', 16.00, 'preparing', 'PIX', 'Retirada', '2024-07-20 19:55', '-'),
('AM-189', '3', 'Pedro Alves', '["Açaí Médio 500ml","Granola"]', 22.90, 'delivered', 'Dinheiro', 'Entrega', '2024-07-20 18:30', 'Rua da Paz, 200'),
('AM-188', '3', 'Lucia Mendes', '["Açaí Pequeno 300ml"]', 13.90, 'shipped', 'PIX', 'Entrega', '2024-07-20 18:15', 'Rua das Acácias, 55');
