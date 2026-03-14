// 1. Core candidates
export const MOCK_CANDIDATES = {
  data: [
    { id: 1, full_name: 'Rahul Lagwal', email: 'rahul@example.com', username: 'rahullagwal', department: 'Engineering', status: 'VERIFIED', created_at: '2024-03-01T10:00:00Z' },
    { id: 2, full_name: 'Harsh Singh', email: 'harsh@example.com', username: 'harshs', department: 'Data Science', status: 'PENDING', created_at: '2024-03-05T14:30:00Z' },
    { id: 3, full_name: 'Priya Sharma', email: 'priya@example.com', username: 'priyas', department: 'Frontend', status: 'VERIFIED', created_at: '2024-02-28T09:15:00Z' },
    { id: 4, full_name: 'Amit Kumar', email: 'amit@example.com', username: 'amitk', department: 'Backend', status: 'REJECTED', created_at: '2024-03-10T11:45:00Z' },
    { id: 5, full_name: 'Sneha Patel', email: 'sneha@example.com', username: 'snehap', department: 'Engineering', status: 'VERIFIED', created_at: '2024-03-12T16:20:00Z' },
    { id: 6, full_name: 'Vikram Aditya', email: 'vikram@example.com', username: 'vikrama', department: 'Mobile', status: 'PENDING', created_at: '2024-03-13T08:00:00Z' },
    { id: 7, full_name: 'Anjali Gupta', email: 'anjali@example.com', username: 'anjalig', department: 'Data Science', status: 'PENDING', created_at: '2024-03-02T13:10:00Z' },
    // More data for scalability
    { id: 8, full_name: 'Rohit Verma', email: 'rohit@example.com', username: 'rohitv', department: 'Engineering', status: 'VERIFIED', created_at: '2024-03-14T10:00:00Z' },
    { id: 9, full_name: 'Kavita Singh', email: 'kavita@example.com', username: 'kavitas', department: 'HR', status: 'PENDING', created_at: '2024-03-14T11:00:00Z' },
    { id: 10, full_name: 'Deepak Raj', email: 'deepak@example.com', username: 'deepakr', department: 'Design', status: 'VERIFIED', created_at: '2024-03-14T12:00:00Z' },
  ],
  meta: { total: 10, page: 1, limit: 15 }
};

// 2. Risk Summary (Dashboard Data)
export const MOCK_RISK_SUMMARY = {
  data: [
    { id: 1, full_name: 'Rahul Lagwal', email: 'rahul@example.com', total_risk_score: 88.5, status: 'VERIFIED', start_time: '2024-03-13T10:00:00Z' },
    { id: 2, full_name: 'Harsh Singh', email: 'harsh@example.com', total_risk_score: 65.0, status: 'PENDING', start_time: '2024-03-13T12:30:00Z' },
    { id: 3, full_name: 'Priya Sharma', email: 'priya@example.com', total_risk_score: 92.0, status: 'VERIFIED', start_time: '2024-03-12T09:00:00Z' },
    { id: 4, full_name: 'Amit Kumar', email: 'amit@example.com', total_risk_score: 12.1, status: 'REJECTED', start_time: '2024-03-11T15:00:00Z' },
    { id: 5, full_name: 'Sneha Patel', email: 'sneha@example.com', total_risk_score: 84.0, status: 'VERIFIED', start_time: '2024-03-12T14:00:00Z' },
    { id: 6, full_name: 'Vikram Aditya', email: 'vikram@example.com', total_risk_score: 72.0, status: 'PENDING', start_time: '2024-03-13T08:00:00Z' },
    { id: 7, full_name: 'Anjali Gupta', email: 'anjali@example.com', total_risk_score: null, status: 'VERIFIED', start_time: null }, // INVALID STATUS FOR FIX TEST
    { id: 8, full_name: 'Rohit Verma', email: 'rohit@example.com', total_risk_score: 82.0, status: 'VERIFIED', start_time: '2024-03-14T10:00:00Z' },
    { id: 9, full_name: 'Kavita Singh', email: 'kavita@example.com', total_risk_score: 25.0, status: 'VERIFIED', start_time: '2024-03-14T11:00:00Z' }, // INVALID STATUS (Below passing)
    { id: 10, full_name: 'Deepak Raj', email: 'deepak@example.com', total_risk_score: 78.5, status: 'VERIFIED', start_time: '2024-03-14T12:00:00Z' },
  ],
  meta: { total: 10 }
};

