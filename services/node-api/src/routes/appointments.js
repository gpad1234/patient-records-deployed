const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');

// Initialize appointment routes with database
function initAppointmentRoutes(db) {
  
  // Get all appointments (with filters)
  router.get('/', authenticate, (req, res) => {
    const { patientId, providerId, status, date, startDate, endDate } = req.query;
    
    let query = `
      SELECT 
        a.*,
        p.firstName || ' ' || p.lastName as patientName,
        p.dateOfBirth as patientDob,
        p.phone as patientPhone,
        u.first_name || ' ' || u.last_name as providerName,
        u.role as providerRole,
        c.first_name || ' ' || c.last_name as createdByName
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u ON a.provider_id = u.id
      LEFT JOIN users c ON a.created_by = c.id
      WHERE 1=1
    `;
    
    const params = [];
    
    // Apply filters based on user role
    if (req.user.role === 'patient' && req.user.patientId) {
      query += ' AND a.patient_id = ?';
      params.push(req.user.patientId);
    } else if (req.user.role === 'doctor' || req.user.role === 'nurse') {
      query += ' AND a.provider_id = ?';
      params.push(req.user.userId);
    }
    
    // Additional filters
    if (patientId) {
      query += ' AND a.patient_id = ?';
      params.push(patientId);
    }
    
    if (providerId) {
      query += ' AND a.provider_id = ?';
      params.push(providerId);
    }
    
    if (status) {
      query += ' AND a.status = ?';
      params.push(status);
    }
    
    if (date) {
      query += ' AND a.appointment_date = ?';
      params.push(date);
    }
    
    if (startDate && endDate) {
      query += ' AND a.appointment_date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }
    
    query += ' ORDER BY a.appointment_date, a.appointment_time';
    
    db.all(query, params, (err, appointments) => {
      if (err) {
        console.error('Get appointments error:', err);
        return res.status(500).json({ error: 'Failed to fetch appointments' });
      }
      
      res.json(appointments);
    });
  });
  
  // Get single appointment by ID
  router.get('/:id', authenticate, (req, res) => {
    const query = `
      SELECT 
        a.*,
        p.firstName || ' ' || p.lastName as patientName,
        p.dateOfBirth as patientDob,
        p.email as patientEmail,
        p.phone as patientPhone,
        u.first_name || ' ' || u.last_name as providerName,
        u.role as providerRole,
        u.email as providerEmail,
        c.first_name || ' ' || c.last_name as createdByName
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u ON a.provider_id = u.id
      LEFT JOIN users c ON a.created_by = c.id
      WHERE a.id = ?
    `;
    
    db.get(query, [req.params.id], (err, appointment) => {
      if (err) {
        console.error('Get appointment error:', err);
        return res.status(500).json({ error: 'Failed to fetch appointment' });
      }
      
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      
      // Check authorization
      if (req.user.role === 'patient' && appointment.patient_id !== req.user.patientId) {
        return res.status(403).json({ error: 'Not authorized to view this appointment' });
      }
      
      res.json(appointment);
    });
  });
  
  // Create new appointment
  router.post('/', authenticate, authorize('admin', 'doctor', 'nurse', 'receptionist'), (req, res) => {
    const {
      patientId,
      providerId,
      appointmentDate,
      appointmentTime,
      durationMinutes = 30,
      appointmentType,
      reason,
      notes
    } = req.body;
    
    if (!patientId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['patientId', 'appointmentDate', 'appointmentTime']
      });
    }
    
    // Validate appointment type
    const validTypes = ['checkup', 'follow-up', 'consultation', 'emergency', 'procedure'];
    if (appointmentType && !validTypes.includes(appointmentType)) {
      return res.status(400).json({
        error: 'Invalid appointment type',
        validTypes
      });
    }
    
    const query = `
      INSERT INTO appointments (
        patient_id, provider_id, appointment_date, appointment_time,
        duration_minutes, appointment_type, reason, notes, created_by, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled')
    `;
    
    db.run(
      query,
      [patientId, providerId || null, appointmentDate, appointmentTime, durationMinutes, 
       appointmentType || 'checkup', reason, notes, req.user.userId],
      function(err) {
        if (err) {
          console.error('Create appointment error:', err);
          return res.status(500).json({ error: 'Failed to create appointment' });
        }
        
        const appointmentId = this.lastID;
        
        // Log the action
        db.run(
          'INSERT INTO audit_log (user_id, action, resource_type, resource_id, ip_address) VALUES (?, ?, ?, ?, ?)',
          [req.user.userId, 'create', 'appointment', appointmentId, req.ip]
        );
        
        // Fetch the created appointment
        db.get(
          `SELECT a.*, p.firstName || ' ' || p.lastName as patientName 
           FROM appointments a 
           LEFT JOIN patients p ON a.patient_id = p.id 
           WHERE a.id = ?`,
          [appointmentId],
          (err, appointment) => {
            if (err) {
              return res.status(201).json({ 
                message: 'Appointment created',
                id: appointmentId 
              });
            }
            
            res.status(201).json({
              message: 'Appointment created successfully',
              appointment
            });
          }
        );
      }
    );
  });
  
  // Update appointment
  router.put('/:id', authenticate, authorize('admin', 'doctor', 'nurse', 'receptionist'), (req, res) => {
    const {
      patientId,
      providerId,
      appointmentDate,
      appointmentTime,
      durationMinutes,
      appointmentType,
      status,
      reason,
      notes
    } = req.body;
    
    // Build dynamic update query
    const updates = [];
    const params = [];
    
    if (patientId !== undefined) {
      updates.push('patient_id = ?');
      params.push(patientId);
    }
    if (providerId !== undefined) {
      updates.push('provider_id = ?');
      params.push(providerId);
    }
    if (appointmentDate !== undefined) {
      updates.push('appointment_date = ?');
      params.push(appointmentDate);
    }
    if (appointmentTime !== undefined) {
      updates.push('appointment_time = ?');
      params.push(appointmentTime);
    }
    if (durationMinutes !== undefined) {
      updates.push('duration_minutes = ?');
      params.push(durationMinutes);
    }
    if (appointmentType !== undefined) {
      updates.push('appointment_type = ?');
      params.push(appointmentType);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (reason !== undefined) {
      updates.push('reason = ?');
      params.push(reason);
    }
    if (notes !== undefined) {
      updates.push('notes = ?');
      params.push(notes);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(req.params.id);
    
    const query = `UPDATE appointments SET ${updates.join(', ')} WHERE id = ?`;
    
    db.run(query, params, function(err) {
      if (err) {
        console.error('Update appointment error:', err);
        return res.status(500).json({ error: 'Failed to update appointment' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      
      // Log the action
      db.run(
        'INSERT INTO audit_log (user_id, action, resource_type, resource_id, ip_address) VALUES (?, ?, ?, ?, ?)',
        [req.user.userId, 'update', 'appointment', req.params.id, req.ip]
      );
      
      res.json({ message: 'Appointment updated successfully' });
    });
  });
  
  // Cancel appointment
  router.post('/:id/cancel', authenticate, (req, res) => {
    const { cancellationReason } = req.body;
    
    const query = `
      UPDATE appointments 
      SET status = 'cancelled',
          cancelled_at = CURRENT_TIMESTAMP,
          cancelled_by = ?,
          cancellation_reason = ?
      WHERE id = ?
    `;
    
    db.run(query, [req.user.userId, cancellationReason, req.params.id], function(err) {
      if (err) {
        console.error('Cancel appointment error:', err);
        return res.status(500).json({ error: 'Failed to cancel appointment' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      
      // Log the action
      db.run(
        'INSERT INTO audit_log (user_id, action, resource_type, resource_id, details, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
        [req.user.userId, 'cancel', 'appointment', req.params.id, cancellationReason, req.ip]
      );
      
      res.json({ message: 'Appointment cancelled successfully' });
    });
  });
  
  // Delete appointment (admin only)
  router.delete('/:id', authenticate, authorize('admin'), (req, res) => {
    db.run('DELETE FROM appointments WHERE id = ?', [req.params.id], function(err) {
      if (err) {
        console.error('Delete appointment error:', err);
        return res.status(500).json({ error: 'Failed to delete appointment' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      
      // Log the action
      db.run(
        'INSERT INTO audit_log (user_id, action, resource_type, resource_id, ip_address) VALUES (?, ?, ?, ?, ?)',
        [req.user.userId, 'delete', 'appointment', req.params.id, req.ip]
      );
      
      res.json({ message: 'Appointment deleted successfully' });
    });
  });
  
  // Get available time slots for a provider on a specific date
  router.get('/availability/:providerId/:date', authenticate, (req, res) => {
    const { providerId, date } = req.params;
    
    // Define working hours (9 AM to 5 PM)
    const workingHours = {
      start: 9,
      end: 17
    };
    
    // Get all appointments for the provider on that date
    const query = `
      SELECT appointment_time, duration_minutes 
      FROM appointments 
      WHERE provider_id = ? 
      AND appointment_date = ? 
      AND status NOT IN ('cancelled', 'no-show')
      ORDER BY appointment_time
    `;
    
    db.all(query, [providerId, date], (err, appointments) => {
      if (err) {
        console.error('Get availability error:', err);
        return res.status(500).json({ error: 'Failed to fetch availability' });
      }
      
      // Generate all 30-minute slots
      const allSlots = [];
      for (let hour = workingHours.start; hour < workingHours.end; hour++) {
        for (let minute of [0, 30]) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
          allSlots.push(time);
        }
      }
      
      // Mark unavailable slots
      const availableSlots = allSlots.map(slot => {
        const isBooked = appointments.some(apt => {
          return slot >= apt.appointment_time && 
                 slot < addMinutes(apt.appointment_time, apt.duration_minutes);
        });
        
        return {
          time: slot,
          available: !isBooked
        };
      });
      
      res.json({
        date,
        providerId,
        slots: availableSlots
      });
    });
  });
  
  // Helper function to add minutes to time
  function addMinutes(timeString, minutes) {
    const [hours, mins] = timeString.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}:00`;
  }
  
  return router;
}

module.exports = initAppointmentRoutes;
