import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRiskSummary, getSessions } from '../api/endpoints';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { Users, Activity, AlertTriangle, CheckCircle, TrendingUp, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const StatusChip = ({ status }) => {
  const styles = {
    VERIFIED: 'badge-active',
    PENDING: 'badge-pending',
    REJECTED: 'badge-flagged',
    IN_PROGRESS: 'badge-completed'
  };
  return <span className={styles[status] || styles.PENDING}>{status}</span>;
}

function KPICard({ title, value, sub, icon: Icon, color, trend }) {
  return (
    <div className="card p-6 flex items-start gap-4 hover:border-primary-main/30 transition-colors duration-200 group">
      <div className={`p-3 rounded-xl ${color} shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-lg shadow-primary-main/10`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-secondary uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold text-primary mt-1">{value}</p>
        {sub && <p className="text-xs text-secondary mt-1">{sub}</p>}
      </div>
      {trend && (
        <div className={`text-xs font-semibold px-2 py-1 rounded-lg ${trend >= 0 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-400/10'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
}


const CustomDot = ({ cx, cy, payload, isDark }) => {
  if (!cx || !cy) return null;
  let color = '#f59e0b'; // Pending
  if (payload.status === 'VERIFIED') color = '#10b981'; // Verified
  if (payload.status === 'REJECTED') color = '#ef4444'; // Rejected
  return (
    <circle cx={cx} cy={cy} r={4} fill={color} strokeWidth={2} stroke={isDark ? '#0f172a' : '#fff'} />
  );
};

export default function DashboardPage() {
  const { admin } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartColors = {
    grid: isDark ? '#1e293b' : '#e2e8f0',
    text: isDark ? '#94a3b8' : '#64748b',
    tooltipBg: isDark ? '#1e293b' : '#ffffff',
    tooltipBorder: isDark ? '#334155' : '#e2e8f0',
    bar: isDark ? '#6366f1' : '#2563eb'
  };

  const { data: risk, isLoading: riskLoading } = useQuery({
    queryKey: ['risk-summary'],
    queryFn: () => getRiskSummary({ limit: 10 }).then(r => r.data),
    refetchInterval: 30000,
  });

  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['sessions-dash'],
    queryFn: () => getSessions({ limit: 100 }).then(r => r.data),
    refetchInterval: 30000,
  });

  const summaryList = risk?.data ?? [];
  const sessionList = sessions?.data ?? [];

  const totalCandidates = risk?.meta?.total ?? 0;
  const inProgress = sessionList.filter(s => s.status === 'IN_PROGRESS').length;
  const pendingReview = summaryList.filter(s => s.status === 'PENDING').length;
  const verifiedInterns = summaryList.filter(s => s.status === 'VERIFIED').length;

  const statusDist = [
    { name: 'Verified', value: summaryList.filter(s => s.status === 'VERIFIED').length, color: '#10b981' },
    { name: 'Pending', value: summaryList.filter(s => s.status === 'PENDING').length, color: '#f59e0b' },
    { name: 'Rejected', value: summaryList.filter(s => s.status === 'REJECTED').length, color: '#ef4444' },
  ];

  const barData = summaryList.map(s => ({
    name: s.full_name.split(' ')[0],
    score: parseFloat(s.total_risk_score || 0),
    status: s.status,
    fullName: s.full_name
  }));


  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-primary">
          Welcome back, <span className="text-primary-main">{admin?.fullName || 'Admin'}</span>
        </h1>
        <p className="text-secondary text-sm mt-1">Internship lifecycle & data validation command center</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Total Interns" value={totalCandidates}
          sub="Registered applicants"
          icon={Users} color="bg-blue-600"
        />
        <KPICard
          title="Pending Review" value={pendingReview}
          sub="Requires validation"
          icon={Activity} color="bg-amber-600"
        />
        <KPICard
          title="Verified Interns" value={verifiedInterns}
          sub="Onboarded successfully"
          icon={CheckCircle} color="bg-emerald-600"
        />
        <KPICard
          title="Active Sessions" value={inProgress}
          sub="Live exam proctoring"
          icon={Shield} color="bg-indigo-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Performance Wave Chart */}
        <div className="xl:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-primary flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary-main" />
              Performance Trend Analytics
            </h2>
            <div className="flex gap-4 text-[10px] uppercase tracking-tighter font-bold">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Verified</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Pending</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Rejected</span>
            </div>
          </div>
          {riskLoading ? (
            <div className="h-56 flex items-center justify-center text-muted">Loading…</div>
          ) : barData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-muted text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.bar} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={chartColors.bar} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: chartColors.text }} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: chartColors.text }} 
                  domain={[0, 100]} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-surface-elevated p-3 border border-main rounded-xl shadow-xl">
                          <p className="text-xs font-bold text-primary mb-1">{data.fullName}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted uppercase">Score:</span>
                            <span className="text-sm font-bold text-primary-main">{data.score}%</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-muted uppercase">Status:</span>
                            <span className={`text-[10px] font-bold ${
                              data.status === 'VERIFIED' ? 'text-emerald-500' :
                              data.status === 'REJECTED' ? 'text-red-500' : 'text-amber-500'
                            }`}>{data.status}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke={chartColors.bar} 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  dot={<CustomDot isDark={isDark} />}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-primary mb-5 flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary-main" />
            Validation Status
          </h2>
          {statusDist.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-muted text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusDist} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {statusDist.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: chartColors.tooltipBg, 
                    border: `1px solid ${chartColors.tooltipBorder}`, 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    color: isDark ? '#f1f5f9' : '#0f172a'
                  }} 
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: chartColors.text }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Risk Summary Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-main flex items-center justify-between">
          <h2 className="text-sm font-semibold text-primary">Intern Lifecycle Summary</h2>
          <span className="text-xs text-muted">Auto-refreshes every 30s</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-subtle">
                {['Intern', 'Email', 'Last Activity', 'Exam Score', 'Status'].map(h => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {riskLoading ? (
                <tr><td colSpan={6} className="table-cell text-center text-muted py-10">Loading data…</td></tr>
              ) : summaryList.length === 0 ? (
                <tr><td colSpan={6} className="table-cell text-center text-muted py-10">No records found</td></tr>
              ) : summaryList.map((row) => (
                <tr key={row.session_id} className="table-row">
                  <td className="table-cell font-medium text-primary">{row.full_name}</td>
                  <td className="table-cell text-secondary">{row.email}</td>
                  <td className="table-cell text-secondary font-mono text-xs">
                    {row.start_time ? format(new Date(row.start_time), 'dd MMM yy, HH:mm') : '—'}
                  </td>
                  <td className="table-cell">
                    <span className="font-bold font-mono text-primary-main">
                      {parseFloat(row.total_risk_score).toFixed(1)}
                    </span>
                  </td>
                  <td className="table-cell"><StatusChip status={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