// 3. Exam Sessions
export const MOCK_SESSIONS = {
  data: [
    { id: 101, user_id: 1, status: 'COMPLETED', total_risk_score: 88.5, start_time: '2024-03-13T10:00:00Z', end_time: '2024-03-13T11:00:00Z', user: MOCK_CANDIDATES.data[0] },
    { id: 102, user_id: 2, status: 'IN_PROGRESS', total_risk_score: 65.0, start_time: '2024-03-13T12:30:00Z', end_time: null, user: MOCK_CANDIDATES.data[1] },
    { id: 103, user_id: 3, status: 'COMPLETED', total_risk_score: 92.0, start_time: '2024-03-12T09:00:00Z', end_time: '2024-03-12T10:15:00Z', user: MOCK_CANDIDATES.data[2] },
    { id: 104, user_id: 4, status: 'FLAGGED', total_risk_score: 12.1, start_time: '2024-03-11T15:00:00Z', end_time: '2024-03-11T16:00:00Z', user: MOCK_CANDIDATES.data[3] },
    { id: 105, user_id: 5, status: 'COMPLETED', total_risk_score: 84.0, start_time: '2024-03-12T14:00:00Z', end_time: '2024-03-12T15:00:00Z', user: MOCK_CANDIDATES.data[4] },
    { id: 106, user_id: 6, status: 'COMPLETED', total_risk_score: 72.0, start_time: '2024-03-13T08:00:00Z', end_time: '2024-03-13T09:00:00Z', user: MOCK_CANDIDATES.data[5] },
    { id: 108, user_id: 8, status: 'COMPLETED', total_risk_score: 82.0, start_time: '2024-03-14T10:00:00Z', end_time: '2024-03-14T11:00:00Z', user: MOCK_CANDIDATES.data[7] },
    { id: 110, user_id: 10, status: 'COMPLETED', total_risk_score: 78.5, start_time: '2024-03-14T12:00:00Z', end_time: '2024-03-14T13:00:00Z', user: MOCK_CANDIDATES.data[9] },
  ],
  meta: { total: 8, page: 1, limit: 20 }
};

// 4. Audit Logs
export const MOCK_AUDIT_LOGS = {
  data: [
    { 
      id: 1001, 
      action_type: 'LOGIN', 
      admin_name: 'Harsh Lagwal', 
      admin_email: 'harsh@example.com', 
      admin_role: 'Super Admin',
      target_id: null, 
      ip_address: '192.168.1.1', 
      device_info: 'PC / Windows',
      browser: 'Chrome 122',
      location: 'New Delhi, IN',
      risk_level: 'LOW',
      details: 'Successful administrator login', 
      created_at: '2024-03-13T09:00:00Z' 
    },
    { 
      id: 1002, 
      action_type: 'UPDATE_STATUS', 
      admin_name: 'Harsh Lagwal', 
      admin_email: 'harsh@example.com', 
      admin_role: 'Super Admin',
      target_id: '1', 
      ip_address: '192.168.1.1', 
      device_info: 'PC / Windows',
      browser: 'Chrome 122',
      location: 'New Delhi, IN',
      risk_level: 'LOW',
      details: 'Updated Rahul Lagwal to VERIFIED', 
      created_at: '2024-03-13T10:15:00Z' 
    },
    { 
      id: 1003, 
      action_type: 'FAILED_LOGIN', 
      admin_name: 'System', 
      admin_email: 'unknown@portal.com', 
      admin_role: 'N/A',
      target_id: null, 
      ip_address: '45.12.33.102', 
      device_info: 'Mobile / Android',
      browser: 'Unknown',
      location: 'Kyiv, UA',
      risk_level: 'HIGH',
      details: 'SUSPICIOUS LOGIN DETECTED: Multiple failed attempts from new IP', 
      created_at: '2024-03-13T12:45:00Z' 
    },
    { 
      id: 1004, 
      action_type: 'DOWNLOAD_PDF', 
      admin_name: 'Editor Admin', 
      admin_email: 'admin@portal.com', 
      admin_role: 'Editor',
      target_id: '101', 
      ip_address: '192.168.1.5', 
      device_info: 'MacBook / macOS',
      browser: 'Safari 17',
      location: 'Mumbai, IN',
      risk_level: 'MEDIUM',
      details: 'Downloaded exam report for user #101', 
      created_at: '2024-03-13T13:00:00Z' 
    },
    { 
      id: 1005, 
      action_type: 'LOGOUT', 
      admin_name: 'Harsh Lagwal', 
      admin_email: 'harsh@example.com', 
      admin_role: 'Super Admin',
      target_id: null, 
      ip_address: '192.168.1.1', 
      device_info: 'PC / Windows',
      browser: 'Chrome 122',
      location: 'New Delhi, IN',
      risk_level: 'LOW',
      details: 'Administrator session ended', 
      created_at: '2024-03-13T13:30:00Z' 
    },
  ],
  meta: { total: 5, page: 1, limit: 20 }
};
