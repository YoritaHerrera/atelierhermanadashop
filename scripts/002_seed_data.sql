-- Insert materials/categories
INSERT INTO public.materials (name, slug, description) VALUES
  ('Bordados', 'bordados', 'Piezas artesanales con bordados hechos a mano'),
  ('Yeso', 'yeso', 'Creaciones únicas en yeso'),
  ('Cerámica', 'ceramica', 'Piezas de cerámica artesanal'),
  ('Resina', 'resina', 'Arte en resina con diseños místicos'),
  ('Arcilla Polimérica', 'arcilla-polimerica', 'Accesorios en arcilla polimérica'),
  ('Accesorios de Moda', 'accesorios-moda', 'Accesorios únicos para tu estilo'),
  ('Accesorios de Hogar', 'accesorios-hogar', 'Decoración para tu espacio'),
  ('Decoración Interior', 'decoracion-interior', 'Piezas decorativas para el hogar')
ON CONFLICT (slug) DO NOTHING;

-- Insert collections
INSERT INTO public.collections (name, slug, description, is_featured) VALUES
  ('Colección Mística', 'coleccion-mistica', 'Piezas inspiradas en la magia y el misticismo', true),
  ('Colección Celestial', 'coleccion-celestial', 'Diseños inspirados en las estrellas y constelaciones', true),
  ('Colección Alma', 'coleccion-alma', 'Creaciones que conectan con tu esencia', false),
  ('Colección Naturaleza', 'coleccion-naturaleza', 'Inspirada en la belleza natural', false)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO public.products (name, slug, description, price, image_url, collection_id, material_id, stock, is_featured)
SELECT 
  'Collar Luna Creciente',
  'collar-luna-creciente',
  'Hermoso collar con luna creciente en resina con detalles dorados',
  45.00,
  '/placeholder.svg?height=400&width=400',
  c.id,
  m.id,
  15,
  true
FROM public.collections c, public.materials m
WHERE c.slug = 'coleccion-celestial' AND m.slug = 'resina'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, description, price, image_url, collection_id, material_id, stock, is_featured)
SELECT 
  'Aretes Cristal Amatista',
  'aretes-cristal-amatista',
  'Aretes con cristales de amatista natural en arcilla polimérica',
  35.00,
  '/placeholder.svg?height=400&width=400',
  c.id,
  m.id,
  20,
  true
FROM public.collections c, public.materials m
WHERE c.slug = 'coleccion-mistica' AND m.slug = 'arcilla-polimerica'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, description, price, image_url, collection_id, material_id, stock, is_featured)
SELECT 
  'Vela Aromática Lunar',
  'vela-aromatica-lunar',
  'Vela artesanal con fases lunares talladas en yeso',
  28.00,
  '/placeholder.svg?height=400&width=400',
  c.id,
  m.id,
  12,
  true
FROM public.collections c, public.materials m
WHERE c.slug = 'coleccion-celestial' AND m.slug = 'yeso'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, description, price, image_url, collection_id, material_id, stock, is_featured)
SELECT 
  'Plato Decorativo Mandala',
  'plato-decorativo-mandala',
  'Plato de cerámica con diseño de mandala pintado a mano',
  55.00,
  '/placeholder.svg?height=400&width=400',
  c.id,
  m.id,
  8,
  false
FROM public.collections c, public.materials m
WHERE c.slug = 'coleccion-alma' AND m.slug = 'ceramica'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, description, price, image_url, collection_id, material_id, stock, is_featured)
SELECT 
  'Cojín Bordado Estrella',
  'cojin-bordado-estrella',
  'Cojín con bordado de constelación hecho a mano',
  42.00,
  '/placeholder.svg?height=400&width=400',
  c.id,
  m.id,
  10,
  false
FROM public.collections c, public.materials m
WHERE c.slug = 'coleccion-celestial' AND m.slug = 'bordados'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, description, price, image_url, collection_id, material_id, stock, is_featured)
SELECT 
  'Anillo Flor de Resina',
  'anillo-flor-resina',
  'Anillo ajustable con flores naturales preservadas en resina',
  32.00,
  '/placeholder.svg?height=400&width=400',
  c.id,
  m.id,
  18,
  true
FROM public.collections c, public.materials m
WHERE c.slug = 'coleccion-naturaleza' AND m.slug = 'resina'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, description, price, image_url, collection_id, material_id, stock, is_featured)
SELECT 
  'Maceta Geométrica',
  'maceta-geometrica',
  'Maceta de yeso con diseño geométrico moderno',
  38.00,
  '/placeholder.svg?height=400&width=400',
  c.id,
  m.id,
  14,
  false
FROM public.collections c, public.materials m
WHERE c.slug = 'coleccion-naturaleza' AND m.slug = 'yeso'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, description, price, image_url, collection_id, material_id, stock, is_featured)
SELECT 
  'Pulsera Chakras',
  'pulsera-chakras',
  'Pulsera con piedras de los 7 chakras en arcilla polimérica',
  29.00,
  '/placeholder.svg?height=400&width=400',
  c.id,
  m.id,
  25,
  true
FROM public.collections c, public.materials m
WHERE c.slug = 'coleccion-mistica' AND m.slug = 'arcilla-polimerica'
ON CONFLICT (slug) DO NOTHING;

-- Insert sample discount codes
INSERT INTO public.discount_codes (code, discount_type, discount_value, min_purchase, max_uses, is_active)
VALUES
  ('BIENVENIDA10', 'percentage', 10.00, 30.00, 100, true),
  ('ALMA20', 'percentage', 20.00, 50.00, 50, true),
  ('ENVIOGRATIS', 'fixed', 15.00, 60.00, NULL, true)
ON CONFLICT (code) DO NOTHING;
