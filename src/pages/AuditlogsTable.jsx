import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Popover,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  IconButton,
  TablePagination,
  Box,
  Typography,
  InputAdornment,
  Chip,
  Stack
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { auditLogsData } from '../data/mockData';
import './AuditLogsTable.css';

const AuditLogsTable = () => {
  // Column configuration 
  const columns = [
    { id: 'timestamp', label: 'Timestamp', align: 'left', filterable: false },
    { id: 'shift', label: 'Shift', align: 'left', filterable: true, filterType: 'select' },
    { id: 'score', label: 'Score', align: 'center', filterable: false },
    { id: 'auditor', label: 'Auditor', align: 'left', filterable: true, filterType: 'text' },
    { id: 'auditee', label: 'Auditee', align: 'left', filterable: true, filterType: 'text' },
    { id: 'normalViolations', label: 'Normal Violations', align: 'left', filterable: false },
    { id: 'severeViolations', label: 'Severe Violations', align: 'left', filterable: false },
    { id: 'machinesAudited', label: 'Machines Audited', align: 'left', filterable: true, filterType: 'machines' },
    { id: 'action', label: 'Action', align: 'center', filterable: false }
  ];

  // State for search
  const [searchTerm, setSearchTerm] = useState('');

  // State for sort control
  const [sortBy, setSortBy] = useState('timestamp-desc');

  // State for column-level filters
  const [columnFilterAnchor, setColumnFilterAnchor] = useState(null);
  const [activeFilterColumn, setActiveFilterColumn] = useState(null);
  const [columnFilters, setColumnFilters] = useState({
    shift: [],
    auditor: '',
    auditee: '',
    machinesAudited: { min: '', max: '', specific: [] }
  });

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Get unique values for filters
  const uniqueShifts = useMemo(() => 
    [...new Set(auditLogsData.map(log => log.shift))].sort(),
    []
  );

  const uniqueAuditors = useMemo(() =>
    [...new Set(auditLogsData.map(log => log.auditor))].sort(),
    []
  );

  const uniqueAuditees = useMemo(() =>
    [...new Set(auditLogsData.map(log => log.auditee))].sort(),
    []
  );

  const uniqueMachines = useMemo(() => {
    const allMachines = auditLogsData.flatMap(log => log.machinesAudited);
    return [...new Set(allMachines)].sort((a, b) => a - b);
  }, []);

  // Handle column filter click
  const handleColumnFilterClick = (event, columnId) => {
    setColumnFilterAnchor(event.currentTarget);
    setActiveFilterColumn(columnId);
  };

  const handleColumnFilterClose = () => {
    setColumnFilterAnchor(null);
    setActiveFilterColumn(null);
  };

  // Handle column filter changes
  const handleShiftFilterToggle = (shift) => {
    setColumnFilters(prev => ({
      ...prev,
      shift: prev.shift.includes(shift)
        ? prev.shift.filter(s => s !== shift)
        : [...prev.shift, shift]
    }));
  };

  const handleAuditorFilterChange = (value) => {
    setColumnFilters(prev => ({
      ...prev,
      auditor: value
    }));
  };

  const handleAuditeeFilterChange = (value) => {
    setColumnFilters(prev => ({
      ...prev,
      auditee: value
    }));
  };

  const handleMachineFilterToggle = (machine) => {
    setColumnFilters(prev => ({
      ...prev,
      machinesAudited: {
        ...prev.machinesAudited,
        specific: prev.machinesAudited.specific.includes(machine)
          ? prev.machinesAudited.specific.filter(m => m !== machine)
          : [...prev.machinesAudited.specific, machine]
      }
    }));
  };

  const handleMachineRangeChange = (type, value) => {
    setColumnFilters(prev => ({
      ...prev,
      machinesAudited: {
        ...prev.machinesAudited,
        [type]: value
      }
    }));
  };

  const clearColumnFilter = (columnId) => {
    switch (columnId) {
      case 'shift':
        setColumnFilters(prev => ({ ...prev, shift: [] }));
        break;
      case 'auditor':
        setColumnFilters(prev => ({ ...prev, auditor: '' }));
        break;
      case 'auditee':
        setColumnFilters(prev => ({ ...prev, auditee: '' }));
        break;
      case 'machinesAudited':
        setColumnFilters(prev => ({
          ...prev,
          machinesAudited: { min: '', max: '', specific: [] }
        }));
        break;
      default:
        break;
    }
  };

  const clearAllColumnFilters = () => {
    setColumnFilters({
      shift: [],
      auditor: '',
      auditee: '',
      machinesAudited: { min: '', max: '', specific: [] }
    });
  };

  // Check if column has active filter
  const hasActiveFilter = (columnId) => {
    switch (columnId) {
      case 'shift':
        return columnFilters.shift.length > 0;
      case 'auditor':
        return columnFilters.auditor !== '';
      case 'auditee':
        return columnFilters.auditee !== '';
      case 'machinesAudited':
        return columnFilters.machinesAudited.min !== '' ||
               columnFilters.machinesAudited.max !== '' ||
               columnFilters.machinesAudited.specific.length > 0;
      default:
        return false;
    }
  };

  // Handle sort change
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let data = [...auditLogsData];

    // Apply global search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      data = data.filter(log =>
        log.auditor.toLowerCase().includes(searchLower) ||
        log.auditee.toLowerCase().includes(searchLower) ||
        log.machinesAudited.join(', ').includes(searchTerm) ||
        log.timestamp.toLowerCase().includes(searchLower) ||
        log.shift.toLowerCase().includes(searchLower)
      );
    }

    // Apply column-level filters
    // Shift filter
    if (columnFilters.shift.length > 0) {
      data = data.filter(log => columnFilters.shift.includes(log.shift));
    }

    // Auditor filter
    if (columnFilters.auditor) {
      const auditorLower = columnFilters.auditor.toLowerCase();
      data = data.filter(log => log.auditor.toLowerCase().includes(auditorLower));
    }

    // Auditee filter
    if (columnFilters.auditee) {
      const auditeeLower = columnFilters.auditee.toLowerCase();
      data = data.filter(log => log.auditee.toLowerCase().includes(auditeeLower));
    }

    // Machines Audited filter
    if (columnFilters.machinesAudited.specific.length > 0) {
      data = data.filter(log =>
        log.machinesAudited.some(machine =>
          columnFilters.machinesAudited.specific.includes(machine)
        )
      );
    }

    if (columnFilters.machinesAudited.min !== '') {
      const minMachine = parseInt(columnFilters.machinesAudited.min);
      data = data.filter(log =>
        log.machinesAudited.some(machine => machine >= minMachine)
      );
    }

    if (columnFilters.machinesAudited.max !== '') {
      const maxMachine = parseInt(columnFilters.machinesAudited.max);
      data = data.filter(log =>
        log.machinesAudited.some(machine => machine <= maxMachine)
      );
    }

    // Apply sorting based on sortBy value
    const [sortColumn, sortDirection] = sortBy.split('-');
    
    data.sort((a, b) => {
      let aValue, bValue;

      switch (sortColumn) {
        case 'timestamp':
          aValue = new Date(a.timestamp);
          bValue = new Date(b.timestamp);
          break;
        case 'score':
          aValue = a.score;
          bValue = b.score;
          break;
        case 'shift':
          aValue = a.shift;
          bValue = b.shift;
          break;
        case 'auditor':
          aValue = a.auditor.toLowerCase();
          bValue = b.auditor.toLowerCase();
          break;
        case 'auditee':
          aValue = a.auditee.toLowerCase();
          bValue = b.auditee.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return data;
  }, [searchTerm, sortBy, columnFilters]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedData, page, rowsPerPage]);

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleActionClick = (log) => {
    console.log('Action clicked for:', log);
  };

  const columnFilterOpen = Boolean(columnFilterAnchor);

  // Render column filter content based on column type
  const renderColumnFilter = () => {
    if (!activeFilterColumn) return null;

    switch (activeFilterColumn) {
      case 'shift':
        return (
          <Box sx={{ p: 2, minWidth: 200 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Filter by Shift
            </Typography>
            {uniqueShifts.map(shift => (
              <Box key={shift} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Checkbox
                  checked={columnFilters.shift.includes(shift)}
                  onChange={() => handleShiftFilterToggle(shift)}
                  size="small"
                />
                <Typography variant="body2">Shift {shift}</Typography>
              </Box>
            ))}
            <Button
              size="small"
              onClick={() => clearColumnFilter('shift')}
              startIcon={<ClearIcon />}
              sx={{ mt: 1 }}
              fullWidth
            >
              Clear
            </Button>
          </Box>
        );

      case 'auditor':
        return (
          <Box sx={{ p: 2, minWidth: 250 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Filter by Auditor
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Type auditor name..."
              value={columnFilters.auditor}
              onChange={(e) => handleAuditorFilterChange(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="caption" sx={{ mb: 1, display: 'block', color: 'text.secondary' }}>
              Select from list:
            </Typography>
            <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
              {uniqueAuditors.map(auditor => (
                <Box
                  key={auditor}
                  sx={{
                    p: 1,
                    cursor: 'pointer',
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'action.hover' },
                    bgcolor: columnFilters.auditor === auditor ? 'action.selected' : 'transparent'
                  }}
                  onClick={() => handleAuditorFilterChange(auditor)}
                >
                  <Typography variant="body2">{auditor}</Typography>
                </Box>
              ))}
            </Box>
            <Button
              size="small"
              onClick={() => clearColumnFilter('auditor')}
              startIcon={<ClearIcon />}
              sx={{ mt: 2 }}
              fullWidth
            >
              Clear
            </Button>
          </Box>
        );

      case 'auditee':
        return (
          <Box sx={{ p: 2, minWidth: 250 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Filter by Auditee
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Type auditee name..."
              value={columnFilters.auditee}
              onChange={(e) => handleAuditeeFilterChange(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="caption" sx={{ mb: 1, display: 'block', color: 'text.secondary' }}>
              Select from list:
            </Typography>
            <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
              {uniqueAuditees.map(auditee => (
                <Box
                  key={auditee}
                  sx={{
                    p: 1,
                    cursor: 'pointer',
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'action.hover' },
                    bgcolor: columnFilters.auditee === auditee ? 'action.selected' : 'transparent'
                  }}
                  onClick={() => handleAuditeeFilterChange(auditee)}
                >
                  <Typography variant="body2">{auditee}</Typography>
                </Box>
              ))}
            </Box>
            <Button
              size="small"
              onClick={() => clearColumnFilter('auditee')}
              startIcon={<ClearIcon />}
              sx={{ mt: 2 }}
              fullWidth
            >
              Clear
            </Button>
          </Box>
        );

      case 'machinesAudited':
        return (
          <Box sx={{ p: 2, minWidth: 280 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Filter by Machines
            </Typography>
            
            <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 500 }}>
              Number Range:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                size="small"
                type="number"
                placeholder="Min"
                value={columnFilters.machinesAudited.min}
                onChange={(e) => handleMachineRangeChange('min', e.target.value)}
                sx={{ flex: 1 }}
              />
              <TextField
                size="small"
                type="number"
                placeholder="Max"
                value={columnFilters.machinesAudited.max}
                onChange={(e) => handleMachineRangeChange('max', e.target.value)}
                sx={{ flex: 1 }}
              />
            </Box>

            <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 500 }}>
              Specific Machines:
            </Typography>
            <Box sx={{ maxHeight: 200, overflowY: 'auto', mb: 2 }}>
              {uniqueMachines.map(machine => (
                <Box key={machine} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Checkbox
                    checked={columnFilters.machinesAudited.specific.includes(machine)}
                    onChange={() => handleMachineFilterToggle(machine)}
                    size="small"
                  />
                  <Typography variant="body2">Machine {machine}</Typography>
                </Box>
              ))}
            </Box>

            <Button
              size="small"
              onClick={() => clearColumnFilter('machinesAudited')}
              startIcon={<ClearIcon />}
              fullWidth
            >
              Clear
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <div className="audit-logs-container">
      {/* Top Header Bar - Title on Left, Sort and Search on Right */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          px: 1
        }}
      >
        {/* Left: Title */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: '#404040',
            letterSpacing: '-0.5px'
          }}
        >
          Process Audit Logs
        </Typography>

        {/* Right: Sort + Search */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* Sort Control */}
          <FormControl
            size="small"
            sx={{
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                borderRadius: '16px'
              }
            }}
          >
            <InputLabel id="sort-label">Sort By</InputLabel>
            <Select
              labelId="sort-label"
              value={sortBy}
              label="Sort By"
              onChange={handleSortChange}
              sx={{
                borderRadius: '16px'
              }}
            >
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

          {/* Search Bar with Icon */}
          <TextField
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              minWidth: 300,
              '& .MuiOutlinedInput-root': {
                borderRadius: '16px',
                paddingLeft: '8px'
              }
            }}
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

      {/* Clear Column Filters Button */}
      {(hasActiveFilter('shift') || hasActiveFilter('auditor') || 
        hasActiveFilter('auditee') || hasActiveFilter('machinesAudited')) && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<ClearIcon />}
            onClick={clearAllColumnFilters}
            sx={{ borderRadius: '16px' }}
          >
            Clear Column Filters
          </Button>
        </Box>
      )}

      {/* Active Filters Display */}
      {(hasActiveFilter('shift') || hasActiveFilter('auditor') || 
        hasActiveFilter('auditee') || hasActiveFilter('machinesAudited')) && (
        <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Active Column Filters:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {columnFilters.shift.length > 0 && (
              <Chip
                label={`Shift: ${columnFilters.shift.join(', ')}`}
                onDelete={() => clearColumnFilter('shift')}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {columnFilters.auditor && (
              <Chip
                label={`Auditor: ${columnFilters.auditor}`}
                onDelete={() => clearColumnFilter('auditor')}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {columnFilters.auditee && (
              <Chip
                label={`Auditee: ${columnFilters.auditee}`}
                onDelete={() => clearColumnFilter('auditee')}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {hasActiveFilter('machinesAudited') && (
              <Chip
                label="Machines: Filtered"
                onDelete={() => clearColumnFilter('machinesAudited')}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Stack>
        </Box>
      )}

      {/* Table with column filters */}
      <TableContainer component={Paper} className="table-wrapper">
        <Table className="audit-table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell 
                  key={column.id} 
                  align={column.align}
                  sx={{ 
                    color: '#404040 !important',
                    fontWeight: '600 !important',
                    fontSize: '14px !important',
                    borderRight: '1px solid #E4E4E4'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{column.label}</span>
                    {column.filterable && (
                      <IconButton
                        size="small"
                        onClick={(e) => handleColumnFilterClick(e, column.id)}
                        sx={{
                          color: hasActiveFilter(column.id) ? '#0077B6' : '#666',
                          '&:hover': { color: '#0077B6' }
                        }}
                      >
                        <FilterListIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((log) => (
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
                    <IconButton
                      className="action-icon"
                      size="small"
                      onClick={() => handleActionClick(log)}
                    >
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
          Showing {filteredAndSortedData.length > 0 ? page * rowsPerPage + 1 : 0} to {Math.min((page + 1) * rowsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} entries
        </Typography>
        <TablePagination
          component="div"
          count={filteredAndSortedData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
          labelRowsPerPage="Rows per page:"
        />
      </div>

      {/* Column Filter Popover */}
      <Popover
        open={columnFilterOpen}
        anchorEl={columnFilterAnchor}
        onClose={handleColumnFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {renderColumnFilter()}
      </Popover>
    </div>
  );
};

export default AuditLogsTable;