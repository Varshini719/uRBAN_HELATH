import { Router } from 'express';
import { z } from 'zod';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4)
});

router.post('/login', (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Invalid email or password format' });
  }

  const { email } = result.data;
  const lower = email.toLowerCase();
  const isAnalyst = lower.includes('analyst') || lower.includes('vikram');
  const isSensor = lower.includes('sensor') || lower.includes('kavitha');

  const user = {
    id: isAnalyst ? 'usr_02' : isSensor ? 'usr_03' : 'usr_01',
    name: isAnalyst ? 'Vikram Raman' : isSensor ? 'Kavitha S.' : 'Dr. Anita Prasad',
    email,
    role: isAnalyst ? 'Climate Analyst' : isSensor ? 'Sensor Tech' : 'Chief Resilience Officer',
    department: isAnalyst
      ? 'Atmospheric Data & Hotspot Modeling'
      : isSensor
      ? 'Field Sensor Operations'
      : 'Urban Heat Mitigation Taskforce',
    avatarInitials: isAnalyst ? 'VR' : isSensor ? 'KS' : 'AP',
    badge: isAnalyst ? 'Analytical Lead' : isSensor ? 'Operations Access' : 'Executive Access'
  };

  return res.json({
    token: `thm_${Buffer.from(email).toString('base64').slice(0, 16)}_${Date.now()}`,
    user
  });
});

const VALID_OFFICER_PASSCODES = ['MUNI-2026', 'OFFICER-THERMA-2026', 'CLIMATE-2026'];

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6),
  department: z.string().min(2).max(120),
  role: z.string().min(2).max(80),
  passcode: z.string().optional()
});

router.post('/register', (req, res) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Validation failed', details: result.error.flatten() });
  }

  const { name, email, department, role, passcode } = result.data;
  const isPublicRole = role.toLowerCase().includes('citizen') || role.toLowerCase().includes('observer');

  // Verify departmental authorization key for officer designations
  if (!isPublicRole) {
    const cleanKey = passcode?.trim().toUpperCase();
    if (!cleanKey || !VALID_OFFICER_PASSCODES.includes(cleanKey)) {
      return res.status(403).json({
        error: 'Invalid Municipal Authorization Key. Official officer registrations require a verified departmental key (e.g. MUNI-2026).'
      });
    }
  }

  const initials = name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const user = {
    id: `usr_${Date.now().toString().slice(-4)}`,
    name,
    email,
    role,
    department,
    avatarInitials: initials || 'UR',
    badge: isPublicRole ? 'Citizen Observer' : 'Registered Officer'
  };

  return res.status(201).json({
    token: `thm_${Buffer.from(email).toString('base64').slice(0, 16)}_${Date.now()}`,
    user
  });
});

export default router;
