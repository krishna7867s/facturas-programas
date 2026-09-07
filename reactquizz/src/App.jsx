import { useState } from 'react'
import Workspace from './pages/Workspace'
import BrandAside from './components/BrandAside'
import InvoiceForm from './components/InvoiceForm'
import InvoiceList from './components/InvoiceList'
import InvoiceView from './components/InvoiceView'
import Dashboard from './components/Dashboard'
import AdminLogin from './components/AdminLogin'
import './styles.css'

const seedAmounts = [180, 210, 195, 2450, 220, 175, 205, 190]
const seedClients = ['Luna Studio', 'Pixel House', 'Neko Records', 'Orbit Labs', 'Luna Studio', 'Motel 404', 'Pixel House', 'Soda Club']
const seedInvoices = seedAmounts.map((amount, index) => ({
  id: `seed-${index + 1}`, invoiceNumber: `TS-00${index + 1}`, issuer: 'TechStore S.A.', clientName: seedClients[index], clientEmail: `hello@${seedClients[index].toLowerCase().replaceAll(' ', '')}.com`, clientAddress: 'Internet Avenue 404', issueDate: `2026-0${Math.min(index + 1, 8)}-0${Math.min(index + 2, 9)}`, dueDate: index < 2 ? '2026-08-01' : index === 2 ? '2026-09-25' : `2026-0${Math.min(index + 1, 8)}-28`, paid: index >= 3, taxRate: 0.19,
  items: [{ description: ['Webcore starter pack', 'Custom pixel assets', 'Audio pack deluxe', 'Full server setup', 'Sticker bundle', 'Domain renewal', 'UI kit 2004', 'Hosting monthly'][index], quantity: 1, unitPrice: amount / 1.19 }],
}))

function App() {
  const [invoices, setInvoices] = useState(seedInvoices)
  const [selectedId, setSelectedId] = useState(seedInvoices[0].id)
  const [activeTab, setActiveTab] = useState('billing')
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const selectedInvoice = invoices.find((invoice) => invoice.id === selectedId)
  const addInvoice = (invoice) => { const created = { ...invoice, id: `invoice-${Date.now()}`, issuer: 'TechStore S.A.' }; setInvoices((current) => [created, ...current]); setSelectedId(created.id) }
  const togglePaid = (id) => setInvoices((current) => current.map((invoice) => invoice.id === id ? { ...invoice, paid: !invoice.paid } : invoice))

  const changeTab = (tab) => { if ((tab === 'dashboard' || tab === 'history') && !isAdmin) return setShowLogin(true); setActiveTab(tab) }
  const login = () => { setIsAdmin(true); setShowLogin(false); setActiveTab('dashboard') }

  return <Workspace activeTab={activeTab} onTabChange={changeTab} onAdminLogin={() => setShowLogin(true)} isAdmin={isAdmin} onLogout={() => { setIsAdmin(false); setActiveTab('billing') }}>
    {activeTab === 'dashboard' && isAdmin ? <Dashboard invoices={invoices} /> : <>
      <div className="content-intro"><div><span className="live-dot" /> CONEXIÓN SEGURA / {isAdmin ? 'ADMINISTRADOR: ADMIN' : 'EMPLEADO: MARÍA_OLIVER'}</div><div className="ascii">(づ｡◕‿‿◕｡)づ <b>WELCOME BACK</b></div></div>
      <div className="main-layout"><div className="primary-column">{activeTab === 'billing' ? <InvoiceForm onCreate={addInvoice} /> : <InvoiceList invoices={invoices} selectedId={selectedId} onSelect={setSelectedId} onTogglePaid={togglePaid} />} {activeTab === 'billing' && <InvoiceList invoices={invoices} selectedId={selectedId} onSelect={setSelectedId} onTogglePaid={togglePaid} />}</div><div className="secondary-column"><BrandAside /><InvoiceView invoice={selectedInvoice} /></div></div>
    </>}
    {showLogin && <AdminLogin onSuccess={login} onClose={() => setShowLogin(false)} />}</Workspace>
}

export default App
