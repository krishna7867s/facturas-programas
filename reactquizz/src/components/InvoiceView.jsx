import { jsPDF } from 'jspdf'
import { formatCurrency, formatDate, getInvoiceSubtotal, getInvoiceTotal } from '../services/invoiceUtils'

export default function InvoiceView({ invoice }) {
  if (!invoice) return <section className="invoice-preview panel empty-preview"><span>◈</span><p>SELECCIONA UNA FACTURA<br />PARA VER EL DETALLE</p></section>

  const subtotal = getInvoiceSubtotal(invoice)
  const handleDownloadPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 42

    doc.setFillColor(10, 16, 10)
    doc.rect(0, 0, pageWidth, 68, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    doc.text('TECHSTORE.SA', margin, 38)
    doc.setFontSize(10)
    doc.text('FACTURA ORIGINAL', margin, 56)

    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text(`Factura: ${invoice.invoiceNumber}`, margin, 96)
    doc.text(`Emisión: ${formatDate(invoice.issueDate)}`, margin, 112)
    doc.text(`Vencimiento: ${formatDate(invoice.dueDate)}`, margin, 128)

    doc.text(`Cliente: ${invoice.clientName}`, 340, 96)
    doc.text(`Email: ${invoice.clientEmail}`, 340, 112)
    const addressLines = doc.splitTextToSize(invoice.clientAddress || 'Dirección no registrada', 180)
    doc.text(addressLines, 340, 128)

    const tableTop = 170
    const columns = [40, 200, 310, 390, 470]
    const rows = invoice.items.map((item) => [item.description, String(item.quantity), formatCurrency(item.unitPrice), formatCurrency(item.quantity * item.unitPrice)])

    doc.setDrawColor(80, 80, 80)
    doc.setFillColor(240, 240, 240)
    doc.rect(margin, tableTop, pageWidth - margin * 2, 22, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text('DESCRIPCIÓN', columns[0], tableTop + 14)
    doc.text('CANT.', columns[1], tableTop + 14)
    doc.text('P.UNIT', columns[2], tableTop + 14)
    doc.text('IMPORTE', columns[3], tableTop + 14)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    rows.forEach((row, index) => {
      const y = tableTop + 30 + index * 22
      doc.text(row[0], columns[0], y)
      doc.text(row[1], columns[1], y)
      doc.text(row[2], columns[2], y)
      doc.text(row[3], columns[3], y)
      doc.line(margin, y + 5, pageWidth - margin, y + 5)
    })

    const totalY = tableTop + 30 + rows.length * 22 + 20
    doc.setFont('helvetica', 'bold')
    doc.text('SUBTOTAL', 360, totalY)
    doc.text(formatCurrency(subtotal), 470, totalY, { align: 'right' })
    doc.text('IVA', 360, totalY + 18)
    doc.text(formatCurrency(subtotal * invoice.taxRate), 470, totalY + 18, { align: 'right' })
    doc.text('TOTAL', 360, totalY + 36)
    doc.text(formatCurrency(getInvoiceTotal(invoice)), 470, totalY + 36, { align: 'right' })

    doc.setFont('helvetica', 'italic')
    doc.setFontSize(10)
    doc.text('Gracias por tu compra con TechStore', margin, 760)

    doc.save(`${invoice.invoiceNumber || 'factura'}-download.pdf`)
  }

  return <section className="invoice-preview panel"><div className="invoice-actions"><button type="button" className="download-pdf-button" onClick={handleDownloadPdf}>DESCARGAR PDF</button></div><div className="paper"><div className="paper-head"><div><p className="paper-label">INVOICE // ORIGINAL</p><h2>TECHSTORE<span>.SA</span></h2></div><div className="invoice-stamp">{invoice.invoiceNumber}<br /><small>{formatDate(invoice.issueDate)}</small></div></div><div className="paper-meta"><div><small>FACTURADO A</small><strong>{invoice.clientName}</strong><span>{invoice.clientEmail}</span><span>{invoice.clientAddress || 'Dirección no registrada'}</span></div><div><small>VENCE</small><strong>{formatDate(invoice.dueDate)}</strong></div></div><table><thead><tr><th>DESCRIPCIÓN</th><th>QTY</th><th>PRECIO</th><th>IMPORTE</th></tr></thead><tbody>{invoice.items.map((item, index) => <tr key={`${invoice.id}-${index}`}><td>{item.description}</td><td>{item.quantity}</td><td>{formatCurrency(item.unitPrice)}</td><td>{formatCurrency(item.quantity * item.unitPrice)}</td></tr>)}</tbody></table><div className="totals"><span>SUBTOTAL <b>{formatCurrency(subtotal)}</b></span><span>IVA ({invoice.taxRate * 100}%) <b>{formatCurrency(subtotal * invoice.taxRate)}</b></span><strong>TOTAL <b>{formatCurrency(getInvoiceTotal(invoice))}</b></strong></div><div className="paper-foot">THANK YOU FOR SHOPPING WITH US &lt;33 <span>╰(°▽°)╯</span></div></div></section>
}
