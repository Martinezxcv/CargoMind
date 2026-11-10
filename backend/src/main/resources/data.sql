-- ============ CITIES ============
INSERT INTO cities (name, country_code, latitude, longitude) VALUES
-- Poland
('WARSZAWA',        'PL', 52.2297, 21.0122),
('KRAKOW',          'PL', 50.0647, 19.9450),
('LODZ',            'PL', 51.7592, 19.4560),
('WROCLAW',         'PL', 51.1079, 17.0385),
('POZNAN',          'PL', 52.4064, 16.9252),
('GDANSK',          'PL', 54.3520, 18.6466),
('SZCZECIN',        'PL', 53.4285, 14.5528),
('LUBLIN',          'PL', 51.2465, 22.5684),
('KATOWICE',        'PL', 50.2649, 19.0238),
('BIALYSTOK',       'PL', 53.1325, 23.1688),
('BYDGOSZCZ',       'PL', 53.1235, 18.0084),
('RZESZOW',         'PL', 50.0412, 21.9991),
('KOSZALIN',        'PL', 54.1943, 16.1714),
-- Germany
('BERLIN',          'DE', 52.5200, 13.4050),
('HAMBURG',         'DE', 53.5511,  9.9937),
('DRESDEN',         'DE', 51.0504, 13.7373),
('LIPSK',           'DE', 51.3397, 12.3731),
('MONACHIUM',       'DE', 48.1351, 11.5820),
('FRANKFURT',       'DE', 50.1109,  8.6821),
('NORYMBERGA',      'DE', 49.4521, 11.0767),
('ROSTOCK',         'DE', 54.0924, 12.0991),
-- Czechia
('PRAGA',           'CZ', 50.0755, 14.4378),
('BRNO',            'CZ', 49.1951, 16.6068),
('OSTRAWA',         'CZ', 49.8209, 18.2625),
-- Slovakia
('BRATYSLAWA',      'SK', 48.1486, 17.1077),
('KOSZYCE',         'SK', 48.7164, 21.2611),
('ZILINA',          'SK', 49.2231, 18.7394),
-- Lithuania
('WILNO',           'LT', 54.6872, 25.2797),
('KOWNO',           'LT', 54.8985, 23.9036),
('KLAJPEDA',        'LT', 55.7033, 21.1443);

