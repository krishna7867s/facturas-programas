import { useState } from 'react'
import { TAX_RATE } from '../services/invoiceUtils'

const blankItem = () => ({ description: '', quantity: 1, unitPrice: '' })
const initialForm = () => ({ clientName: '', clientEmail: '', clientAddress: '', invoiceNumber: `TS-${String(Date.now()).slice(-5)}`, issueDate: new Date().toISOString().slice(0, 10), dueDate: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10), items: [blankItem()] })

export default function InvoiceForm({ onCreate }) {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const updateItem = (index, field, value) => setForm((current) => ({ ...current, items: current.items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item) }))
  const submit = (event) => {
    event.preventDefault()
    if (!form.clientName || !form.clientEmail || !form.invoiceNumber || !form.issueDate || !form.dueDate || form.items.some((item) => !item.description || Number(item.quantity) <= 0 || Number(item.unitPrice) < 0 || item.unitPrice === '')) return setError('FALTAN DATOS // REVISA LOS CAMPOS ROJOS')
    setError('')
    onCreate({ ...form, taxRate: TAX_RATE, items: form.items.map((item) => ({ ...item, quantity: Number(item.quantity), unitPrice: Number(item.unitPrice) })) })
    setForm((current) => ({ ...current, clientName: '', clientEmail: '', clientAddress: '', invoiceNumber: `TS-${String(Date.now()).slice(-5)}`, items: [blankItem()] }))
  }
  return <form className="invoice-form" onSubmit={submit}>
    <div className="section-heading"><span className="sticker">NEW!</span><div><p className="kicker">EMPLOYEE CONSOLE / 01</p><h2>CREAR FACTURA</h2></div></div>
    <div className="form-grid"><label>EMISOR<input value="TechStore S.A." readOnly /></label><label>Nº FACTURA<input value={form.invoiceNumber} onChange={(e) => update('invoiceNumber', e.target.value)} /></label><label>CLIENTE<input placeholder="Nombre completo" value={form.clientName} onChange={(e) => update('clientName', e.target.value)} /></label><label>EMAIL<input type="email" placeholder="cliente@correo.com" value={form.clientEmail} onChange={(e) => update('clientEmail', e.target.value)} /></label><label className="wide">DIRECCIÓN<input placeholder="Calle, número, ciudad" value={form.clientAddress} onChange={(e) => update('clientAddress', e.target.value)} /></label><label>EMISIÓN<input type="date" value={form.issueDate} onChange={(e) => update('issueDate', e.target.value)} /></label><label>VENCIMIENTO<input type="date" value={form.dueDate} onChange={(e) => update('dueDate', e.target.value)} /></label></div>
    <div className="items-head"><h3>ÍTEMS <span>// INVENTARIO</span></h3><button type="button" className="text-button" onClick={() => update('items', [...form.items, blankItem()])}>+ AGREGAR FILA</button></div>
    <div className="item-list">{form.items.map((item, index) => <div className="item-row" key={index}><input placeholder="Descripción del producto" value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} /><input type="number" min="1" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} /><input type="number" min="0" step="0.01" placeholder="Precio" value={item.unitPrice} onChange={(e) => updateItem(index, 'unitPrice', e.target.value)} /><button type="button" className="icon-button danger" aria-label="Eliminar fila" onClick={() => update('items', form.items.filter((_, itemIndex) => index !== itemIndex))}>×</button></div>)}</div>
    {error && <p className="form-error">⚠ {error}</p>}<button className="primary-button" type="submit">GENERAR FACTURA <span>→</span></button>
  </form>
}
