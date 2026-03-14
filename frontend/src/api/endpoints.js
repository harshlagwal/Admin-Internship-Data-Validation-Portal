import api from './client';
import * as mock from './mockData';

// Set to true to use mock data, false to use real API
const USE_MOCK = true;

const wrapMock = (data) => Promise.resolve({ data });

// AUTH
export const login = (data) => USE_MOCK ? wrapMock({ token: 'mock-token', admin: { fullName: 'Harsh Lagwal', email: 'harsh@example.com' } }) : api.post('/auth/login', data);
export const signup = (data) => api.post('/auth/signup', data);
export const logout = () => USE_MOCK ? wrapMock({}) : api.post('/auth/logout');
export const getMe = () => USE_MOCK ? wrapMock({ data: { id: 1, fullName: 'Harsh Lagwal', email: 'harsh@example.com' } }) : api.get('/auth/me');

// CANDIDATES (users)
export const getCandidates = (params) => {
  if (USE_MOCK) {
    let filtered = [...mock.MOCK_CANDIDATES.data];
    if (params?.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.full_name.toLowerCase().includes(s) || 
        c.email.toLowerCase().includes(s) || 
        c.status.toLowerCase().includes(s)
      );
    }
    return wrapMock({ data: filtered, meta: { ...mock.MOCK_CANDIDATES.meta, total: filtered.length } });
  }
  return api.get('/candidates', { params });
};

export const updateCandidateStatus = (id, status) => {
  if (USE_MOCK) {
    const candidateId = parseInt(id);
    const now = new Date().toISOString();
    
    // 1. Update Candidate list
    const candidate = mock.MOCK_CANDIDATES.data.find(c => c.id === candidateId);
    if (candidate) candidate.status = status;
    
    // 2. Update Risk Summary (Dashboard Table)
    const riskItem = mock.MOCK_RISK_SUMMARY.data.find(r => r.id === candidateId);
    if (riskItem) riskItem.status = status;

    // 3. Propagate to Sessions: If verified/rejected, close any open sessions
    mock.MOCK_SESSIONS.data.forEach(s => {
      if (s.user_id === candidateId) {
        if (s.user) s.user.status = status;
        if ((status === 'VERIFIED' || status === 'REJECTED') && (s.status === 'IN_PROGRESS' || s.status === 'FLAGGED')) {
          s.status = 'COMPLETED';
          s.end_time = now;
        }
      }
    });

    return wrapMock({ success: true, status });
  }
  return api.patch(`/candidates/${id}/status`, { status });
};

export const getCandidate = (id) => {
  if (USE_MOCK) {
    const candidate = mock.MOCK_CANDIDATES.data.find(c => c.id === parseInt(id)) || mock.MOCK_CANDIDATES.data[0];
    return wrapMock({ data: candidate });
  }
  return api.get(`/candidates/${id}`);
};

// SESSIONS
export const getSessions = (params) => {
  if (USE_MOCK) {
    let filtered = [...mock.MOCK_SESSIONS.data];
    if (params?.status) {
      filtered = filtered.filter(s => s.status === params.status);
    }
    if (params?.userId) {
      filtered = filtered.filter(s => s.user_id === parseInt(params.userId));
    }
    return wrapMock({ data: filtered, meta: { ...mock.MOCK_SESSIONS.meta, total: filtered.length } });
  }
  return api.get('/sessions', { params });
};

export const getSession = (id) => {
  if (USE_MOCK) {
    const session = mock.MOCK_SESSIONS.data.find(s => s.id === parseInt(id)) || mock.MOCK_SESSIONS.data[0];
    return wrapMock({ data: session });
  }
  return api.get(`/sessions/${id}`);
};
export const getRiskSummary = (params) => {
  if (USE_MOCK) {
    const PASSING_SCORE = 40;
    const correctedData = mock.MOCK_RISK_SUMMARY.data.map(item => {
      // Mandatory Verification Logic Fix
      if (item.status === 'VERIFIED') {
        // Condition 1 & 2: Must have completed exam and score must exist
        if (item.total_risk_score === null || item.total_risk_score === undefined) {
          return { ...item, status: 'PENDING' };
        }
        // Condition 3: Score must be above passing threshold
        if (item.total_risk_score < PASSING_SCORE) {
          return { ...item, status: 'REJECTED' };
        }
      }
      return item;
    });
    return wrapMock({ data: correctedData, meta: mock.MOCK_RISK_SUMMARY.meta });
  }
  return api.get('/sessions/risk-summary', { params });
};

