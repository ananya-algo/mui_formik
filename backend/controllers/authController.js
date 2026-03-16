
const { pool } = require('../config/db');



const login = async (req, res, next) => {
  console.log('🔵 Login hit with sapId:', req.body.sapId);
  try {
    const { sapId } = req.body;


    if (!sapId || typeof sapId !== 'string' || sapId.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'SAP ID is required.',
      });
    }

    const trimmedSapId = sapId.trim();

   
    const [rows] = await pool.execute(
      `SELECT id, sap_id, full_name, email, department, role, is_active
       FROM users
       WHERE sap_id = ? AND is_active = 1
       LIMIT 1`,
      [trimmedSapId]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid SAP ID. Please check and try again.',
      });
    }

    const user = rows[0];


    await pool.execute(
      `INSERT INTO login_logs (user_id, sap_id, logged_in_at, ip_address)
       VALUES (?, ?, NOW(), ?)`,
      [user.id, user.sap_id, req.ip]
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      user: {
        id:         user.id,
        sapId:      user.sap_id,
        fullName:   user.full_name,
        email:      user.email,
        department: user.department,
        role:       user.role,
      },
    });

  } catch (error) {
    next(error); 
  }
};

const getMe = async (req, res, next) => {
  try {
    const { sapId } = req.query;

    if (!sapId) {
      return res.status(400).json({ success: false, message: 'sapId query param is required.' });
    }

    const [rows] = await pool.execute(
      `SELECT id, sap_id, full_name, email, department, role
       FROM users
       WHERE sap_id = ? AND is_active = 1
       LIMIT 1`,
      [sapId.trim()]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const user = rows[0];
    return res.status(200).json({
      success: true,
      user: {
        id:         user.id,
        sapId:      user.sap_id,
        fullName:   user.full_name,
        email:      user.email,
        department: user.department,
        role:       user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, getMe };