-- ============ CARGO OFFERS ============
-- Subselects resolve city ids by name, so the seed does not depend on generated ids.
INSERT INTO cargo_offers
(origin_city_id, destination_city_id, container_type, cargo_weight_kg, price_per_km, company_name, pickup_date)
VALUES
-- Return legs to Poland from Germany
((SELECT id FROM cities WHERE name = 'BERLIN'),     (SELECT id FROM cities WHERE name = 'WARSZAWA'),  'TRUCK_24T', 18000, 1.45, 'EuroFreight GmbH',     CURRENT_DATE + 1),
((SELECT id FROM cities WHERE name = 'BERLIN'),     (SELECT id FROM cities WHERE name = 'POZNAN'),    'TRUCK_24T', 22000, 1.20, 'Spree Logistik',       CURRENT_DATE + 1),
((SELECT id FROM cities WHERE name = 'HAMBURG'),    (SELECT id FROM cities WHERE name = 'GDANSK'),    'TRUCK_24T', 20000, 1.38, 'Nordic Cargo',         CURRENT_DATE + 2),
((SELECT id FROM cities WHERE name = 'DRESDEN'),    (SELECT id FROM cities WHERE name = 'WROCLAW'),   'TRUCK_12T',  9000, 1.60, 'Elbe Transport',       CURRENT_DATE + 1),
((SELECT id FROM cities WHERE name = 'LIPSK'),      (SELECT id FROM cities WHERE name = 'KATOWICE'),  'TRUCK_24T', 24000, 1.30, 'Saxon Haulage',        CURRENT_DATE + 3),
((SELECT id FROM cities WHERE name = 'FRANKFURT'),  (SELECT id FROM cities WHERE name = 'LODZ'),      'REEFER_24T',16000, 1.85, 'FrischKette AG',       CURRENT_DATE + 2),
((SELECT id FROM cities WHERE name = 'MONACHIUM'),  (SELECT id FROM cities WHERE name = 'KRAKOW'),    'TRUCK_24T', 21000, 1.25, 'Bavaria Logistics',    CURRENT_DATE + 2),
((SELECT id FROM cities WHERE name = 'NORYMBERGA'), (SELECT id FROM cities WHERE name = 'WARSZAWA'),  'VAN_3T',     2500, 1.10, 'QuickVan Express',     CURRENT_DATE + 1),
((SELECT id FROM cities WHERE name = 'ROSTOCK'),    (SELECT id FROM cities WHERE name = 'SZCZECIN'),  'TRUCK_12T',  8000, 1.50, 'Baltic Freight',       CURRENT_DATE + 1),
-- Czechia / Slovakia
((SELECT id FROM cities WHERE name = 'PRAGA'),      (SELECT id FROM cities WHERE name = 'WROCLAW'),   'TRUCK_24T', 19000, 1.35, 'Vltava Cargo',         CURRENT_DATE + 1),
((SELECT id FROM cities WHERE name = 'BRNO'),       (SELECT id FROM cities WHERE name = 'KATOWICE'),  'TRUCK_12T', 10000, 1.55, 'Morava Trans',         CURRENT_DATE + 2),
((SELECT id FROM cities WHERE name = 'OSTRAWA'),    (SELECT id FROM cities WHERE name = 'KRAKOW'),    'REEFER_24T',14000, 1.95, 'ColdChain CZ',         CURRENT_DATE + 1),
((SELECT id FROM cities WHERE name = 'BRATYSLAWA'), (SELECT id FROM cities WHERE name = 'KRAKOW'),    'TRUCK_24T', 23000, 1.28, 'Danube Logistics',     CURRENT_DATE + 3),
((SELECT id FROM cities WHERE name = 'KOSZYCE'),    (SELECT id FROM cities WHERE name = 'RZESZOW'),   'VAN_3T',     2800, 1.40, 'Tatra Express',        CURRENT_DATE + 1),
((SELECT id FROM cities WHERE name = 'ZILINA'),     (SELECT id FROM cities WHERE name = 'KATOWICE'),  'TRUCK_12T',  9500, 1.48, 'Slovak Freight',       CURRENT_DATE + 2),
-- Lithuania
((SELECT id FROM cities WHERE name = 'WILNO'),      (SELECT id FROM cities WHERE name = 'WARSZAWA'),  'TRUCK_24T', 20000, 1.42, 'Baltic Route UAB',     CURRENT_DATE + 2),
((SELECT id FROM cities WHERE name = 'KOWNO'),      (SELECT id FROM cities WHERE name = 'BIALYSTOK'), 'TRUCK_12T',  7500, 1.52, 'Nemunas Cargo',        CURRENT_DATE + 1),
((SELECT id FROM cities WHERE name = 'KLAJPEDA'),   (SELECT id FROM cities WHERE name = 'GDANSK'),    'REEFER_24T',17000, 1.90, 'Port Reefer LT',       CURRENT_DATE + 3),
-- Cross-border: offers that do NOT lead home (low route-fit, good for contrast in scoring)
((SELECT id FROM cities WHERE name = 'BERLIN'),     (SELECT id FROM cities WHERE name = 'MONACHIUM'), 'TRUCK_24T', 20000, 1.70, 'Autobahn Cargo',       CURRENT_DATE + 1),
((SELECT id FROM cities WHERE name = 'WARSZAWA'),   (SELECT id FROM cities WHERE name = 'BERLIN'),    'TRUCK_24T', 21000, 1.35, 'Wisla Transport',      CURRENT_DATE + 1),
-- Domestic offers in Poland
((SELECT id FROM cities WHERE name = 'POZNAN'),     (SELECT id FROM cities WHERE name = 'KRAKOW'),    'TRUCK_24T', 22000, 1.15, 'Polska Spedycja',      CURRENT_DATE + 2),
((SELECT id FROM cities WHERE name = 'GDANSK'),     (SELECT id FROM cities WHERE name = 'LUBLIN'),    'TRUCK_12T',  9000, 1.30, 'Pomorze Trans',        CURRENT_DATE + 1);