// ... rest remains same ...

// AUDIT LOGS
export const getAuditLogs = (params) => {
  if (USE_MOCK) {
    let filtered = [...mock.MOCK_AUDIT_LOGS.data];
    if (params?.action) {
      filtered = filtered.filter(l => l.action_type === params.action);
    }
    if (params?.risk) {
      filtered = filtered.filter(l => l.risk_level === params.risk);
    }
    return wrapMock({ data: filtered, meta: { ...mock.MOCK_AUDIT_LOGS.meta, total: filtered.length } });
  }
  return api.get('/audit-logs', { params });
};

// REPORTS
export const downloadReport = (sessionId, format) => {
  if (USE_MOCK) {
    if (format === 'pdf') {
      // Valid PDF base64 with multiple lines of text
      const pdfBase64 = "JVBERi0xLjQKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqCjIgMCBvYmo8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PmVuZG9iagozIDAgb2JqPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9NZWRpYUJveFswIDAgNTk1IDg0Ml0vUmVzb3VyY2VzPDwvRm9udDw8L0YxIDQgMCBSPj4+Pi9Db250ZW50cyA1IDAgUj4+ZW5kb2JqCjQgMCBvYmo8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PmVuZG9iago1IDAgb2JqPDwvTGVuZ3RoIDMxMD4+c3RyZWFtCkJUCi9GMTI0IFRmIDcwIDgwMCBUZCAoSW50ZXJuIFBlcmZvcm1hbmNlIFJlcG9ydCkgVGoKMCAtNDAgVGQKL0YxIDEyIFRmIChHZW5lcmF0ZWQgYnkgQWRtaW4gUG9ydGFsIC0gU2VjdXJlIE1vbml0b3JpbmcpIFRqCjAgLTMwIFRkCihJbnRlcm4gRGV0YWlsczopIFRqCjAgLTIwIFRkIChOYW1lOiBSYWh1bCBMYWd3YWwpIFRqCjAgLTIwIFRkIChFbWFpbDogcmFodWxAZXhhbXBsZS5jb20pIFRqCjAgLTIwIFRkIChEZXBhcnRtZW50OiBFbmdpbmVlcmluZykgVGoKMCAtMzAgVGQKKEV4YW0gQW5hbHl0aWNzOikgVGoKMCAtMjAgVGQgKFBlcmZvcm1hbmNlIFNjb3JlOiA4OC41JSkgVGoKMCAtMjAgVGQgKFN0YXR1czogVkVSSUZJRUQpIFRqCjAgLTMwIFRkIChBSSBFdmFsdWF0aW9uOiBTdHJvbmcgZm91bmRhdGlvbmFsIGtub3dsZWRnZSBpbiBEU0EgYW5kIFByb2JsZW0gU29sdmluZy4pIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE4IDAwMDAwIG4gCjAwMDAwMDAwNjMgMDAwMDAgbiAKMDAwMDAwMDExOCAwMDAwMCBuIAowMDAwMDAwMjM1IDAwMDAwIG4gCjAwMDAwMDAzMDMgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDYvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgo2NjMKJSVFT0Y=";
      const byteCharacters = atob(pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return wrapMock(new Blob([byteArray], { type: 'application/pdf' }));
    }
    return wrapMock(new Blob(["Intern,Email,Score,Status\nRahul,rahul@example.com,88.5,VERIFIED"], { type: 'text/csv' }));
  }
  return api.get(`/reports/session/${sessionId}/${format}`, { responseType: 'blob' });
};
