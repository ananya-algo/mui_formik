import React, { useState, useMemo, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, Button, Popover, Select, MenuItem, FormControl,
  InputLabel, Checkbox, IconButton, TablePagination, Box, Typography,
  InputAdornment, Chip, Stack, CircularProgress
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import './AuditLogsTable.css';

const AuditLogsTable = () => {
  const columns = [
    { id: 'timestamp',        label: 'Timestamp',         align: 'left',   filterable: false },
    { id: 'shift',            label: 'Shift',             align: 'left',   filterable: true, filterType: 'select' },
    { id: 'score',            label: 'Score',             align: 'center', filterable: false },
    { id: 'auditor',          label: 'Auditor',           align: 'left',   filterable: true, filterType: 'text' },
    { id: 'auditee',          label: 'Auditee',           align: 'left',   filterable: true, filterType: 'text' },
    { id: 'normalViolations', label: 'Normal Violations', align: 'left',   filterable: false },
    { id: 'severeViolations', label: 'Severe Violations', align: 'left',   filterable: false },
    { id: 'machinesAudited',  label: 'Machines Audited',  align: 'left',   filterable: true, filterType: 'machines' },
    { id: 'action',           label: 'Action',            align: 'center', filterable: false },
  ];

  // ── Data state ───────────────────────────────
  const [rows,         setRows]         = useState([]);
  const [total,        setTotal]        = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  // ── Filter options from API ──────────────────
  const [uniqueShifts,   setUniqueShifts]   = useState([]);
  const [uniqueAuditors, setUniqueAuditors] = useState([]);
  const [uniqueAuditees, setUniqueAuditees] = useState([]);
  const [uniqueMachines, setUniqueMachines] = useState([]);

  // ── UI state ─────────────────────────────────
  const [searchTerm,           setSearchTerm]           = useState('');
  const [sortBy,               setSortBy]               = useState('timestamp-desc');
  const [page,                 setPage]                 = useState(0);
  const [rowsPerPage,          setRowsPerPage]          = useState(10);
  const [columnFilterAnchor,   setColumnFilterAnchor]   = useState(null);
  const [activeFilterColumn,   setActiveFilterColumn]   = useState(null);
  const [columnFilters,        setColumnFilters]        = useState({
    shift: [],
    auditor: '',
    auditee: '',
    machinesAudited: { min: '', max: '', specific: [] }
  });

  // ── Fetch filter options once on mount ───────
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/audits/filters', {
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.data?.success) {
          const { shifts, auditors, auditees, machines } = response.data.data;
          setUniqueShifts(shifts);
          setUniqueAuditors(auditors);
          setUniqueAuditees(auditees);
          setUniqueMachines(machines);
        }
      } catch (err) {
        console.error('Failed to load filter options:', err.response?.data?.message || err.message);
      }
    };
    fetchFilterOptions();
  }, []);

  // ── Fetch audit logs whenever filters/sort/page change ──
  const fetchAuditLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [sortColumn, sortDir] = sortBy.split('-');

      const response = await axios.get('http://localhost:4000/api/audits', {
        headers: { 'Content-Type': 'application/json' },
        params: {
          page:       page + 1,   // API is 1-based, MUI is 0-based
          limit:      rowsPerPage,
          sortBy:     sortColumn,
          sortDir,
          search:     searchTerm,
          shift:      columnFilters.shift.join(','),
          auditor:    columnFilters.auditor,
          auditee:    columnFilters.auditee,
          machineMin: columnFilters.machinesAudited.min,
          machineMax: columnFilters.machinesAudited.max,
          machines:   columnFilters.machinesAudited.specific.join(','),
        }
      });

      if (response.data?.success) {
        setRows(response.data.data);
        setTotal(response.data.total);
      } else {
        setError(response.data?.message || 'Failed to load audit logs.');
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load audit logs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, sortBy, searchTerm, columnFilters]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  // Reset to page 0 when filters or search change
  useEffect(() => {
    setPage(0);
  }, [searchTerm, columnFilters, sortBy]);

  // ── Filter helpers ────────────────────────────
  const hasActiveFilter = (columnId) => {
    switch (columnId) {
      case 'shift':          return columnFilters.shift.length > 0;
      case 'auditor':        return columnFilters.auditor !== '';
      case 'auditee':        return columnFilters.auditee !== '';
      case 'machinesAudited':
        return columnFilters.machinesAudited.min !== '' ||
               columnFilters.machinesAudited.max !== '' ||
               columnFilters.machinesAudited.specific.length > 0;
      default: return false;
    }
  };

  const clearColumnFilter = (columnId) => {
    setColumnFilters(prev => {
      switch (columnId) {
        case 'shift':          return { ...prev, shift: [] };
        case 'auditor':        return { ...prev, auditor: '' };
        case 'auditee':        return { ...prev, auditee: '' };
        case 'machinesAudited': return { ...prev, machinesAudited: { min: '', max: '', specific: [] } };
        default: return prev;
      }
    });
  };

  const clearAllColumnFilters = () => {
    setColumnFilters({ shift: [], auditor: '', auditee: '', machinesAudited: { min: '', max: '', specific: [] } });
  };

  const handleColumnFilterClick  = (e, columnId) => { setColumnFilterAnchor(e.currentTarget); setActiveFilterColumn(columnId); };
  const handleColumnFilterClose  = () => { setColumnFilterAnchor(null); setActiveFilterColumn(null); };
  const handleShiftFilterToggle  = (shift) => setColumnFilters(prev => ({ ...prev, shift: prev.shift.includes(shift) ? prev.shift.filter(s => s !== shift) : [...prev.shift, shift] }));
  const handleAuditorFilterChange = (val) => setColumnFilters(prev => ({ ...prev, auditor: val }));
  const handleAuditeeFilterChange = (val) => setColumnFilters(prev => ({ ...prev, auditee: val }));
  const handleMachineFilterToggle = (m) => setColumnFilters(prev => ({ ...prev, machinesAudited: { ...prev.machinesAudited, specific: prev.machinesAudited.specific.includes(m) ? prev.machinesAudited.specific.filter(x => x !== m) : [...prev.machinesAudited.specific, m] } }));
  const handleMachineRangeChange  = (type, val) => setColumnFilters(prev => ({ ...prev, machinesAudited: { ...prev.machinesAudited, [type]: val } }));

  const handleActionClick = async (log) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/audits/${log.id}`, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.data?.success) {
        console.log('Audit detail:', response.data.data);
        // TODO: open a detail modal/drawer here
      }
    } catch (err) {
      console.error('Failed to fetch audit detail:', err.response?.data?.message || err.message);
    }
  };

  // ── Render column filter popover ─────────────
  const renderColumnFilter = () => {
    switch (activeFilterColumn) {
      case 'shift':
        return (
          <Box sx={{ p: 2, minWidth: 200 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Filter by Shift</Typography>
            {uniqueShifts.map(shift => (
              <Box key={shift} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Checkbox checked={columnFilters.shift.includes(shift)} onChange={() => handleShiftFilterToggle(shift)} size="small" />
                <Typography variant="body2">Shift {shift}</Typography>
              </Box>
            ))}
            <Button size="small" onClick={() => clearColumnFilter('shift')} startIcon={<ClearIcon />} sx={{ mt: 1 }} fullWidth>Clear</Button>
          </Box>
        );

      case 'auditor':
        return (
          <Box sx={{ p: 2, minWidth: 250 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Filter by Auditor</Typography>
            <TextField fullWidth size="small" placeholder="Type auditor name..." value={columnFilters.auditor} onChange={(e) => handleAuditorFilterChange(e.target.value)} sx={{ mb: 2 }} />
            <Typography variant="caption" sx={{ mb: 1, display: 'block', color: 'text.secondary' }}>Select from list:</Typography>
            <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
              {uniqueAuditors.map(auditor => (
                <Box key={auditor} sx={{ p: 1, cursor: 'pointer', borderRadius: 1, '&:hover': { bgcolor: 'action.hover' }, bgcolor: columnFilters.auditor === auditor ? 'action.selected' : 'transparent' }} onClick={() => handleAuditorFilterChange(auditor)}>
                  <Typography variant="body2">{auditor}</Typography>
                </Box>
              ))}
            </Box>
            <Button size="small" onClick={() => clearColumnFilter('auditor')} startIcon={<ClearIcon />} sx={{ mt: 2 }} fullWidth>Clear</Button>
          </Box>
        );

      case 'auditee':
        return (
          <Box sx={{ p: 2, minWidth: 250 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Filter by Auditee</Typography>
            <TextField fullWidth size="small" placeholder="Type auditee name..." value={columnFilters.auditee} onChange={(e) => handleAuditeeFilterChange(e.target.value)} sx={{ mb: 2 }} />
            <Typography variant="caption" sx={{ mb: 1, display: 'block', color: 'text.secondary' }}>Select from list:</Typography>
            <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
              {uniqueAuditees.map(auditee => (
                <Box key={auditee} sx={{ p: 1, cursor: 'pointer', borderRadius: 1, '&:hover': { bgcolor: 'action.hover' }, bgcolor: columnFilters.auditee === auditee ? 'action.selected' : 'transparent' }} onClick={() => handleAuditeeFilterChange(auditee)}>
                  <Typography variant="body2">{auditee}</Typography>
                </Box>
              ))}
            </Box>
            <Button size="small" onClick={() => clearColumnFilter('auditee')} startIcon={<ClearIcon />} sx={{ mt: 2 }} fullWidth>Clear</Button>
          </Box>
        );

      case 'machinesAudited':
        return (
          <Box sx={{ p: 2, minWidth: 280 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Filter by Machines</Typography>
            <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 500 }}>Number Range:</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField size="small" type="number" placeholder="Min" value={columnFilters.machinesAudited.min} onChange={(e) => handleMachineRangeChange('min', e.target.value)} sx={{ flex: 1 }} />
              <TextField size="small" type="number" placeholder="Max" value={columnFilters.machinesAudited.max} onChange={(e) => handleMachineRangeChange('max', e.target.value)} sx={{ flex: 1 }} />
            </Box>
            <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 500 }}>Specific Machines:</Typography>
            <Box sx={{ maxHeight: 200, overflowY: 'auto', mb: 2 }}>
              {uniqueMachines.map(machine => (
                <Box key={machine} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Checkbox checked={columnFilters.machinesAudited.specific.includes(machine)} onChange={() => handleMachineFilterToggle(machine)} size="small" />
                  <Typography variant="body2">Machine {machine}</Typography>
                </Box>
              ))}
            </Box>
            <Button size="small" onClick={() => clearColumnFilter('machinesAudited')} startIcon={<ClearIcon />} fullWidth>Clear</Button>
          </Box>
        );

      default: return null;
    }
  };

  const anyActiveFilter = ['shift','auditor','auditee','machinesAudited'].some(hasActiveFilter);

  // ── Render ────────────────────────────────────
  return (
    <div className="audit-logs-container">
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, px: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#404040', letterSpacing: '-0.5px' }}>
          Process Audit Logs
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}>
            <InputLabel id="sort-label">Sort By</InputLabel>
            <Select labelId="sort-label" value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)} sx={{ borderRadius: '16px' }}>
              <MenuItem value="timestamp-desc">Timestamp (Newest First)</MenuItem>
              <MenuItem value="timestamp-asc">Timestamp (Oldest First)</MenuItem>
              <MenuItem value="score-desc">Score (High to Low)</MenuItem>
              <MenuItem value="score-asc">Score (Low to High)</MenuItem>
              <MenuItem value="shift-asc">Shift (A to C)</MenuItem>
              <MenuItem value="shift-desc">Shift (C to A)</MenuItem>
              <MenuItem value="auditor-asc">Auditor (A to Z)</MenuItem>
              <MenuItem value="auditor-desc">Auditor (Z to A)</MenuItem>
              <MenuItem value="auditee-asc">Auditee (A to Z)</MenuItem>
              <MenuItem value="auditee-desc">Auditee (Z to A)</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            sx={{ minWidth: 300, '& .MuiOutlinedInput-root': { borderRadius: '16px', paddingLeft: '8px' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#666' }} />
                </InputAdornment>
              )
            }}
          />
        </Box>
      </Box>

      {/* Clear filters button */}
      {anyActiveFilter && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined" color="error" startIcon={<ClearIcon />} onClick={clearAllColumnFilters} sx={{ borderRadius: '16px' }}>
            Clear Column Filters
          </Button>
        </Box>
      )}

      {/* Active filter chips */}
      {anyActiveFilter && (
        <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Active Column Filters:</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {columnFilters.shift.length > 0 && (
              <Chip label={`Shift: ${columnFilters.shift.join(', ')}`} onDelete={() => clearColumnFilter('shift')} size="small" color="primary" variant="outlined" />
            )}
            {columnFilters.auditor && (
              <Chip label={`Auditor: ${columnFilters.auditor}`} onDelete={() => clearColumnFilter('auditor')} size="small" color="primary" variant="outlined" />
            )}
            {columnFilters.auditee && (
              <Chip label={`Auditee: ${columnFilters.auditee}`} onDelete={() => clearColumnFilter('auditee')} size="small" color="primary" variant="outlined" />
            )}
            {hasActiveFilter('machinesAudited') && (
              <Chip label="Machines: Filtered" onDelete={() => clearColumnFilter('machinesAudited')} size="small" color="primary" variant="outlined" />
            )}
          </Stack>
        </Box>
      )}

      {/* Error state */}
      {error && (
        <Box sx={{ mb: 2, p: 2, bgcolor: '#fff3f3', borderRadius: 2, border: '1px solid #ffcdd2' }}>
          <Typography color="error">⚠️ {error}</Typography>
          <Button size="small" onClick={fetchAuditLogs} sx={{ mt: 1 }}>Retry</Button>
        </Box>
      )}

      {/* Table */}
      <TableContainer component={Paper} className="table-wrapper">
        <Table className="audit-table">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.id} align={col.align} sx={{ color: '#404040 !important', fontWeight: '600 !important', fontSize: '14px !important', borderRight: '1px solid #E4E4E4' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{col.label}</span>
                    {col.filterable && (
                      <IconButton size="small" onClick={(e) => handleColumnFilterClick(e, col.id)} sx={{ color: hasActiveFilter(col.id) ? '#0077B6' : '#666', '&:hover': { color: '#0077B6' } }}>
                        <FilterListIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={32} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Loading audit logs...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : rows.length > 0 ? (
              rows.map((log) => (
                <TableRow key={log.id}>
                  <TableCell sx={{ borderRight: '1px solid #E4E4E4' }}>{log.timestamp}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #E4E4E4' }}>{log.shift}</TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid #E4E4E4' }}>{log.score}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #E4E4E4' }}>{log.auditor}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #E4E4E4' }}>{log.auditee}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #E4E4E4' }}>{log.normalViolations}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #E4E4E4' }}>{log.severeViolations}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #E4E4E4' }}>{log.machinesAudited.join(', ')}</TableCell>
                  <TableCell align="center">
                    <IconButton className="action-icon" size="small" onClick={() => handleActionClick(log)}>
                      <ArrowForwardIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No records found matching the current filters
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <div className="pagination-container">
        <Typography className="pagination-info">
          Showing {total > 0 ? page * rowsPerPage + 1 : 0} to {Math.min((page + 1) * rowsPerPage, total)} of {total} entries
        </Typography>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[5, 10, 20]}
          labelRowsPerPage="Rows per page:"
        />
      </div>

      {/* Column Filter Popover */}
      <Popover
        open={Boolean(columnFilterAnchor)}
        anchorEl={columnFilterAnchor}
        onClose={handleColumnFilterClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {renderColumnFilter()}
      </Popover>
    </div>
  );
};

export default AuditLogsTable;