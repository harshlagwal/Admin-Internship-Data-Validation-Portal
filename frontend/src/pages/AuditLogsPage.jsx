import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAuditLogs } from '../api/endpoints';
import { Shield, Filter, ChevronLeft, ChevronRight, AlertTriangle, Smartphone, Globe, Monitor } from 'lucide-react';
import { format } from 'date-fns';

const ACTION_COLORS = {
  LOGIN:            'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10',
  LOGOUT:           'text-slate-600 dark:text-slate-400 bg-slate-500/10',
  VIEW_SESSION:     'text-blue-700 dark:text-blue-400 bg-blue-500/10',
  UPDATE_STATUS:    'text-amber-700 dark:text-amber-400 bg-amber-500/10',
  DOWNLOAD_PDF:     'text-violet-700 dark:text-violet-400 bg-violet-500/10',
  FAILED_LOGIN:     'text-red-700 dark:text-red-400 bg-red-500/10',
};

const RISK_STYLES = {
  LOW:    'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  MEDIUM: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  HIGH:   'bg-red-500/20 text-red-600 border-red-500/30 font-bold animate-pulse',
};

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', page, actionFilter, riskFilter],
    queryFn: () => getAuditLogs({ 
      page, 
      limit, 
      action: actionFilter || undefined,
      risk: riskFilter || undefined
    }).then(r => r.data),
  });

  const logs = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary-main" />
            Security & Audit Logs
          </h1>
          <p className="text-secondary text-sm mt-1">Immutable enterprise-grade traceability & monitoring</p>
        </div>
        <div className="flex gap-2">
           <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full flex items-center gap-2">
             <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
             <span className="text-[10px] font-bold text-red-600 uppercase">Suspicious Activity Monitoring Active</span>
           </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        {/* Advanced Filter Bar */}
        <div className="px-6 py-4 border-b border-main flex flex-wrap items-center gap-4 bg-surface-subtle/30">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted" />
            <span className="text-xs font-semibold text-secondary uppercase">Filters:</span>
          </div>
          
          <select
            value={actionFilter}
            onChange={e => { setActionFilter(e.target.value); setPage(1); }}
            className="select py-1.5 text-xs max-w-[160px]"
          >
            <option value="">All Actions</option>
            <option value="LOGIN">LOGIN</option>
            <option value="FAILED_LOGIN">FAILED_LOGIN</option>
            <option value="UPDATE_STATUS">UPDATE_STATUS</option>
            <option value="DOWNLOAD_PDF">DOWNLOAD_PDF</option>
          </select>

          <select
            value={riskFilter}
            onChange={e => { setRiskFilter(e.target.value); setPage(1); }}
            className="select py-1.5 text-xs max-w-[160px]"
          >
            <option value="">All Risk Levels</option>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
          </select>

          <span className="text-xs text-secondary ml-auto">{total} audit records secured</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-subtle">
                {['Timestamp', 'Administrator (Role)', 'Action', 'System Metadata', 'Risk Assessment', 'Activity Details'].map(h => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="table-cell text-center py-12 text-muted">Loading logs…</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={6} className="table-cell text-center py-12 text-muted">No audit logs recorded</td></tr>
              ) : logs.map(log => (
                <tr key={log.id} className={`table-row ${log.risk_level === 'HIGH' ? 'bg-red-500/[0.03]' : ''}`}>
                  <td className="table-cell">
                    <div className="text-xs font-mono text-primary font-bold">
                      {log.created_at ? format(new Date(log.created_at), 'dd MMM yy') : '—'}
                    </div>
                    <div className="text-[10px] text-muted font-mono leading-none mt-1">
                      {log.created_at ? format(new Date(log.created_at), 'HH:mm:ss') : ''}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm font-bold text-primary">{log.admin_name}</div>
                    <div className="text-[10px] text-primary-main font-bold uppercase tracking-wider">{log.admin_role || 'STAFF'}</div>
                  </td>
                  <td className="table-cell">
                    <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded-md border border-current/10 ${ACTION_COLORS[log.action_type] || 'text-primary-main bg-primary-main/10'}`}>
                      {log.action_type}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-primary">
                        <Monitor className="w-3 h-3 text-muted" /> {log.device_info || 'Unknown Device'}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-secondary">
                        <Globe className="w-3 h-3 text-muted" /> {log.location || 'Unknown IP'}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${RISK_STYLES[log.risk_level] || RISK_STYLES.LOW}`}>
                      {log.risk_level} RISK
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="text-xs text-secondary max-w-xs break-words leading-relaxed">
                      {log.details}
                      {log.target_id && <span className="ml-1 font-mono text-primary-main font-semibold">[ID: {log.target_id}]</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-main flex items-center justify-between bg-surface-subtle/20">
          <span className="text-xs text-secondary">Secured Audit Trail • Page {page} of {totalPages}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="btn-icon disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="btn-icon disabled:opacity-40">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
