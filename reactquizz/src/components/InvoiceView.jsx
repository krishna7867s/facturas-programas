import { formatCurrency, formatDate, getInvoiceSubtotal, getInvoiceTotal } from '../services/invoiceUtils'

export default function InvoiceView({ invoice }) {
  if (!invoice) return <section className="invoice-preview panel empty-preview"><span>◈</span><p>SELECCIONA UNA FACTURA<br />PARA VER EL DETALLE</p></section>

  const subtotal = getInvoiceSubtotal(invoice)
  const handleDownloadPdf = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  return <section className="invoice-preview panel"><div className="invoice-actions"><button type="button" className="download-pdf-button" onClick={handleDownloadPdf}>DESCARGAR PDF</button></div><div className="paper"><div className="paper-head"><div><p className="paper-label">INVOICE // ORIGINAL</p><h2>TECHSTORE<span>.SA</span></h2></div><div className="invoice-stamp">{invoice.invoiceNumber}<br /><small>{formatDate(invoice.issueDate)}</small></div></div><div className="paper-meta"><div><small>FACTURADO A</small><strong>{invoice.clientName}</strong><span>{invoice.clientEmail}</span><span>{invoice.clientAddress || 'Dirección no registrada'}</span></div><div><small>VENCE</small><strong>{formatDate(invoice.dueDate)}</strong></div></div><table><thead><tr><th>DESCRIPCIÓN</th><th>QTY</th><th>PRECIO</th><th>IMPORTE</th></tr></thead><tbody>{invoice.items.map((item, index) => <tr key={`${invoice.id}-${index}`}><td>{item.description}</td><td>{item.quantity}</td><td>{formatCurrency(item.unitPrice)}</td><td>{formatCurrency(item.quantity * item.unitPrice)}</td></tr>)}</tbody></table><div className="totals"><span>SUBTOTAL <b>{formatCurrency(subtotal)}</b></span><span>IVA ({invoice.taxRate * 100}%) <b>{formatCurrency(subtotal * invoice.taxRate)}</b></span><strong>TOTAL <b>{formatCurrency(getInvoiceTotal(invoice))}</b></strong></div><div className="paper-foot">THANK YOU FOR SHOPPING WITH US &lt;33 <span>╰(°▽°)╯</span></div></div></section>
}
