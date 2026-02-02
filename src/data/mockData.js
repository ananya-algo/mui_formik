// mockData.js
export const auditLogsData = [
  {
    id: 1,
    timestamp: '2024-01-15 08:30:00',
    shift: 'A',
    score: 92,
    auditor: 'John Smith',
    auditee: 'Jane Doe',
    normalViolations: 2,
    severeViolations: 0,
    machinesAudited: [101, 102, 103]
  },
  {
    id: 2,
    timestamp: '2024-01-15 09:15:00',
    shift: 'A',
    score: 88,
    auditor: 'Sarah Johnson',
    auditee: 'Mike Wilson',
    normalViolations: 3,
    severeViolations: 1,
    machinesAudited: [104, 105]
  },
  {
    id: 3,
    timestamp: '2024-01-15 14:20:00',
    shift: 'B',
    score: 95,
    auditor: 'Robert Brown',
    auditee: 'Emily Davis',
    normalViolations: 1,
    severeViolations: 0,
    machinesAudited: [106, 107, 108, 109]
  },
  {
    id: 4,
    timestamp: '2024-01-15 15:45:00',
    shift: 'B',
    score: 78,
    auditor: 'John Smith',
    auditee: 'Chris Lee',
    normalViolations: 5,
    severeViolations: 2,
    machinesAudited: [110, 111]
  },
  {
    id: 5,
    timestamp: '2024-01-15 22:10:00',
    shift: 'C',
    score: 91,
    auditor: 'Sarah Johnson',
    auditee: 'Anna Martinez',
    normalViolations: 2,
    severeViolations: 0,
    machinesAudited: [112, 113, 114]
  },
  {
    id: 6,
    timestamp: '2024-01-16 08:00:00',
    shift: 'A',
    score: 85,
    auditor: 'Robert Brown',
    auditee: 'David Garcia',
    normalViolations: 4,
    severeViolations: 1,
    machinesAudited: [101, 115]
  },
  {
    id: 7,
    timestamp: '2024-01-16 09:30:00',
    shift: 'A',
    score: 93,
    auditor: 'Emily Davis',
    auditee: 'Jane Doe',
    normalViolations: 1,
    severeViolations: 0,
    machinesAudited: [102, 103, 116]
  },
  {
    id: 8,
    timestamp: '2024-01-16 14:00:00',
    shift: 'B',
    score: 89,
    auditor: 'John Smith',
    auditee: 'Mike Wilson',
    normalViolations: 3,
    severeViolations: 0,
    machinesAudited: [117, 118]
  },
  {
    id: 9,
    timestamp: '2024-01-16 15:20:00',
    shift: 'B',
    score: 97,
    auditor: 'Sarah Johnson',
    auditee: 'Emily Davis',
    normalViolations: 0,
    severeViolations: 0,
    machinesAudited: [119, 120, 121, 122]
  },
  {
    id: 10,
    timestamp: '2024-01-16 22:45:00',
    shift: 'C',
    score: 82,
    auditor: 'Robert Brown',
    auditee: 'Chris Lee',
    normalViolations: 4,
    severeViolations: 1,
    machinesAudited: [123, 124]
  },
  {
    id: 11,
    timestamp: '2024-01-17 08:15:00',
    shift: 'A',
    score: 90,
    auditor: 'Emily Davis',
    auditee: 'Anna Martinez',
    normalViolations: 2,
    severeViolations: 0,
    machinesAudited: [101, 102, 125]
  },
  {
    id: 12,
    timestamp: '2024-01-17 09:40:00',
    shift: 'A',
    score: 86,
    auditor: 'John Smith',
    auditee: 'David Garcia',
    normalViolations: 3,
    severeViolations: 1,
    machinesAudited: [126, 127]
  },
  {
    id: 13,
    timestamp: '2024-01-17 14:30:00',
    shift: 'B',
    score: 94,
    auditor: 'Sarah Johnson',
    auditee: 'Jane Doe',
    normalViolations: 1,
    severeViolations: 0,
    machinesAudited: [128, 129, 130]
  },
  {
    id: 14,
    timestamp: '2024-01-17 16:00:00',
    shift: 'B',
    score: 88,
    auditor: 'Robert Brown',
    auditee: 'Mike Wilson',
    normalViolations: 3,
    severeViolations: 0,
    machinesAudited: [131, 132]
  },
  {
    id: 15,
    timestamp: '2024-01-17 23:00:00',
    shift: 'C',
    score: 91,
    auditor: 'Emily Davis',
    auditee: 'Emily Davis',
    normalViolations: 2,
    severeViolations: 0,
    machinesAudited: [133, 134, 135, 136]
  },
  {
    id: 16,
    timestamp: '2024-01-18 08:20:00',
    shift: 'A',
    score: 79,
    auditor: 'John Smith',
    auditee: 'Chris Lee',
    normalViolations: 5,
    severeViolations: 2,
    machinesAudited: [137, 138]
  },
  {
    id: 17,
    timestamp: '2024-01-18 10:00:00',
    shift: 'A',
    score: 96,
    auditor: 'Sarah Johnson',
    auditee: 'Anna Martinez',
    normalViolations: 1,
    severeViolations: 0,
    machinesAudited: [101, 139, 140]
  },
  {
    id: 18,
    timestamp: '2024-01-18 14:45:00',
    shift: 'B',
    score: 87,
    auditor: 'Robert Brown',
    auditee: 'David Garcia',
    normalViolations: 3,
    severeViolations: 1,
    machinesAudited: [141, 142]
  },
  {
    id: 19,
    timestamp: '2024-01-18 15:30:00',
    shift: 'B',
    score: 92,
    auditor: 'Emily Davis',
    auditee: 'Jane Doe',
    normalViolations: 2,
    severeViolations: 0,
    machinesAudited: [143, 144, 145]
  },
  {
    id: 20,
    timestamp: '2024-01-18 22:30:00',
    shift: 'C',
    score: 84,
    auditor: 'John Smith',
    auditee: 'Mike Wilson',
    normalViolations: 4,
    severeViolations: 1,
    machinesAudited: [146, 147, 148, 149]
  }
];