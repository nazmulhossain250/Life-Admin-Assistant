import jsPDF from 'jspdf';
import { AnalysisResult } from '../types';

const stripMarkdown = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
    .replace(/\*(.*?)\*/g, '$1') // Italic
    .replace(/__(.*?)__/g, '$1') // Underline
    .replace(/_(.*?)_/g, '$1') // Italic
    .replace(/###\s(.*?)/g, '$1') // H3
    .replace(/##\s(.*?)/g, '$1') // H2
    .replace(/#\s(.*?)/g, '$1') // H1
    .replace(/`(.*?)`/g, '$1') // Inline code
    .replace(/```[\s\S]*?```/g, '') // Code blocks
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Links
    .replace(/^\s*\*\s/gm, '• ') // Bullet points
    .replace(/^\s*-\s/gm, '• ') // Bullet points
    .trim();
};

export const generatePDFBlob = async (result: AnalysisResult): Promise<Blob | null> => {
  if (!result) return null;
  
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    // Header / Logo Section
    pdf.setFillColor(5, 150, 105); // Emerald 600
    pdf.rect(0, 0, pageWidth, 50, 'F');
    
    // Logo Text
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Life Admin', margin + 15, 25);
    
    // Clean Sparkle Logo Shape (4-pointed star)
    pdf.setFillColor(255, 255, 255);
    const cx = margin + 5;
    const cy = 20;
    const s = 6; // size
    // Vertical component
    pdf.triangle(cx, cy - s, cx - s/2.5, cy, cx + s/2.5, cy, 'F');
    pdf.triangle(cx, cy + s, cx - s/2.5, cy, cx + s/2.5, cy, 'F');
    // Horizontal component
    pdf.triangle(cx - s, cy, cx, cy - s/2.5, cx, cy + s/2.5, 'F');
    pdf.triangle(cx + s, cy, cx, cy - s/2.5, cx, cy + s/2.5, 'F');
    // Center dot for smoothness
    pdf.circle(cx, cy, s/4, 'F');
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Your Personal Document Intelligence Assistant', margin, 35);
    
    // Official Badge
    pdf.setFillColor(255, 255, 255, 0.2);
    pdf.roundedRect(pageWidth - 55, 15, 40, 10, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('OFFICIAL REPORT', pageWidth - 50, 21.5);

    let yPos = 65;

    // 1. Document Summary
    pdf.setTextColor(16, 185, 129); // Emerald 500
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Simplified Document Summary', margin, yPos);
    yPos += 10;
    
    pdf.setTextColor(60, 60, 60);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    const cleanSummary = stripMarkdown(result.simplifiedText);
    const summaryLines = pdf.splitTextToSize(cleanSummary, contentWidth);
    pdf.text(summaryLines, margin, yPos);
    yPos += (summaryLines.length * 6) + 15;

    // 2. Medical Guidance (To-do list to get rid of disease)
    if (result.diseaseManagement) {
      if (yPos > 230) { pdf.addPage(); yPos = 25; }
      
      pdf.setTextColor(16, 185, 129);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Steps to Manage & Recover', margin, yPos);
      yPos += 10;
      
      pdf.setTextColor(40, 40, 40);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Action Plan:', margin, yPos);
      yPos += 6;
      
      pdf.setFont('helvetica', 'normal');
      const cleanMgmt = stripMarkdown(result.diseaseManagement);
      const mgmtLines = pdf.splitTextToSize(cleanMgmt, contentWidth);
      pdf.text(mgmtLines, margin, yPos);
      yPos += (mgmtLines.length * 5) + 10;
    }

    // 3. Actionable Checklist
    if (yPos > 230) { pdf.addPage(); yPos = 25; }
    pdf.setTextColor(16, 185, 129);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Actionable Next Steps', margin, yPos);
    yPos += 10;
    
    pdf.setTextColor(60, 60, 60);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    result.checklist.forEach((item, index) => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 25;
      }
      pdf.setFillColor(240, 240, 240);
      pdf.roundedRect(margin, yPos - 4, 6, 6, 1, 1, 'F');
      pdf.text(`${index + 1}. ${item}`, margin + 10, yPos);
      yPos += 8;
    });

    // 4. Main Disease (Red Segment at the end)
    const match = result.simplifiedText.match(/\*\*(.*?)\*\*/);
    const diseaseName = match ? match[1] : (result.documentType.toLowerCase().includes('medical') ? result.documentType : null);
    
    if (diseaseName) {
      if (yPos > 260) { pdf.addPage(); yPos = 25; }
      yPos += 10;
      pdf.setDrawColor(239, 68, 68); // Red 500
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 12;
      
      pdf.setTextColor(239, 68, 68); // Red 500
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`PRIMARY CONDITION: ${diseaseName.toUpperCase()}`, margin, yPos);
    }

    // Footer on all pages
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setDrawColor(230, 230, 230);
      pdf.line(margin, 285, pageWidth - margin, 285);
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Generated by Life Admin AI on ${new Date().toLocaleDateString()}`, margin, 290);
      pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 15, 290);
    }

    return pdf.output('blob');
  } catch (err) {
    console.error('PDF generation error:', err);
    throw err;
  }
};

export const generateAndDownloadPDF = async (
  result: AnalysisResult,
  setError: (error: string | null) => void,
  setPdfLoading: (loading: boolean) => void
) => {
  if (!result) return;
  setPdfLoading(true);
  
  // Small delay to allow UI to render the loading state
  setTimeout(async () => {
    try {
      const blob = await generatePDFBlob(result);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `LifeAdmin_Report_${new Date().getTime()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('PDF generation failed:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  }, 50);
};
