import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCandidates } from '../api/endpoints';
import { Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CandidatesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 15;

  const { data, isLoading } = useQuery({
    queryKey: ['candidates', page, search],
    queryFn: () => getCandidates({ page, limit, search }).then(r => r.data),
  });

  const candidates = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Interns & Applicants</h1>
          <p className="text-secondary text-sm mt-1">Lifecycle management for all registered personnel</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        {/* Filter bar */}
        <div className="px-6 py-4 border-b border-main flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              id="intern-search"
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, email or status…"
              className="input pl-9 py-2"
            />
          </div>
          <span className="text-xs text-secondary ml-auto">{total} total records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-subtle">
                {['ID', 'Full Name', 'Department', 'Email', 'Status', 'Actions'].map(h => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="table-cell text-center py-12 text-muted">Loading records…</td></tr>
              ) : candidates.length === 0 ? (
                <tr><td colSpan={6} className="table-cell text-center py-12 text-muted">No records found</td></tr>
              ) : candidates.map(c => (
                <tr key={c.id} className="table-row">
                  <td className="table-cell font-mono text-primary-main text-xs">#{c.id}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-main to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                        {c.full_name?.[0] ?? '?'}
                      </div>
                      <span className="font-medium text-primary">{c.full_name}</span>
                    </div>
                  </td>
                  <td className="table-cell text-secondary">{c.department || 'General'}</td>
                  <td className="table-cell text-secondary">{c.email}</td>
                  <td className="table-cell">
                    <span className={`badge ${c.status === 'VERIFIED' ? 'badge-active' : c.status === 'REJECTED' ? 'badge-flagged' : 'badge-pending'}`}>
                      {c.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <button
                      id={`view-intern-${c.id}`}
                      onClick={() => navigate(`/candidates/${c.id}`)}
                      className="btn-secondary h-8 w-8 !p-0 justify-center"
                      title="View Profile & Exam results"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-main flex items-center justify-between">
            <span className="text-xs text-secondary">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-icon disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                if (p < 1 || p > totalPages) return null;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-150 ${page === p ? 'bg-primary-main text-white shadow-md' : 'text-secondary hover:bg-surface-subtle hover:text-primary'}`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-icon disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
