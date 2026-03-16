const { pool } = require('../config/db');

const getAuditLogs = async (req, res, next) => {
  try {
    const {
      page       = 1,
      limit      = 10,
      sortBy     = 'timestamp',
      sortDir    = 'desc',
      search     = '',
      shift      = '',
      auditor    = '',
      auditee    = '',
      machineMin = '',
      machineMax = '',
      machines   = ''
    } = req.query;

    const pageInt  = parseInt(page, 10)  || 1;
    const limitInt = parseInt(limit, 10) || 10;
    const offset   = (pageInt - 1) * limitInt;

    const allowedSortCols = ['timestamp', 'score', 'shift', 'auditor', 'auditee'];
    const safeSortCol = allowedSortCols.includes(sortBy) ? sortBy : 'timestamp';
    const safeSortDir = sortDir === 'asc' ? 'ASC' : 'DESC';

    const conditions = [];
    const params     = [];

    // Global search
    if (search && search.trim()) {
      conditions.push(`(al.auditor LIKE ? OR al.auditee LIKE ? OR al.shift LIKE ? OR DATE_FORMAT(al.timestamp, '%Y-%m-%d %H:%i') LIKE ?)`);
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s);
    }

    // Shift filter
    if (shift && shift.trim()) {
      const shifts = shift.split(',').map(s => s.trim()).filter(Boolean);
      if (shifts.length) {
        conditions.push(`al.shift IN (${shifts.map(() => '?').join(',')})`);
        params.push(...shifts);
      }
    }

    // Auditor filter
    if (auditor && auditor.trim()) {
      conditions.push('al.auditor LIKE ?');
      params.push(`%${auditor.trim()}%`);
    }

    // Auditee filter
    if (auditee && auditee.trim()) {
      conditions.push('al.auditee LIKE ?');
      params.push(`%${auditee.trim()}%`);
    }

    // Machine filters
    const machineConditions = [];

    if (machineMin && machineMin.trim()) {
      machineConditions.push('am.machine_number >= ?');
      params.push(parseInt(machineMin, 10));
    }
    if (machineMax && machineMax.trim()) {
      machineConditions.push('am.machine_number <= ?');
      params.push(parseInt(machineMax, 10));
    }
    if (machines && machines.trim()) {
      const machineList = machines.split(',')
        .map(m => parseInt(m.trim(), 10))
        .filter(n => !isNaN(n));
      if (machineList.length) {
        machineConditions.push(`am.machine_number IN (${machineList.map(() => '?').join(',')})`);
        params.push(...machineList);
      }
    }


    let extraJoin = '';
    if (machineConditions.length) {
      extraJoin = 'INNER JOIN audit_machines am ON am.audit_id = al.id';
      conditions.push(`(${machineConditions.join(' OR ')})`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';


    const countSql = `
      SELECT COUNT(DISTINCT al.id) AS total
      FROM audit_logs al
      JOIN audit_machines am2 ON am2.audit_id = al.id
      ${extraJoin}
      ${whereClause}
    `;
    const [countRows] = await pool.query(countSql, params);
    const total = parseInt(countRows[0].total, 10);


    const dataSql = `
      SELECT
        al.id,
        al.timestamp,
        al.shift,
        al.score,
        al.auditor,
        al.auditee,
        al.normal_violations  AS normalViolations,
        al.severe_violations  AS severeViolations,
        GROUP_CONCAT(am2.machine_number ORDER BY am2.machine_number ASC) AS machinesAudited
      FROM audit_logs al
      JOIN audit_machines am2 ON am2.audit_id = al.id
      ${extraJoin}
      ${whereClause}
      GROUP BY al.id
      ORDER BY al.${safeSortCol} ${safeSortDir}
      LIMIT ${limitInt} OFFSET ${offset}
    `;
    const [rows] = await pool.query(dataSql, params);

    const data = rows.map(row => ({
      ...row,
      score:            Number(row.score),
      normalViolations: Number(row.normalViolations),
      severeViolations: Number(row.severeViolations),
      machinesAudited:  row.machinesAudited
        ? row.machinesAudited.split(',').map(Number)
        : []
    }));

    res.json({ success: true, data, total, page: pageInt, limit: limitInt });

  } catch (err) {
    next(err);
  }
};

// GET /api/audits/filters
const getFilterOptions = async (req, res, next) => {
  try {
    const [[shifts], [auditors], [auditees], [machines]] = await Promise.all([
      pool.execute('SELECT DISTINCT shift FROM audit_logs ORDER BY shift ASC'),
      pool.execute('SELECT DISTINCT auditor FROM audit_logs ORDER BY auditor ASC'),
      pool.execute('SELECT DISTINCT auditee FROM audit_logs ORDER BY auditee ASC'),
      pool.execute('SELECT DISTINCT machine_number FROM audit_machines ORDER BY machine_number ASC'),
    ]);

    res.json({
      success: true,
      data: {
        shifts:   shifts.map(r => r.shift),
        auditors: auditors.map(r => r.auditor),
        auditees: auditees.map(r => r.auditee),
        machines: machines.map(r => Number(r.machine_number)),
      }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/audits/:id
const getAuditById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid audit ID.' });
    }

    const [rows] = await pool.execute(
      `SELECT
        al.*,
        GROUP_CONCAT(am.machine_number ORDER BY am.machine_number ASC) AS machinesAudited
       FROM audit_logs al
       JOIN audit_machines am ON am.audit_id = al.id
       WHERE al.id = ?
       GROUP BY al.id`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Audit not found.' });
    }

    const row = rows[0];
    res.json({
      success: true,
      data: {
        ...row,
        score:            Number(row.score),
        normalViolations: Number(row.normal_violations),
        severeViolations: Number(row.severe_violations),
        machinesAudited:  row.machinesAudited
          ? row.machinesAudited.split(',').map(Number)
          : []
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAuditLogs, getFilterOptions, getAuditById };