-- ====================================================================
-- OUSHADHASETU: SUPABASE COMPLETE RELATIONAL MIGRATION AND SEED SCRIPT
-- ====================================================================

-- 1. Ensure RLS Policies allow client operations and live sync
ALTER TABLE IF EXISTS organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS refill_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS case_state_transitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS case_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS proactive_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ai_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS agent_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing restrictive policies and create full read/write for application demo
DO $$ 
DECLARE
  tbl text;
BEGIN
  FOR tbl IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
    AND tablename IN (
      'organizations','patients','providers','pharmacies','medications','prescriptions',
      'refill_cases','case_state_transitions','case_timeline','proactive_risks',
      'ai_decisions','agent_actions','communications','escalations','audit_logs'
    )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "allow_anon_all" ON %I;', tbl);
    EXECUTE format('CREATE POLICY "allow_anon_all" ON %I FOR ALL TO public USING (true) WITH CHECK (true);', tbl);
  END LOOP;
END $$;

-- 2. Populate Organizations
INSERT INTO organizations (id, name, created_at)
VALUES 
  ('a233f77a-4213-4335-abdf-a014d3fff84e', 'OushadhaSetu Clinical Center (Lakeside Family Medicine)', NOW())
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 3. Populate Providers
INSERT INTO providers (id, organization_id, name, specialty, email, phone, available, created_at)
VALUES
  ('bbdd1bfc-aabf-4c9a-976e-af7f607ab288', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'Dr. Sarah Lin, MD', 'Family Medicine', 'dr.lin@oushadha.example.com', '+91-9000000001', true, NOW()),
  ('8caf4a02-dd2c-42f7-ad99-8d1d798a1084', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'Dr. Robert Chen, MD', 'Internal Medicine', 'dr.chen@oushadha.example.com', '+91-9000000002', true, NOW()),
  ('06407543-331d-401b-ac3d-064075430640', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'Dr. Anika Rao, MD', 'Primary Care', 'dr.rao@oushadha.example.com', '+91-9000000003', true, NOW()),
  ('4cc85bc4-1cbc-4ae4-863c-4cc85bc44cc8', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'Marcus Chen, NP', 'Nurse Practitioner', 'np.chen@oushadha.example.com', '+91-9000000004', true, NOW())
ON CONFLICT (id) DO NOTHING;

-- 4. Populate Pharmacies
INSERT INTO pharmacies (id, organization_id, name, address, phone, created_at)
VALUES
  ('345ce4ef-1f1f-4f05-86a7-177f8467ee49', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'OushadhaCare Pharmacy', 'Bengaluru Central', '+91-9000000010', NOW()),
  ('ca47bf93-b324-4e57-8f89-20f4b2b392ad', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'CityCare Pharmacy', 'Indiranagar, Bengaluru', '+91-9000000011', NOW()),
  ('4f9f4c48-3cb8-4088-97b8-4f9f4c484f9f', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'GreenLeaf Pharmacy', 'Koramangala, Bengaluru', '+91-9000000012', NOW())
ON CONFLICT (id) DO NOTHING;

-- 5. Populate Medications
INSERT INTO medications (id, name, dosage, form, created_at)
VALUES
  ('785c3d73-949d-469b-ac13-5221b6022347', 'Metformin', '500 mg', 'Tablet', NOW()),
  ('7e26b5f5-8ac2-48e7-ab27-1a36d39df0ed', 'Amlodipine', '5 mg', 'Tablet', NOW()),
  ('83fe0768-ffa0-45fe-9b48-28f3c0b70b6b', 'Atorvastatin', '20 mg', 'Tablet', NOW()),
  ('61dfbe80-864e-4d42-a7bd-1728d45299a4', 'Losartan', '50 mg', 'Tablet', NOW()),
  ('70610cda-8e66-4a2a-a026-70610cda7061', 'Lisinopril', '20 mg', 'Tablet', NOW()),
  ('4e9f11a8-2358-48e8-8258-4e9f11a84e9f', 'Sertraline', '50 mg', 'Tablet', NOW()),
  ('79a33b09-2617-4591-8977-79a33b0979a3', 'Levothyroxine', '75 mcg', 'Tablet', NOW()),
  ('685ce107-3fd9-4aff-a279-685ce107685c', 'Omeprazole', '20 mg', 'Capsule', NOW()),
  ('438d4010-c1f0-4490-87f0-438d4010438d', 'Metoprolol succinate', '50 mg', 'Tablet', NOW()),
  ('3f985001-b01f-4049-b07f-3f9850013f98', 'Albuterol HFA', '90 mcg/actuation', 'Inhaler', NOW()),
  ('6858bfe9-3d37-4971-b497-6858bfe96858', 'Insulin glargine', '100 units/mL', 'Pen', NOW()),
  ('5ccbec34-9a4c-4ad4-adcc-5ccbec345ccb', 'Glipizide', '5 mg', 'Tablet', NOW()),
  ('157a3dd0-7c30-4050-aa30-157a3dd0157a', 'Hydrochlorothiazide', '25 mg', 'Tablet', NOW()),
  ('6f7e8ba2-e89e-4132-855e-6f7e8ba26f7e', 'Carvedilol', '12.5 mg', 'Tablet', NOW()),
  ('749112d7-4809-4f4f-98a9-749112d77491', 'Sitagliptin', '100 mg', 'Tablet', NOW())
