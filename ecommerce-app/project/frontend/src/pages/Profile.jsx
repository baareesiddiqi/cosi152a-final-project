import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import './AuthForm.css'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg(''); setErr(''); setLoading(true)
    try {
      const payload = { name, email }
      if (password) payload.password = password
      const { data } = await api.put('/users/profile', payload)
      updateUser({ name: data.name, email: data.email })
      setMsg('Profile updated!')
      setPassword('')
    } catch (err) {
      setErr(err.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page auth-page">
      <div className="container">
        <div className="auth-card card">
          <h2>My Profile</h2>
          <p className="auth-sub">Update your account information</p>
          {msg && <div className="alert alert-success">{msg}</div>}
          {err && <div className="alert alert-error">{err}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Name</label><input value={name} onChange={e => setName(e.target.value)} required /></div>
            <div className="form-group"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
            <div className="form-group">
              <label>New Password <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>(leave blank to keep current)</span></label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={6} />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
