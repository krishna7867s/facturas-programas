import { useState } from 'react'

const ADMIN_USER = 'admin'
const ADMIN_PASSWORD = 'webcore2004'

export default function AdminLogin({ onSuccess, onClose }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const submit = (event) => {
    event.preventDefault()
    if (username.trim().toLowerCase() === ADMIN_USER && password === ADMIN_PASSWORD) return onSuccess()
    setError('ACCESO DENEGADO // CREDENCIALES INCORRECTAS')
  }
  return <div className="login-backdrop" role="dialog" aria-modal="true" aria-labelledby="admin-login-title"><form className="login-modal" onSubmit={submit}><button type="button" className="login-close" onClick={onClose} aria-label="Cerrar">×</button><p className="kicker">RESTRICTED AREA // 00:00:13</p><h2 id="admin-login-title">ADMIN LOGIN<span>_</span></h2><p className="login-copy">solo personal autorizado<br />╰(ಠ_ಠ)╯</p><label>USERNAME<input autoFocus value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" /></label><label>PASSWORD<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label>{error && <p className="form-error">⚠ {error}</p>}<button className="primary-button" type="submit">UNLOCK DASHBOARD →</button><small className="login-hint">demo: admin / webcore2004</small></form></div>
}
