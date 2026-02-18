const { pool } = require('../config/db');

const getSummary = async (req, res, next) => {
  try {
    const { type = 'daily' } = req.query;
    const table = type === 'monthly' ? 'monthly_summary' : 'daily_summary';

    const [rows] = await pool.execute(
      `SELECT category_label, quality_rating, plan_compliance
       FROM ${table}
       ORDER BY record_date ASC
       LIMIT 12`
    );


    const categories = rows.map(r => r.category_label);
    const quality    = rows.map(r => Number(r.quality_rating));
    const compliance = rows.map(r => Number(r.plan_compliance));

    res.json({ success: true, data: { categories, quality, compliance } });
  } catch (err) {
    next(err);
  }
};

const getKpis = async (req, res, next) => {
  console.log("getKpis called");

  try {
    const [rows] = await pool.execute(
      `SELECT kpi_key, kpi_value, kpi_label, color
       FROM kpis
       ORDER BY sort_order ASC`
    );

    const data = rows.map(r => ({ ...r, kpi_value: Number(r.kpi_value) }));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getViolations = async (req, res, next) => {
  console.log("get violations called");

  try {
    const [rows] = await pool.execute(
      `SELECT status, COUNT(*) AS count FROM violations GROUP BY status`
    );

    const result = { total: 0, closed: 0, open: 0, percentage: 0 };
    rows.forEach(r => {
      const count = parseInt(r.count);
      result.total += count;
      if (r.status === 'closed') result.closed = count;
      if (r.status === 'open')   result.open   = count;
    });
    result.percentage = result.total > 0
      ? parseFloat(((result.closed / result.total) * 100).toFixed(1))
      : 0;

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSummary, getKpis, getViolations };