import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// PDF Export Utility for ROI Dashboard - Single Page Layout
export const exportToPDF = async (elementId, filename = 'ROI-Dashboard-Report.pdf') => {
  try {
    // Show loading state
    const exportButton = document.querySelector('[data-export-pdf]');
    if (exportButton) {
      exportButton.disabled = true;
      exportButton.textContent = 'Generating PDF...';
    }

    // Get the dashboard element
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Dashboard element not found');
    }

    // Create canvas from the element with higher scale for better quality
    const canvas = await html2canvas(element, {
      scale: 1.5, // Balanced quality and performance
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    // Calculate PDF dimensions for single page
    const pdfWidth = 297; // A4 width in mm (landscape)
    const pdfHeight = 210; // A4 height in mm (landscape)
    
    // Calculate image dimensions to fit the page
    const imgWidth = pdfWidth - 20; // Leave 10mm margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // If image is too tall, scale it down to fit
    const maxHeight = pdfHeight - 40; // Leave space for header and footer
    const finalImgHeight = imgHeight > maxHeight ? maxHeight : imgHeight;
    const finalImgWidth = (canvas.width * finalImgHeight) / canvas.height;

    // Create PDF in landscape mode
    const pdf = new jsPDF('l', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');

    // Add header
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Returns Intelligence ROI Dashboard', 20, 15);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 22);
    pdf.text(`Time Period: Last 30 Days`, 20, 28);

    // Add the dashboard image centered on the page
    const xPosition = (pdfWidth - finalImgWidth) / 2;
    const yPosition = 35; // Start below header
    pdf.addImage(imgData, 'PNG', xPosition, yPosition, finalImgWidth, finalImgHeight);

    // Add footer
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Returns Intelligence ROI Dashboard', 20, pdfHeight - 10);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, pdfWidth - 80, pdfHeight - 10);

    // Save the PDF
    pdf.save(filename);

    // Reset button state
    if (exportButton) {
      exportButton.disabled = false;
      exportButton.textContent = 'Export PDF';
    }

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    // Reset button state
    const exportButton = document.querySelector('[data-export-pdf]');
    if (exportButton) {
      exportButton.disabled = false;
      exportButton.textContent = 'Export PDF';
    }
    
    alert('Error generating PDF. Please try again.');
    return false;
  }
};

// Export specific sections to PDF - Single Page Layout
export const exportSectionToPDF = async (elementId, sectionName, filename) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Section element not found');
    }

    const canvas = await html2canvas(element, {
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });

    // Use landscape mode for better section display
    const pdfWidth = 297; // A4 width in mm (landscape)
    const pdfHeight = 210; // A4 height in mm (landscape)
    
    const imgWidth = pdfWidth - 20; // Leave margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Scale down if too tall
    const maxHeight = pdfHeight - 50;
    const finalImgHeight = imgHeight > maxHeight ? maxHeight : imgHeight;
    const finalImgWidth = (canvas.width * finalImgHeight) / canvas.height;

    const pdf = new jsPDF('l', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');

    // Add title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(sectionName, 20, 15);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 22);

    // Add content centered
    const xPosition = (pdfWidth - finalImgWidth) / 2;
    const yPosition = 30;
    pdf.addImage(imgData, 'PNG', xPosition, yPosition, finalImgWidth, finalImgHeight);

    // Add footer
    pdf.setFontSize(8);
    pdf.text('Returns Intelligence ROI Dashboard', 20, pdfHeight - 10);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, pdfWidth - 80, pdfHeight - 10);

    pdf.save(filename || `${sectionName.replace(/\s+/g, '-')}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating section PDF:', error);
    alert('Error generating PDF. Please try again.');
    return false;
  }
};