ON CONFLICT (id) DO NOTHING;

-- 6. Populate Patients (25 records)
INSERT INTO patients (id, organization_id, name, date_of_birth, phone, email, created_at, updated_at)
VALUES
  ('f82c512f-e81b-45e5-9e34-ae1a83ca8d82', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'John Demo', '1985-04-12', '+91-9000000101', 'john.demo@example.test', NOW(), NOW()),
  ('7de3cdc6-7ac1-4f72-b120-beee452e610b', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'Maria Garcia', '1961-04-12', '+91-9000000102', 'maria.garcia@example.test', NOW(), NOW()),
  ('669d6990-5231-4247-a0a3-20970515b0f8', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'Robert Chen', '1972-11-08', '+91-9000000103', 'robert.chen@example.test', NOW(), NOW()),
  ('4e36e762-e2c9-49f1-8c0b-f02384696613', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'Aisha Patel', '1990-02-20', '+91-9000000104', 'aisha.patel@example.test', NOW(), NOW()),
  ('0034a2ac-b2d4-430c-b354-0034a2ac0034', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'James Carter', '1958-09-03', '+91-9000000105', 'james.carter@example.test', NOW(), NOW()),
  ('0034a2ad-b2f3-4355-b3d3-0034a2ad0034', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'Emily Johnson', '2006-06-15', '+91-9000000106', 'emily.johnson@example.test', NOW(), NOW()),
  ('0034a2ae-b312-439e-b452-0034a2ae0034', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'David Kim', '1966-01-30', '+91-9000000107', 'david.kim@example.test', NOW(), NOW()),
  ('0034a2af-b331-43e7-b4d1-0034a2af0034', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'Linda Brown', '1955-07-22', '+91-9000000108', 'linda.brown@example.test', NOW(), NOW()),
  ('0034a2b0-b350-4430-b550-0034a2b00034', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'Michael Davis', '1980-03-11', '+91-9000000109', 'michael.davis@example.test', NOW(), NOW()),
  ('065fb288-9e78-48c8-9178-065fb288065f', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'Sofia Garcia', '1985-12-01', '+91-9000000110', 'sofia.garcia@example.test', NOW(), NOW()),
  ('065fb289-9e97-4911-91f7-065fb289065f', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'William Wilson', '1949-05-17', '+91-9000000111', 'william.wilson@example.test', NOW(), NOW()),
  ('065fb28a-9eb6-495a-9276-065fb28a065f', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'Olivia Martinez', '1993-08-09', '+91-9000000112', 'olivia.martinez@example.test', NOW(), NOW()),
  ('065fb28b-9ed5-49a3-92f5-065fb28b065f', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'Daniel Anderson', '1970-10-25', '+91-9000000113', 'daniel.anderson@example.test', NOW(), NOW()),
  ('065fb28c-9ef4-49ec-9374-065fb28c065f', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'Grace Thomas', '1962-02-14', '+91-9000000114', 'grace.thomas@example.test', NOW(), NOW()),
  ('065fb28d-9f13-4a35-93f3-065fb28d065f', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'Henry Taylor', '1945-09-30', '+91-9000000115', 'henry.taylor@example.test', NOW(), NOW()),
  ('065fb28e-9f32-4a7e-9472-065fb28e065f', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'Chloe Moore', '1998-04-05', '+91-9000000116', 'chloe.moore@example.test', NOW(), NOW()),
  ('065fb28f-9f51-4ac7-94f1-065fb28f065f', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'Samuel Jackson', '1975-06-19', '+91-9000000117', 'samuel.jackson@example.test', NOW(), NOW()),
  ('065fb290-9f70-4b10-9570-065fb290065f', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'Harper White', '1988-10-02', '+91-9000000118', 'harper.white@example.test', NOW(), NOW()),
  ('065fb291-9f8f-4b59-95ef-065fb291065f', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'Lucas Harris', '1952-03-28', '+91-9000000119', 'lucas.harris@example.test', NOW(), NOW()),
  ('065fb2a7-a239-419f-a0d9-065fb2a7065f', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'Evelyn Clark', '1968-08-16', '+91-9000000120', 'evelyn.clark@example.test', NOW(), NOW()),
  ('065fb2a8-a258-41e8-a158-065fb2a8065f', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'Alexander Lewis', '1982-12-30', '+91-9000000121', 'alexander.lewis@example.test', NOW(), NOW()),
  ('065fb2a9-a277-4231-a1d7-065fb2a9065f', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'Mia Robinson', '1995-07-07', '+91-9000000122', 'mia.robinson@example.test', NOW(), NOW()),
  ('065fb2aa-a296-427a-a256-065fb2aa065f', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'Ethan Walker', '1960-01-18', '+91-9000000123', 'ethan.walker@example.test', NOW(), NOW()),
  ('065fb2ab-a2b5-42c3-a2d5-065fb2ab065f', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'Ava Hall', '1978-05-24', '+91-9000000124', 'ava.hall@example.test', NOW(), NOW()),
  ('065fb2ac-a2d4-430c-a354-065fb2ac065f', 'a233f77a-4213-4335-abdf-a014d3fff84e', 'Benjamin Young', '1943-11-12', '+91-9000000125', 'benjamin.young@example.test', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 7. Populate Prescriptions (Relating Patient -> Provider -> Pharmacy -> Medication)
INSERT INTO prescriptions (id, patient_id, provider_id, pharmacy_id, medication_id, quantity, refills_remaining, days_supply, days_supply_remaining, last_refill_date, next_expected_refill_date, historical_refill_lag_days, active, created_at, updated_at)
VALUES
  ('8c0f098e-e1ad-4c44-a41c-58abff1ee0d7', 'f82c512f-e81b-45e5-9e34-ae1a83ca8d82', 'bbdd1bfc-aabf-4c9a-976e-af7f607ab288', '345ce4ef-1f1f-4f05-86a7-177f8467ee49', '785c3d73-949d-469b-ac13-5221b6022347', 30, 0, 30, 2, '2026-08-30', '2026-09-29', 5, true, NOW(), NOW()),
  ('3b4b907a-08e2-43df-92e2-30bd4d40e0a6', '7de3cdc6-7ac1-4f72-b120-beee452e610b', 'bbdd1bfc-aabf-4c9a-976e-af7f607ab288', '345ce4ef-1f1f-4f05-86a7-177f8467ee49', '7e26b5f5-8ac2-48e7-ab27-1a36d39df0ed', 30, 2, 30, 12, '2026-09-09', '2026-10-09', 3, true, NOW(), NOW()),
  ('408a70a9-dd5a-4e82-a880-c00a3c3b243f', '669d6990-5231-4247-a0a3-20970515b0f8', '8caf4a02-dd2c-42f7-ad99-8d1d798a1084', 'ca47bf93-b324-4e57-8f89-20f4b2b392ad', '83fe0768-ffa0-45fe-9b48-28f3c0b70b6b', 30, 0, 30, 1, '2026-08-29', '2026-09-28', 4, true, NOW(), NOW()),
  ('aee4f24f-abe9-4bcf-b176-2d0d3a93cfa8', '4e36e762-e2c9-49f1-8c0b-f02384696613', 'bbdd1bfc-aabf-4c9a-976e-af7f607ab288', '345ce4ef-1f1f-4f05-86a7-177f8467ee49', '61dfbe80-864e-4d42-a7bd-1728d45299a4', 30, 1, 30, 18, '2026-09-15', '2026-10-15', 3, true, NOW(), NOW()),
  ('00359a6e-b352-495e-9c92-00359a6e0035', '0034a2ac-b2d4-430c-b354-0034a2ac0034', 'bbdd1bfc-aabf-4c9a-976e-af7f607ab288', '345ce4ef-1f1f-4f05-86a7-177f8467ee49', '70610cda-8e66-4a2a-a026-70610cda7061', 30, 0, 30, 1, '2026-08-28', '2026-09-28', 5, true, NOW(), NOW()),
  ('00359a6f-b371-49a7-9d11-00359a6f0035', '0034a2ad-b2f3-4355-b3d3-0034a2ad0034', '8caf4a02-dd2c-42f7-ad99-8d1d798a1084', 'ca47bf93-b324-4e57-8f89-20f4b2b392ad', '4e9f11a8-2358-48e8-8258-4e9f11a84e9f', 30, 1, 30, 2, '2026-08-28', '2026-09-28', 5, true, NOW(), NOW()),
  ('00359a70-b390-49f0-9d90-00359a700035', '0034a2ae-b312-439e-b452-0034a2ae0034', 'bbdd1bfc-aabf-4c9a-976e-af7f607ab288', '345ce4ef-1f1f-4f05-86a7-177f8467ee49', '79a33b09-2617-4591-8977-79a33b0979a3', 30, 2, 30, 3, '2026-08-28', '2026-09-28', 5, true, NOW(), NOW()),
  ('00359a71-b3af-4a39-9e0f-00359a710035', '0034a2af-b331-43e7-b4d1-0034a2af0034', '8caf4a02-dd2c-42f7-ad99-8d1d798a1084', 'ca47bf93-b324-4e57-8f89-20f4b2b392ad', '685ce107-3fd9-4aff-a279-685ce107685c', 30, 0, 30, 4, '2026-08-28', '2026-09-28', 5, true, NOW(), NOW()),
  ('00359a72-b3ce-4a82-9e8e-00359a720035', '0034a2b0-b350-4430-b550-0034a2b00034', 'bbdd1bfc-aabf-4c9a-976e-af7f607ab288', '345ce4ef-1f1f-4f05-86a7-177f8467ee49', '438d4010-c1f0-4490-87f0-438d4010438d', 30, 1, 30, 5, '2026-08-28', '2026-09-28', 5, true, NOW(), NOW()),
  ('067db306-adba-4cb6-8ffa-067db306067d', '065fb288-9e78-48c8-9178-065fb288065f', '8caf4a02-dd2c-42f7-ad99-8d1d798a1084', 'ca47bf93-b324-4e57-8f89-20f4b2b392ad', '3f985001-b01f-4049-b07f-3f9850013f98', 30, 2, 30, 1, '2026-08-28', '2026-09-28', 5, true, NOW(), NOW()),
  ('067db307-add9-4cff-9079-067db307067d', '065fb289-9e97-4911-91f7-065fb289065f', 'bbdd1bfc-aabf-4c9a-976e-af7f607ab288', '345ce4ef-1f1f-4f05-86a7-177f8467ee49', '6858bfe9-3d37-4971-b497-6858bfe96858', 30, 0, 30, 2, '2026-08-28', '2026-09-28', 5, true, NOW(), NOW()),
  ('067db308-adf8-4d48-90f8-067db308067d', '065fb28a-9eb6-495a-9276-065fb28a065f', '8caf4a02-dd2c-42f7-ad99-8d1d798a1084', 'ca47bf93-b324-4e57-8f89-20f4b2b392ad', '5ccbec34-9a4c-4ad4-adcc-5ccbec345ccb', 30, 1, 30, 3, '2026-08-28', '2026-09-28', 5, true, NOW(), NOW()),
  ('067db309-ae17-4d91-9177-067db309067d', '065fb28b-9ed5-49a3-92f5-065fb28b065f', 'bbdd1bfc-aabf-4c9a-976e-af7f607ab288', '345ce4ef-1f1f-4f05-86a7-177f8467ee49', '157a3dd0-7c30-4050-aa30-157a3dd0157a', 30, 2, 30, 4, '2026-08-28', '2026-09-28', 5, true, NOW(), NOW()),
  ('067db30a-ae36-4dda-91f6-067db30a067d', '065fb28c-9ef4-49ec-9374-065fb28c065f', '8caf4a02-dd2c-42f7-ad99-8d1d798a1084', 'ca47bf93-b324-4e57-8f89-20f4b2b392ad', '6f7e8ba2-e89e-4132-855e-6f7e8ba26f7e', 30, 0, 30, 5, '2026-08-28', '2026-09-28', 5, true, NOW(), NOW()),
  ('067db30b-ae55-4e23-9275-067db30b067d', '065fb28d-9f13-4a35-93f3-065fb28d065f', 'bbdd1bfc-aabf-4c9a-976e-af7f607ab288', '345ce4ef-1f1f-4f05-86a7-177f8467ee49', '749112d7-4809-4f4f-98a9-749112d77491', 30, 1, 30, 1, '2026-08-28', '2026-09-28', 5, true, NOW(), NOW()),
  ('067db30c-ae74-4e6c-92f4-067db30c067d', '065fb28e-9f32-4a7e-9472-065fb28e065f', '8caf4a02-dd2c-42f7-ad99-8d1d798a1084', 'ca47bf93-b324-4e57-8f89-20f4b2b392ad', '785c3d73-949d-469b-ac13-5221b6022347', 30, 2, 30, 2, '2026-08-28', '2026-09-28', 5, true, NOW(), NOW()),
  ('067db30d-ae93-4eb5-9373-067db30d067d', '065fb28f-9f51-4ac7-94f1-065fb28f065f', 'bbdd1bfc-aabf-4c9a-976e-af7f607ab288', '345ce4ef-1f1f-4f05-86a7-177f8467ee49', '7e26b5f5-8ac2-48e7-ab27-1a36d39df0ed', 30, 0, 30, 3, '2026-08-28', '2026-09-28', 5, true, NOW(), NOW()),
  ('067db30e-aeb2-4efe-93f2-067db30e067d', '065fb290-9f70-4b10-9570-065fb290065f', '8caf4a02-dd2c-42f7-ad99-8d1d798a1084', 'ca47bf93-b324-4e57-8f89-20f4b2b392ad', '83fe0768-ffa0-45fe-9b48-28f3c0b70b6b', 30, 1, 30, 4, '2026-08-28', '2026-09-28', 5, true, NOW(), NOW()),
  ('067db30f-aed1-4f47-9471-067db30f067d', '065fb291-9f8f-4b59-95ef-065fb291065f', 'bbdd1bfc-aabf-4c9a-976e-af7f607ab288', '345ce4ef-1f1f-4f05-86a7-177f8467ee49', '61dfbe80-864e-4d42-a7bd-1728d45299a4', 30, 2, 30, 5, '2026-08-28', '2026-09-28', 5, true, NOW(), NOW()),
  ('067db325-b17b-458d-9f5b-067db325067d', '065fb2a7-a239-419f-a0d9-065fb2a7065f', '8caf4a02-dd2c-42f7-ad99-8d1d798a1084', 'ca47bf93-b324-4e57-8f89-20f4b2b392ad', '70610cda-8e66-4a2a-a026-70610cda7061', 30, 0, 30, 1, '2026-08-28', '2026-09-28', 5, true, NOW(), NOW()),
  ('067db326-b19a-45d6-9fda-067db326067d', '065fb2a8-a258-41e8-a158-065fb2a8065f', 'bbdd1bfc-aabf-4c9a-976e-af7f607ab288', '345ce4ef-1f1f-4f05-86a7-177f8467ee49', '4e9f11a8-2358-48e8-8258-4e9f11a84e9f', 30, 1, 30, 2, '2026-08-28', '2026-09-28', 5, true, NOW(), NOW()),
  ('067db327-b1b9-461f-a059-067db327067d', '065fb2a9-a277-4231-a1d7-065fb2a9065f', '8caf4a02-dd2c-42f7-ad99-8d1d798a1084', 'ca47bf93-b324-4e57-8f89-20f4b2b392ad', '79a33b09-2617-4591-8977-79a33b0979a3', 30, 2, 30, 3, '2026-08-28', '2026-09-28', 5, true, NOW(), NOW()),
  ('067db328-b1d8-4668-a0d8-067db328067d', '065fb2aa-a296-427a-a256-065fb2aa065f', 'bbdd1bfc-aabf-4c9a-976e-af7f607ab288', '345ce4ef-1f1f-4f05-86a7-177f8467ee49', '685ce107-3fd9-4aff-a279-685ce107685c', 30, 0, 30, 4, '2026-08-28', '2026-09-28', 5, true, NOW(), NOW()),
  ('067db329-b1f7-46b1-a157-067db329067d', '065fb2ab-a2b5-42c3-a2d5-065fb2ab065f', '8caf4a02-dd2c-42f7-ad99-8d1d798a1084', 'ca47bf93-b324-4e57-8f89-20f4b2b392ad', '438d4010-c1f0-4490-87f0-438d4010438d', 30, 1, 30, 5, '2026-08-28', '2026-09-28', 5, true, NOW(), NOW()),
  ('067db32a-b216-46fa-a1d6-067db32a067d', '065fb2ac-a2d4-430c-a354-065fb2ac065f', 'bbdd1bfc-aabf-4c9a-976e-af7f607ab288', '345ce4ef-1f1f-4f05-86a7-177f8467ee49', '3f985001-b01f-4049-b07f-3f9850013f98', 30, 2, 30, 1, '2026-08-28', '2026-09-28', 5, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 8. Populate Refill Cases
INSERT INTO refill_cases (id, patient_id, prescription_id, provider_id, pharmacy_id, current_state, blocker, responsible_party, risk_level, risk_score, days_waiting, recommended_action, resolution_probability, escalation_required, resolved, source, created_at, updated_at)
VALUES
  ('edbfc832-9a40-4101-bef2-c5ea969536fc', 'f82c512f-e81b-45e5-9e34-ae1a83ca8d82', '8c0f098e-e1ad-4c44-a41c-58abff1ee0d7', 'bbdd1bfc-aabf-4c9a-976e-af7f607ab288', '345ce4ef-1f1f-4f05-86a7-177f8467ee49', 'Provider Approval Required', 'No refills remaining', 'Provider', 'HIGH', 88, 5, 'Request provider approval', 72, false, false, 'REFILL_REQUEST', NOW() - INTERVAL '5 days', NOW()),
  ('9e6862be-f524-4ddd-bc64-4778d553241c', '7de3cdc6-7ac1-4f72-b120-beee452e610b', '3b4b907a-08e2-43df-92e2-30bd4d40e0a6', 'bbdd1bfc-aabf-4c9a-976e-af7f607ab288', '345ce4ef-1f1f-4f05-86a7-177f8467ee49', 'Insurance Blocked', 'Updated insurance information required', 'Patient', 'MEDIUM', 65, 2, 'Request updated insurance information', 81, false, false, 'REFILL_REQUEST', NOW() - INTERVAL '2 days', NOW()),
  ('3f705d5f-0e60-487c-9d99-ffd17dd22d95', '669d6990-5231-4247-a0a3-20970515b0f8', '408a70a9-dd5a-4e82-a880-c00a3c3b243f', '8caf4a02-dd2c-42f7-ad99-8d1d798a1084', 'ca47bf93-b324-4e57-8f89-20f4b2b392ad', 'Escalated', 'Provider response overdue', 'Nurse', 'CRITICAL', 97, 4, 'Escalate to nurse', 45, true, false, 'REFILL_REQUEST', NOW() - INTERVAL '4 days', NOW()),
  ('0001794a-aff6-461a-abb6-0001794a0001', '4e36e762-e2c9-49f1-8c0b-f02384696613', 'aee4f24f-abe9-4bcf-b176-2d0d3a93cfa8', 'bbdd1bfc-aabf-4c9a-976e-af7f607ab288', '345ce4ef-1f1f-4f05-86a7-177f8467ee49', 'Appointment Required', 'Annual hypertension checkup overdue', 'Patient', 'HIGH', 82, 3, 'Schedule clinical visit and bridge 30d supply', 78, false, false, 'PORTAL', NOW() - INTERVAL '3 days', NOW()),
  ('0001794b-b015-4663-ac35-0001794b0001', '0034a2ac-b2d4-430c-b354-0034a2ac0034', '00359a6e-b352-495e-9c92-00359a6e0035', '8caf4a02-dd2c-42f7-ad99-8d1d798a1084', 'ca47bf93-b324-4e57-8f89-20f4b2b392ad', 'Controlled Substance Review', 'Schedule II renewal requires direct provider review', 'Provider', 'CRITICAL', 95, 2, 'Queue for prescriber step-up auth', 60, true, false, 'FAX', NOW() - INTERVAL '2 days', NOW()),
  ('0001794c-b034-46ac-acb4-0001794c0001', '0034a2ad-b2f3-4355-b3d3-0034a2ad0034', '00359a6f-b371-49a7-9d11-00359a6f0035', 'bbdd1bfc-aabf-4c9a-976e-af7f607ab288', '345ce4ef-1f1f-4f05-86a7-177f8467ee49', 'Pending Lab Review', 'Serum creatinine test required', 'Clinical Staff', 'MEDIUM', 70, 1, 'Send lab requisition link to patient', 85, false, false, 'ELECTRONIC', NOW() - INTERVAL '1 day', NOW()),
  ('0001794d-b053-46f5-ad33-0001794d0001', '0034a2ae-b312-439e-b452-0034a2ae0034', '00359a70-b390-49f0-9d90-00359a700035', '8caf4a02-dd2c-42f7-ad99-8d1d798a1084', 'ca47bf93-b324-4e57-8f89-20f4b2b392ad', 'Approved and Dispensed', 'Refill renewal completed', 'Pharmacy', 'LOW', 20, 0, 'Completed', 99, false, true, 'PORTAL', NOW() - INTERVAL '6 days', NOW()),
  ('0001794e-b072-473e-adb2-0001794e0001', '0034a2af-b331-43e7-b4d1-0034a2af0034', '00359a71-b3af-4a39-9e0f-00359a710035', 'bbdd1bfc-aabf-4c9a-976e-af7f607ab288', '345ce4ef-1f1f-4f05-86a7-177f8467ee49', 'Waiting on Patient Visit', 'Patient has not scheduled follow-up', 'Patient', 'HIGH', 86, 6, 'Send SMS reminder with scheduling link', 68, true, false, 'PHONE', NOW() - INTERVAL '6 days', NOW())
ON CONFLICT (id) DO UPDATE SET current_state = EXCLUDED.current_state;

-- 9. Populate Proactive Risks (Joining Patients, Prescriptions, Medications)
INSERT INTO proactive_risks (id, patient_id, prescription_id, days_remaining, historical_refill_lag_days, refill_request_exists, risk_score, risk_level, risk_reason, recommended_action, outreach_status, prevented_lapse, detected_at, resolved_at)
VALUES
  ('9bede9fc-a029-4239-90ce-50edc7c93036', 'f82c512f-e81b-45e5-9e34-ae1a83ca8d82', '8c0f098e-e1ad-4c44-a41c-58abff1ee0d7', 2, 5, false, 94, 'HIGH', 'Days remaining (2) is less than historical fulfillment lag (5 days). Zero refills remaining.', 'Initiate proactive patient outreach via SMS and bridge supply.', 'PENDING', false, NOW() - INTERVAL '12 hours', null),
  ('00349b27-c9b9-4e1f-b859-00349b270034', '7de3cdc6-7ac1-4f72-b120-beee452e610b', '3b4b907a-08e2-43df-92e2-30bd4d40e0a6', 1, 4, false, 98, 'CRITICAL', 'Critical blood pressure therapy. 1 day supply remaining with no pending pharmacy refill.', 'Alert care coordinator and route immediate bridge prescription.', 'NOT_STARTED', false, NOW() - INTERVAL '6 hours', null),
  ('00349b28-c9d8-4e68-b8d8-00349b280034', '669d6990-5231-4247-a0a3-20970515b0f8', '408a70a9-dd5a-4e82-a880-c00a3c3b243f', 3, 6, false, 89, 'HIGH', 'Statin adherence gap risk: 3 days remaining versus 6 days average clinic turnaround.', 'Send automated adherence reminder via patient portal.', 'NOT_STARTED', false, NOW() - INTERVAL '1 day', null),
  ('00349b29-c9f7-4eb1-b957-00349b290034', '4e36e762-e2c9-49f1-8c0b-f02384696613', 'aee4f24f-abe9-4bcf-b176-2d0d3a93cfa8', 2, 4, true, 40, 'LOW', 'Outreach initiated and renewal approved.', 'Bridge supply fulfilled successfully.', 'COMPLETED', true, NOW() - INTERVAL '2 days', NOW() - INTERVAL '4 hours')
ON CONFLICT (id) DO NOTHING;

-- 10. Populate AI Decisions
INSERT INTO ai_decisions (id, refill_case_id, proactive_risk_id, agent_name, decision_type, recommendation, reasoning, confidence, evidence, human_approval_status, created_at)
VALUES
  ('270b84c0-7063-4580-8950-84aefa43c190', 'edbfc832-9a40-4101-bef2-c5ea969536fc', null, 'Resolution Agent', 'NEXT_BEST_ACTION', 'Request provider approval for 90-day renewal', 'No refills remain and patient has 2 days medication supply.', 92, '["No refills remaining", "Patient has 2 days supply", "Provider approval required", "Chronic maintenance therapy"]'::jsonb, 'PENDING', NOW() - INTERVAL '2 hours'),
  ('05b09127-93b9-441f-8259-05b0912705b0', '9e6862be-f524-4ddd-bc64-4778d553241c', null, 'Intake Agent', 'INSURANCE_RESOLUTION', 'Trigger automated patient copay & insurance card verification portal link', 'Claim rejected with code PA_REQUIRED on previous attempt.', 89, '["Prior authorization required", "Patient insurance changed", "Formulary tier 2 match"]'::jsonb, 'PENDING', NOW() - INTERVAL '5 hours'),
  ('05b09128-93d8-4468-82d8-05b0912805b0', '3f705d5f-0e60-487c-9d99-ffd17dd22d95', null, 'Escalation Agent', 'SLA_ESCALATION', 'Escalate to charge nurse and covering MD for immediate bridge supply', 'Request has exceeded 72-hour clinical SLA threshold.', 96, '["Waiting 4 days", "SLA breached (>72h)", "Zero provider in-basket response", "Vital medication"]'::jsonb, 'APPROVED', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- 11. Populate Agent Actions
INSERT INTO agent_actions (id, refill_case_id, agent_name, action, reason, status, created_at)
VALUES
  ('0585a1b6-950a-4ce6-b94a-0585a1b60585', 'edbfc832-9a40-4101-bef2-c5ea969536fc', 'Intake Agent', 'Classified inbound pharmacy request as routine maintenance Metformin renewal', 'Parsed electronic fax and matched EHR patient chart', 'COMPLETED', NOW() - INTERVAL '5 days'),
  ('0585a1b7-9529-4d2f-b9c9-0585a1b70585', 'edbfc832-9a40-4101-bef2-c5ea969536fc', 'Resolution Agent', 'Prepared clinical protocol recommendation for 90-day supply', 'Patient last seen 4 months ago; regimen stable', 'COMPLETED', NOW() - INTERVAL '4 days'),
  ('0585a1b8-9548-4d78-ba48-0585a1b80585', '9e6862be-f524-4ddd-bc64-4778d553241c', 'Communication Agent', 'Sent SMS notification to patient Maria Garcia requesting updated insurance card', 'Insurance eligibility check flagged PA_REQUIRED', 'COMPLETED', NOW() - INTERVAL '2 days'),
  ('0585a1b9-9567-4dc1-bac7-0585a1b90585', '3f705d5f-0e60-487c-9d99-ffd17dd22d95', 'Escalation Agent', 'Flagged case SLA breach to charge nurse on duty', 'Case aging exceeded clinic threshold of 48 hours', 'COMPLETED', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- 12. Populate Case Timeline
INSERT INTO case_timeline (id, refill_case_id, event_type, title, description, actor_type, created_at)
VALUES
  ('8a0eac49-5f53-42f2-9ccb-5f1a25270c5b', 'edbfc832-9a40-4101-bef2-c5ea969536fc', 'REQUESTED', 'Refill Requested', 'Prescription refill request was received from OushadhaCare Pharmacy.', 'SYSTEM', NOW() - INTERVAL '5 days'),
  ('c4280e1c-87f5-453d-b6d0-dbacd51b016c', 'edbfc832-9a40-4101-bef2-c5ea969536fc', 'PROVIDER_REVIEW', 'Provider Review Required', 'Provider approval is required because no refills remain on active script.', 'AI', NOW() - INTERVAL '4 days'),
  ('0036561e-6da2-4e8e-b8e2-0036561e0036', 'edbfc832-9a40-4101-bef2-c5ea969536fc', 'AI_TRIAGE', 'Autonomous Safety Verification Passed', 'Oushadha AI verified drug-drug interactions and patient compliance.', 'AI', NOW() - INTERVAL '3 days'),
  ('0036561f-6dc1-4ed7-b961-0036561f0036', '9e6862be-f524-4ddd-bc64-4778d553241c', 'INSURANCE_FLAGGED', 'Insurance Check Required', 'Pharmacy flagged prior authorization requirement.', 'SYSTEM', NOW() - INTERVAL '2 days'),
  ('00365620-6de0-4f20-b9e0-003656200036', '3f705d5f-0e60-487c-9d99-ffd17dd22d95', 'ESCALATED', 'Overdue Escalation Triggered', 'SLA breached after 72 hours of inactivity; routed to duty nurse.', 'AI', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- 13. Populate Case State Transitions
INSERT INTO case_state_transitions (id, refill_case_id, previous_state, new_state, reason, created_at)
VALUES
  ('05a916a8-be58-45e8-bd58-05a916a805a9', 'edbfc832-9a40-4101-bef2-c5ea969536fc', 'NEW', 'Provider Approval Required', 'Automated intake determined zero refills remaining', NOW() - INTERVAL '5 days'),
  ('05a916a9-be77-4631-bdd7-05a916a905a9', '9e6862be-f524-4ddd-bc64-4778d553241c', 'NEW', 'Insurance Blocked', 'Eligibility check failed on formulary tier', NOW() - INTERVAL '2 days'),
  ('05a916aa-be96-467a-be56-05a916aa05a9', '3f705d5f-0e60-487c-9d99-ffd17dd22d95', 'Provider Approval Required', 'Escalated', 'SLA timer expired with zero prescriber sign-off', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- 14. Populate Communications
INSERT INTO communications (id, refill_case_id, patient_id, message, recipient, status, created_at)
VALUES
  ('50c0de50-ebb0-44d0-89b0-50c0de5050c0', 'edbfc832-9a40-4101-bef2-c5ea969536fc', 'f82c512f-e81b-45e5-9e34-ae1a83ca8d82', 'Your Metformin 500mg refill is with Dr. Sarah Lin for renewal review. We will notify you once dispatched.', '+91-9000000101', 'SENT', NOW() - INTERVAL '2 days'),
  ('50c0de4f-eb91-4487-8931-50c0de4f50c0', '9e6862be-f524-4ddd-bc64-4778d553241c', '7de3cdc6-7ac1-4f72-b120-beee452e610b', 'Please upload your updated insurance card to avoid a refill delay on your Amlodipine prescription.', '+91-9000000102', 'DELIVERED', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- 15. Populate Escalations
INSERT INTO escalations (id, refill_case_id, escalation_level, reason, status, resolved_at, created_at)
VALUES
  ('05c505d9-b547-4ae1-a6a7-05c505d905c5', '3f705d5f-0e60-487c-9d99-ffd17dd22d95', 1, 'Provider response overdue past clinic SLA (>72 hours) for vital Atorvastatin maintenance', 'ACTIVE', null, NOW() - INTERVAL '1 day'),
  ('05c505da-b566-4b2a-a726-05c505da05c5', '0001794b-b015-4663-ac35-0001794b0001', 2, 'Schedule II controlled medication renewal approaching hard lapse threshold', 'PENDING_REVIEW', null, NOW() - INTERVAL '12 hours')
ON CONFLICT (id) DO NOTHING;

-- 16. Populate Audit Logs
INSERT INTO audit_logs (id, refill_case_id, actor_type, actor_name, action, details, created_at)
VALUES
  ('619c6a00-d5ff-43ca-b800-a4b6980e560d', 'edbfc832-9a40-4101-bef2-c5ea969536fc', 'AI', 'Resolution Agent', 'Recommended provider approval', '{"risk": "HIGH", "confidence": 92}'::jsonb, NOW() - INTERVAL '2 days'),
  ('058d9455-f64b-4c3d-962b-058d9455058d', 'edbfc832-9a40-4101-bef2-c5ea969536fc', 'USER', 'Licensed Clinical Staff', 'APPROVED AI Recommendation: Request provider approval for renewal', '{"action": "approved", "risk": "HIGH", "confidence": 92}'::jsonb, NOW() - INTERVAL '1 hour'),
  ('058d9456-f66a-4c86-96aa-058d9456058d', '3f705d5f-0e60-487c-9d99-ffd17dd22d95', 'AI', 'Escalation Agent', 'Triggered SLA breach escalation', '{"slaMinutes": 4320, "elapsedMinutes": 5760}'::jsonb, NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;
