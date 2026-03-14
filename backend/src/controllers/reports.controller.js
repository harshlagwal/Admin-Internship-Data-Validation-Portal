const prisma = require('../lib/prisma');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const { writeAuditLog } = require('../middlewares/audit');

const downloadPdf = async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const session = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      include: { user: true, answer_evals: true }
    });

    if (!session) return res.status(404).json({ error: 'Session not found' });

    const doc = new PDFDocument({ margin: 50 });
    
    // Set headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="report_${sessionId}.pdf"`);
    
    // Stream implementation
    doc.pipe(res);

    // PDF Structure
    doc.fontSize(24).font('Helvetica-Bold').text('Intern Performance Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).font('Helvetica').text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });
    doc.moveDown();
    
    doc.fontSize(12).font('Helvetica-Bold').text('Subject Details', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').text(`Intern Name: ${session.user.full_name}`);
    doc.text(`Email: ${session.user.email}`);
    doc.text(`Department: ${session.user.department || 'N/A'}`);
    doc.text(`Current Status: ${session.status}`);
    doc.moveDown();
    
    doc.fontSize(12).font('Helvetica-Bold').text('Exam Analytics', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').text(`Performance Score: ${session.total_risk_score}%`);
    doc.moveDown();

    doc.fontSize(12).font('Helvetica-Bold').text('Detailed Evaluations', { underline: true });
    doc.moveDown(0.5);
    
    if (session.answer_evals.length === 0) {
      doc.fontSize(10).text('No detailed answer evaluations found for this session.');
    } else {
      session.answer_evals.forEach((ev, i) => {
        doc.fontSize(11).font('Helvetica-Bold').text(`Q${i + 1}: ${ev.question_id}`);
        doc.fontSize(10).font('Helvetica').text(`Response: ${ev.candidate_answer || 'No answer provided'}`);
        doc.fillColor('#2563eb').text(`AI Score: ${ev.ai_relevance_score}/10`).fillColor('black');
        doc.text(`AI Feedback: ${ev.ai_feedback || 'N/A'}`);
        doc.moveDown(1);
      });
    }

    doc.end();
    
    await writeAuditLog(req, 'DOWNLOAD_PDF', sessionId, `Downloaded PDF report for session #${sessionId}`);
  } catch (err) {
    console.error('PDF Generation Error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate PDF report' });
    }
  }
};

const downloadExcel = async (req, res) => {
  const sessionId = parseInt(req.params.id);
  const session = await prisma.interviewSession.findUnique({
    where: { id: sessionId },
    include: { user: true, answer_evals: true }
  });

  if (!session) return res.status(404).send('Session not found');

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Report');

  sheet.columns = [
    { header: 'Metric', key: 'metric', width: 20 },
    { header: 'Value', key: 'value', width: 50 },
  ];

  sheet.addRow({ metric: 'Session ID', value: session.id });
  sheet.addRow({ metric: 'Candidate', value: session.user.full_name });
  sheet.addRow({ metric: 'Email', value: session.user.email });
  sheet.addRow({ metric: 'Risk Score', value: session.total_risk_score });
  sheet.addRow({});
  sheet.addRow({ metric: 'Evaluations' });

  session.answer_evals.forEach(e => {
    sheet.addRow({ metric: 'Q: ' + e.question_id, value: e.candidate_answer });
    sheet.addRow({ metric: 'AI Score', value: e.ai_relevance_score });
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=report_${sessionId}.xlsx`);
  
  await workbook.xlsx.write(res);
  res.end();
  
  await writeAuditLog(req, 'DOWNLOAD_XLSX', sessionId, `Downloaded Excel report for session #${sessionId}`);
};

module.exports = { downloadPdf, downloadExcel };
