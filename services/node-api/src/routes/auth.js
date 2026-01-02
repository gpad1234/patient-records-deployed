const express = require('express');
const router = express.Router();
const { generateToken, hashPassword, verifyPassword, authenticate } = require('../middleware/auth');

// Initialize auth routes with database
function initAuthRoutes(db) {
  
  // Register new user
  router.post('/register', (req, res) => {
    const { username, email, password, firstName, lastName, role = 'patient', patientId } = req.body;
    
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['username', 'email', 'password', 'firstName', 'lastName']
      });
    }
    
    // Validate role
    const validRoles = ['admin', 'doctor', 'nurse', 'receptionist', 'patient'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role',
        validRoles
      });
    }
    
    const passwordHash = hashPassword(password);
    
    const query = `
      INSERT INTO users (username, email, password_hash, first_name, last_name, role, patient_id, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `;
    
    db.run(query, [username, email, passwordHash, firstName, lastName, role, patientId || null], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint')) {
          return res.status(409).json({ 
            error: 'Username or email already exists'
          });
        }
        console.error('Registration error:', err);
        return res.status(500).json({ error: 'Registration failed' });
      }
      
      const userId = this.lastID;
      const token = generateToken(userId, username, role);
      
      // Log the action
      db.run(
        'INSERT INTO audit_log (user_id, action, resource_type, resource_id, ip_address) VALUES (?, ?, ?, ?, ?)',
        [userId, 'register', 'user', userId, req.ip]
      );
      
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: userId,
          username,
          email,
          firstName,
          lastName,
          role
        },
        token
      });
    });
  });
  
  // Login
  router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required'
      });
    }
    
    const query = `
      SELECT id, username, email, password_hash, first_name, last_name, role, is_active, patient_id
      FROM users 
      WHERE username = ? OR email = ?
    `;
    
    db.get(query, [username, username], (err, user) => {
      if (err) {
        console.error('Login query error:', err);
        return res.status(500).json({ error: 'Login failed' });
      }
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      if (!user.is_active) {
        return res.status(403).json({ error: 'Account is inactive' });
      }
      
      if (!verifyPassword(password, user.password_hash)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Update last login
      db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
      
      // Log the action
      db.run(
        'INSERT INTO audit_log (user_id, action, ip_address) VALUES (?, ?, ?)',
        [user.id, 'login', req.ip]
      );
      
      const token = generateToken(user.id, user.username, user.role);
      
      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          patientId: user.patient_id
        },
        token
      });
    });
  });
  
  // Get current user profile (requires authentication)
  router.get('/me', authenticate, (req, res) => {
    const query = `
      SELECT id, username, email, first_name, last_name, role, is_active, patient_id, created_at, last_login
      FROM users 
      WHERE id = ?
    `;
    
    db.get(query, [req.user.userId], (err, user) => {
      if (err) {
        console.error('Get user error:', err);
        return res.status(500).json({ error: 'Failed to fetch user data' });
      }
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        isActive: user.is_active,
        patientId: user.patient_id,
        createdAt: user.created_at,
        lastLogin: user.last_login
      });
    });
  });
  
  // Logout (optional - mainly for audit logging)
  router.post('/logout', authenticate, (req, res) => {
    // Log the action
    db.run(
      'INSERT INTO audit_log (user_id, action, ip_address) VALUES (?, ?, ?)',
      [req.user.userId, 'logout', req.ip]
    );
    
    res.json({ message: 'Logged out successfully' });
  });
  
  // Get role permissions
  router.get('/roles/:roleName', authenticate, (req, res) => {
    const query = 'SELECT * FROM roles WHERE name = ?';
    
    db.get(query, [req.params.roleName], (err, role) => {
      if (err) {
        console.error('Get role error:', err);
        return res.status(500).json({ error: 'Failed to fetch role' });
      }
      
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }
      
      res.json(role);
    });
  });
  
  // Get all roles (admin only)
  router.get('/roles', authenticate, (req, res) => {
    db.all('SELECT * FROM roles', (err, roles) => {
      if (err) {
        console.error('Get roles error:', err);
        return res.status(500).json({ error: 'Failed to fetch roles' });
      }
      
      res.json(roles);
    });
  });
  
  return router;
}

module.exports = initAuthRoutes;
