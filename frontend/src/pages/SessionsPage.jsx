import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSessions } from '../api/endpoints';
import { Activity, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';



function StatusBadge({ status }) {
  const map = {
    IN_PROGRESS: 'badge-pending',
    COMPLETED:   'badge-active',
    FLAGGED:     'badge-flagged',
  };
  return <span className={map[status] ?? 'badge-pending'}>{status}</span>;
}

export default function SessionsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ['sessions', page, status],
    queryFn: () => getSessions({ page, limit, status: status || undefined }).then(r => r.data),
  });

  const sessions = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-primary">Interview Sessions</h1>
        <p className="text-secondary text-sm mt-1">All interview sessions with risk scores</p>
      </div>

      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-main flex items-center gap-3">
          <select
            id="session-status-filter"
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="select max-w-xs"
          >
            <option value="">All statuses</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="FLAGGED">Flagged</option>
          </select>
          <span className="text-xs text-secondary ml-auto">{total} sessions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-subtle">
                {['Session ID', 'Candidate', 'Start Time', 'End Time', 'Status', 'Action'].map(h => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="table-cell text-center py-12 text-muted">Loading sessions…</td></tr>
              ) : sessions.length === 0 ? (
                <tr><td colSpan={7} className="table-cell text-center py-12 text-muted">No sessions found</td></tr>
              ) : sessions.map(s => (
                <tr key={s.id} className="table-row">
                  <td className="table-cell font-mono text-primary-main text-xs">#{s.id}</td>
                  <td className="table-cell">
                    <div className="font-medium text-primary">{s.user?.full_name ?? `User #${s.user_id}`}</div>
                    <div className="text-xs text-secondary">{s.user?.email}</div>
                  </td>
                  <td className="table-cell font-mono text-xs text-secondary">
                    {s.start_time ? format(new Date(s.start_time), 'dd MMM yy HH:mm') : '—'}
                  </td>
                  <td className="table-cell font-mono text-xs text-secondary">
                    {s.end_time ? format(new Date(s.end_time), 'dd MMM yy HH:mm') : <span className="text-amber-500 font-semibold">Ongoing</span>}
                  </td>
                  <td className="table-cell"><StatusBadge status={s.status} /></td>
                  <td className="table-cell">
                    <button
                      id={`view-session-${s.id}`}
                      onClick={() => navigate(`/candidates/${s.user_id}`)}
                      className="btn-secondary text-xs py-1.5"
                    >
                      <Activity className="w-3 h-3" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-main flex items-center justify-between">
          <span className="text-xs text-secondary">Page {page} of {totalPages}</span>
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
