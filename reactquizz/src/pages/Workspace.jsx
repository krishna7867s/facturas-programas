import { appRoutes } from '../routes/appRoutes'

export default function Workspace({ activeTab, onTabChange, onAdminLogin, isAdmin, onLogout, children }) {
  return (
    <main className="site-shell">
      <header className="site-header">
        <div className="header-topline"><span>▲ TECHSTORE.SA</span><span>STATUS: ONLINE_ <button className="admin-trigger" onClick={isAdmin ? onLogout : onAdminLogin}>{isAdmin ? '[ ADMIN / LOGOUT ]' : '[ / ]'}</button></span></div>
        <div className="brand-row">
          <div className="brand-mark">TS<span>_</span></div>
          <div className="address-bar">https://techstore.com/<b>billing</b></div>
          <div className="window-buttons" aria-hidden="true"><i>_</i><i>□</i><i>×</i></div>
        </div>
        <div className="site-title-row">
          <div><p className="kicker">EST. 2004 // INVOICE CONTROL ROOM</p><h1>TECHSTORE<span>.EXE</span></h1></div>
          <img className="nyan" src="https://media.giphy.com/media/sIIhZliB2McAo/giphy.gif" alt="Nyan Cat pixel art" />
        </div>
        <nav className="retro-tabs" aria-label="Secciones">
          {appRoutes.map((route) => <button className={activeTab === route.id ? 'active' : ''} key={route.id} onClick={() => onTabChange(route.id)}>{(route.id === 'dashboard' || route.id === 'history') && !isAdmin ? '🔒 Admin' : route.label}</button>)}
        </nav>
      </header>
      {children}
      <footer className="site-footer"><span>© TECHSTORE S.A. // MADE WITH PIXELS &lt;33</span><span>CAUTION: RADIATION AREA ☢</span><span>VISITORS: 0001337</span></footer>
    </main>
  )
}
