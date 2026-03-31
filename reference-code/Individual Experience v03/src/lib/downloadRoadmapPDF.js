import jsPDF from 'jspdf';

const BRAND_CYAN = [0, 163, 224];
const BRAND_DARK = [61, 61, 61];
const BRAND_GRAY = [112, 112, 112];
const BRAND_LIGHT = [245, 245, 245];

function addHeader(doc, userName, role, org, assessmentDate) {
  // Header bar
  doc.setFillColor(...BRAND_CYAN);
  doc.rect(0, 0, 210, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('NAHQ Accelerate', 14, 10);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Personalized Learning Roadmap', 14, 16);

  // Generated date (top right)
  doc.setFontSize(7);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, 196, 10, { align: 'right' });

  // User info block
  doc.setTextColor(...BRAND_DARK);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(userName, 14, 33);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...BRAND_GRAY);
  const subtitle = [role, org, assessmentDate ? `Assessment: ${assessmentDate}` : null].filter(Boolean).join('  ·  ');
  doc.text(subtitle, 14, 39);

  // Divider
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(14, 43, 196, 43);

  return 50; // return next Y position
}

function addSectionTitle(doc, title, y) {
  doc.setFillColor(...BRAND_LIGHT);
  doc.roundedRect(14, y, 182, 8, 1.5, 1.5, 'F');
  doc.setTextColor(...BRAND_CYAN);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), 18, y + 5.5);
  return y + 13;
}

function addKPIRow(doc, kpis, y) {
  const boxW = 182 / kpis.length - 2;
  kpis.forEach(({ label, value, sub }, i) => {
    const x = 14 + i * (boxW + 2.7);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, boxW, 18, 1.5, 1.5, 'S');

    doc.setTextColor(...BRAND_CYAN);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(String(value), x + boxW / 2, y + 9, { align: 'center' });

    doc.setTextColor(...BRAND_DARK);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(label, x + boxW / 2, y + 14, { align: 'center' });

    if (sub) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...BRAND_GRAY);
      doc.setFontSize(6);
      doc.text(sub, x + boxW / 2, y + 17.5, { align: 'center' });
    }
  });
  return y + 24;
}

function addCourseRow(doc, course, y, accentColor) {
  const rowH = 14;
  if (y + rowH > 280) return null; // signal page overflow

  // Status dot
  doc.setFillColor(...accentColor);
  doc.circle(17, y + rowH / 2 - 0.5, 1.5, 'F');

  // Title
  doc.setTextColor(...BRAND_DARK);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(course.title, 110);
  doc.text(titleLines[0], 22, y + 5);

  // Competency
  if (course.competencyName) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...BRAND_GRAY);
    doc.setFontSize(6.5);
    doc.text(course.competencyName, 22, y + 10);
  }

  // Format badge area
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...BRAND_GRAY);
  doc.text(course.format || '', 148, y + 5);

  // Hours
  doc.text(`${course.hours}h`, 175, y + 5);

  // Status
  const statusMap = { complete: 'Completed', in_progress: 'In Progress', not_started: 'Not Started' };
  doc.text(statusMap[course.status] || 'Not Started', 188, y + 5);

  // Divider
  doc.setDrawColor(235, 235, 235);
  doc.setLineWidth(0.2);
  doc.line(14, y + rowH - 1, 196, y + rowH - 1);

  return y + rowH;
}

export async function downloadRoadmapPDF({ userName, role, org, assessmentDate, kpis, sections }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = addHeader(doc, userName, role, org, assessmentDate);

  // KPIs
  y = addSectionTitle(doc, 'Performance Summary', y);
  y = addKPIRow(doc, kpis, y);
  y += 2;

  // Course sections
  for (const section of sections) {
    if (section.courses.length === 0) continue;

    // Check space; add page if needed
    if (y + 20 > 280) {
      doc.addPage();
      y = 14;
    }

    y = addSectionTitle(doc, `${section.label} (${section.courses.length})`, y);

    // Table header
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BRAND_GRAY);
    doc.text('Course', 22, y);
    doc.text('Format', 148, y);
    doc.text('Hours', 175, y);
    doc.text('Status', 188, y);
    y += 4;

    for (const course of section.courses) {
      if (y + 15 > 280) {
        doc.addPage();
        y = 14;
      }
      const nextY = addCourseRow(doc, course, y, section.accentRgb);
      if (nextY === null) { doc.addPage(); y = 14; } else { y = nextY; }
    }
    y += 4;
  }

  // Footer on each page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(14, 288, 196, 288);
    doc.setFontSize(6.5);
    doc.setTextColor(...BRAND_GRAY);
    doc.setFont('helvetica', 'normal');
    doc.text('NAHQ Accelerate · Personalized Learning Roadmap · Confidential', 14, 292);
    doc.text(`Page ${i} of ${totalPages}`, 196, 292, { align: 'right' });
  }

  const filename = `NAHQ_Roadmap_${userName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}