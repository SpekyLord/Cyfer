-- CYFER: Demo/Seed Data
-- Version: 001
-- Description: Sample data for development and demo purposes

-- =====================================================
-- Seed 1: Create demo admin accounts
-- =====================================================
INSERT INTO users (id, email, name, role, department) VALUES
  ('11111111-1111-1111-1111-111111111111', 'mayor@samplecity.gov.ph', 'Mayor Juan Santos', 'super_admin', 'Office of the Mayor'),
  ('22222222-2222-2222-2222-222222222222', 'treasurer@samplecity.gov.ph', 'Treasurer Maria Cruz', 'admin', 'Treasury Department'),
  ('33333333-3333-3333-3333-333333333333', 'clerk@samplecity.gov.ph', 'Municipal Secretary Pedro Reyes', 'admin', 'Municipal Secretary Office');

-- =====================================================
-- Seed 2: Create genesis block
-- =====================================================
INSERT INTO blockchain (id, timestamp, data, previous_hash, hash, nonce) VALUES
  (0, NOW(), '{"message": "Genesis Block - CYFER Blockchain Initialized", "system": "CYFER v1.0"}', '0', '0000000000000000000000000000000000000000000000000000000000000000', 0);

-- =====================================================
-- Seed 3: Sample budget data for "Municipality of Sample City"
-- =====================================================
INSERT INTO budget_data (fiscal_year, category, allocated_amount, description, uploaded_by) VALUES
  (2026, 'Infrastructure', 15000000.00, 'Road construction, bridges, and public facilities', '11111111-1111-1111-1111-111111111111'),
  (2026, 'Health', 8500000.00, 'Public health services, medical supplies, and hospital equipment', '22222222-2222-2222-2222-222222222222'),
  (2026, 'Education', 12000000.00, 'School building maintenance, educational materials, scholarships', '11111111-1111-1111-1111-111111111111'),
  (2026, 'Social Services', 6000000.00, 'Welfare programs, senior citizen support, disaster relief', '11111111-1111-1111-1111-111111111111'),
  (2026, 'General Administration', 7500000.00, 'Salaries, office supplies, administrative costs', '22222222-2222-2222-2222-222222222222'),
  (2026, 'Public Safety', 5000000.00, 'Police, fire department, emergency services', '11111111-1111-1111-1111-111111111111'),
  (2026, 'Environmental Services', 3500000.00, 'Waste management, sanitation, environmental protection', '11111111-1111-1111-1111-111111111111'),
  (2026, 'Economic Development', 2500000.00, 'Business support, livelihood programs, market development', '22222222-2222-2222-2222-222222222222');

-- =====================================================
-- Seed 4: Sample published document (Optional - for demo)
-- =====================================================
-- Note: In a real scenario, documents would be uploaded via the application
-- This is just a placeholder to show a published document in the demo

INSERT INTO documents (
  id,
  title,
  category,
  description,
  file_name,
  file_ext,
  file_size,
  file_url,
  file_hash,
  uploaded_by,
  status,
  published_at,
  created_at
) VALUES (
  '44444444-4444-4444-4444-444444444444',
  'Municipal Ordinance No. 2026-01: Public Market Operating Hours',
  'ordinance',
  'An ordinance regulating the operating hours of the Sample City Public Market',
  'ordinance-2026-01.pdf',
  '.pdf',
  245600,
  'https://placeholder-storage-url.com/ordinance-2026-01.pdf',
  'a1b2c3d4e5f6789011121314151617181920212223242526272829303132',
  '11111111-1111-1111-1111-111111111111',
  'published',
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '10 days'
);

-- =====================================================
-- Seed 5: Sample approval records for the published document
-- =====================================================
INSERT INTO approvals (document_id, admin_id, status, message, responded_at, created_at) VALUES
  ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'approved', 'Approved. This ordinance aligns with our market regulations.', NOW() - INTERVAL '8 days', NOW() - INTERVAL '10 days'),
  ('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'approved', 'Approved. No budget implications.', NOW() - INTERVAL '8 days', NOW() - INTERVAL '10 days'),
  ('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'approved', 'Approved after legal review.', NOW() - INTERVAL '7 days', NOW() - INTERVAL '10 days');

-- =====================================================
-- Seed 6: Sample blockchain block for the published document
-- =====================================================
INSERT INTO blockchain (timestamp, data, previous_hash, hash, nonce) VALUES
  (
    NOW() - INTERVAL '7 days',
    jsonb_build_object(
      'action', 'document_published',
      'document_id', '44444444-4444-4444-4444-444444444444',
      'document_hash', 'a1b2c3d4e5f6789011121314151617181920212223242526272829303132',
      'title', 'Municipal Ordinance No. 2026-01: Public Market Operating Hours'
    ),
    '0000000000000000000000000000000000000000000000000000000000000000',
    'b1c2d3e4f5a6789012131415161718192021222324252627282930313233343',
    123456
  );

-- =====================================================
-- Seed 7: Sample transaction records
-- =====================================================
INSERT INTO transactions (action_type, description, document_id, performed_by, tx_hash, previous_tx_hash, created_at) VALUES
  (
    'upload',
    'Document uploaded: Municipal Ordinance No. 2026-01',
    '44444444-4444-4444-4444-444444444444',
    'Mayor Juan Santos',
    'tx000000000000000000000000000000000000000000000000000000000001',
    '0',
    NOW() - INTERVAL '10 days'
  ),
  (
    'approve',
    'Document approved by Mayor Juan Santos',
    '44444444-4444-4444-4444-444444444444',
    'Mayor Juan Santos',
    'tx000000000000000000000000000000000000000000000000000000000002',
    'tx000000000000000000000000000000000000000000000000000000000001',
    NOW() - INTERVAL '8 days'
  ),
  (
    'approve',
    'Document approved by Treasurer Maria Cruz',
    '44444444-4444-4444-4444-444444444444',
    'Treasurer Maria Cruz',
    'tx000000000000000000000000000000000000000000000000000000000003',
    'tx000000000000000000000000000000000000000000000000000000000002',
    NOW() - INTERVAL '8 days'
  ),
  (
    'approve',
    'Document approved by Municipal Secretary Pedro Reyes',
    '44444444-4444-4444-4444-444444444444',
    'Municipal Secretary Pedro Reyes',
    'tx000000000000000000000000000000000000000000000000000000000004',
    'tx000000000000000000000000000000000000000000000000000000000003',
    NOW() - INTERVAL '7 days'
  ),
  (
    'publish',
    'Document published after unanimous approval',
    '44444444-4444-4444-4444-444444444444',
    'System',
    'tx000000000000000000000000000000000000000000000000000000000005',
    'tx000000000000000000000000000000000000000000000000000000000004',
    NOW() - INTERVAL '7 days'
  );

-- =====================================================
-- Comments
-- =====================================================
COMMENT ON TABLE users IS 'Demo: 3 admin accounts for UCP demonstration';
COMMENT ON TABLE budget_data IS 'Demo: Sample budget data for Municipality of Sample City (FY 2026)';
COMMENT ON TABLE documents IS 'Demo: One published ordinance to show in the public portal';
