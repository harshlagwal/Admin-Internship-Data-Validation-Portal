import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { getCandidate, getSessions, downloadReport, updateCandidateStatus } from '../api/endpoints';
import { ArrowLeft, Clock, Download, Activity, FileText, CheckCircle, XCircle, UserCheck, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

function Section({ title, icon: Icon, children }) {
  return (
    <div className="card overflow-hidden h-full">
      <div className="px-5 py-4 border-b border-main flex items-center gap-2 bg-surface-subtle">
        <Icon className="w-4 h-4 text-primary-main" />
        <h3 className="text-sm font-semibold text-primary">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function StatusChip({ status }) {
  const map = {
    PENDING: 'badge-pending',
    VERIFIED: 'badge-active',
    REJECTED: 'badge-flagged',
  };
  return <span className={map[status] || 'badge-pending'}>{status ?? 'PENDING'}</span>;
}

export default function CandidateDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [downloading, setDownloading] = useState(false);

  const { data: candidate, isLoading: candidateLoading } = useQuery({
    queryKey: ['candidate', id],
    queryFn: () => getCandidate(id).then(r => r.data.data),
  });

  const { data: sessionsData } = useQuery({
    queryKey: ['candidate-sessions', id],
    queryFn: () => getSessions({ userId: id }).then(r => r.data),
  });

  const sessions = sessionsData?.data ?? [];

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus) => updateCandidateStatus(id, newStatus),
    onSuccess: (_, status) => {
      queryClient.invalidateQueries(['candidate', id]);
      queryClient.invalidateQueries(['risk-summary']);
      queryClient.invalidateQueries(['sessions-dash']);
      queryClient.invalidateQueries(['candidate-sessions', id]);
      toast.success(`Candidate status updated to ${status}`);
    },
    onError: () => toast.error('Failed to update status'),
  });

  const getProficiencyScore = () => {
    if (!sessions.length) return 0;
    const latest = sessions[0];
    return parseFloat(latest.total_risk_score).toFixed(1);
  };

  const score = getProficiencyScore();

  const handleUpdateStatus = (newStatus) => {
    const action = newStatus === 'VERIFIED' ? 'Accept' : 'Reject';
    if (window.confirm(`Are you sure you want to ${action} this intern?`)) {
      updateStatusMutation.mutate(newStatus);
    }
  };

  const handleDownload = async (fmt) => {
    const sessionId = sessions.length ? sessions[0].id : 'mock';
    setDownloading(true);
    try {
      const res = await downloadReport(sessionId, fmt);
      // res.data is expected to be the Blob
      const blob = res.data instanceof Blob ? res.data : new Blob([res.data]);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report_candidate_${id}.${fmt}`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`${fmt.toUpperCase()} report downloaded.`);
    } catch {
      toast.error('Download failed. Try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (candidateLoading) return <div className="p-10 text-center text-muted">Loading intern details...</div>;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <button onClick={() => navigate(-1)} className="btn-secondary shrink-0 p-2 h-10 w-10 flex items-center justify-center">
          <ArrowLeft className="w-4 h-4" />
        </button>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-primary">{candidate?.full_name}</h1>
            <StatusChip status={candidate?.status} />
          </div>
          <p className="text-secondary text-sm">
            {candidate?.email} · @{candidate?.username} · Dept: <span className="text-primary font-medium">{candidate?.department || 'General'}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {candidate?.status === 'PENDING' && (
            <>
              <button 
                id="btn-accept"
                onClick={() => handleUpdateStatus('VERIFIED')}
                className="btn-success"
              >
                <CheckCircle className="w-4 h-4" /> Accept Intern
              </button>
              <button 
                id="btn-reject"
                onClick={() => handleUpdateStatus('REJECTED')}
                className="btn-danger"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
            </>
          )}
          <button id="btn-download-pdf" onClick={() => handleDownload('pdf')} disabled={downloading} className="btn-secondary">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Section title="Profile Information" icon={UserCheck}>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted uppercase tracking-widest mb-1">Role</p>
                <p className="text-sm font-medium text-primary">Internship Applicant</p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-widest mb-1">Member Since</p>
                <p className="text-sm font-medium text-primary">
                  {candidate?.created_at ? format(new Date(candidate?.created_at), 'dd MMM yyyy') : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-widest mb-1">Parent ID</p>
                <p className="text-sm font-mono text-primary-main font-bold">PID-00{id}</p>
              </div>
            </div>
          </Section>

          <Section title="Validation History" icon={Activity}>
             <div className="space-y-3">
               {sessions.length === 0 ? (
                 <p className="text-xs text-muted">No session history available.</p>
               ) : (
                 sessions.map(s => (
                  <div key={s.id} className="flex items-center gap-3 p-2 bg-surface-subtle border border-main rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-secondary" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-primary truncate">Exam Session #{s.id}</p>
                      <p className="text-[10px] text-secondary">{format(new Date(s.start_time), 'dd MMM HH:mm')}</p>
                    </div>
                    <span className="text-[10px] font-bold text-primary-main">{parseFloat(s.total_risk_score).toFixed(0)}% Score</span>
                  </div>
                 ))
               )}
             </div>
          </Section>
        </div>

        {/* Exam Results / Report Analysis */}
        <div className="lg:col-span-2 space-y-6">
          <Section title="Performance Analysis (Exam Report)" icon={FileText}>
             <div className="bg-surface border border-main rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center bg-surface shrink-0 ${
                    score >= 80 ? 'border-emerald-500/30 text-emerald-600' : 
                    score >= 60 ? 'border-amber-500/30 text-amber-600' : 
                    'border-red-500/30 text-red-600'
                  }`}>
                    <span className="text-sm font-bold">{score}%</span>
                  </div>
                 <div>
                   <h4 className="font-semibold text-primary">General Proficiency Score</h4>
                   <p className="text-sm text-secondary">Based on recent exam evaluations</p>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                 <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-2">Strengths</p>
                    <ul className="text-xs text-secondary space-y-1">
                      <li>• Logical reasoning & clarity</li>
                      <li>• Accurate domain knowledge</li>
                    </ul>
                 </div>
                 <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase mb-2">Areas for Improvement</p>
                    <ul className="text-xs text-secondary space-y-1">
                      <li>• Communication speed</li>
                      <li>• Advanced optimization concepts</li>
                    </ul>
                 </div>
               </div>

               <div className="space-y-3">
                 <p className="text-sm font-medium text-primary">Detailed AI Evaluations</p>
                 <div className="bg-surface-subtle p-4 rounded-xl border border-main">
                   <p className="text-[10px] text-muted mb-2 font-mono">QUESTION_ID: DSA_01</p>
                   <p className="text-sm text-secondary leading-relaxed mb-3">
                     The candidate explained the time complexity of a binary search tree accurately, but missed edge cases regarding self-balancing trees.
                   </p>
                   <div className="flex items-center gap-2">
                     <AlertCircle className="w-3.5 h-3.5 text-primary-main" />
                     <p className="text-xs text-primary-main font-semibold">AI Feedback: Strong foundational knowledge.</p>
                   </div>
                 </div>
               </div>
             </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
