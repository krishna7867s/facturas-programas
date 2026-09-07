export const TAX_RATE = 0.19

export const getInvoiceTotal = (invoice) =>
  invoice.items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unitPrice), 0) * (1 + invoice.taxRate)

export const getInvoiceSubtotal = (invoice) =>
  invoice.items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unitPrice), 0)

export const getInvoiceStatus = (invoice, today = new Date()) => {
  if (invoice.paid) return 'Pagada'
  const due = new Date(`${invoice.dueDate}T23:59:59`)
  return due < today ? 'Vencida' : 'Pendiente'
}

export const formatCurrency = (value) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)

export const formatDate = (value) =>
  new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T12:00:00`))

export const getAnalytics = (invoices) => {
  const totals = invoices.map(getInvoiceTotal)
  const totalBilled = totals.reduce((sum, total) => sum + total, 0)
  const average = totals.length ? totalBilled / totals.length : 0
  const variance = totals.length ? totals.reduce((sum, total) => sum + (total - average) ** 2, 0) / totals.length : 0
  const deviation = Math.sqrt(variance)
  const statuses = invoices.reduce((result, invoice) => {
    const status = getInvoiceStatus(invoice)
    result[status] += 1
    return result
  }, { Pagada: 0, Pendiente: 0, Vencida: 0 })
  const clients = Object.entries(invoices.reduce((result, invoice) => {
    result[invoice.clientName] = (result[invoice.clientName] || 0) + getInvoiceTotal(invoice)
    return result
  }, {})).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  const byPeriod = Object.entries(invoices.reduce((result, invoice) => {
    const period = invoice.issueDate.slice(0, 7)
    result[period] = (result[period] || 0) + getInvoiceTotal(invoice)
    return result
  }, {})).sort(([a], [b]) => a.localeCompare(b)).map(([period, revenue]) => ({ period, revenue }))

  return {
    totalBilled, average, deviation, statuses, clients, byPeriod,
    outliers: invoices.filter((invoice) => getInvoiceTotal(invoice) > average + deviation * 1.5),
    projection: byPeriod.length ? byPeriod.slice(-3).reduce((sum, period) => sum + period.revenue, 0) / Math.min(byPeriod.length, 3) : 0,
  }
}
