import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [grievances, setGrievances] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', category: 'Academic' });
  const [searchTerm, setSearchTerm] = useState('');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', category: '', status: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const student = JSON.parse(localStorage.getItem('student'));
  const token = localStorage.getItem('token');

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/grievances', authHeader);
      setGrievances(res.data);
    } catch (err) {
      setError('Failed to fetch grievances');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/grievances', form, authHeader);
      setSuccess('Grievance submitted successfully!');
      setForm({ title: '', description: '', category: 'Academic' });
      fetchGrievances();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this grievance?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/grievances/${id}`, authHeader);
      setSuccess('Grievance deleted successfully!');
      fetchGrievances();
    } catch (err) {
      setError('Failed to delete grievance');
    }
  };

  const handleEditSave = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/grievances/${id}`, editForm, authHeader);
      setSuccess('Grievance updated successfully!');
      setEditId(null);
      fetchGrievances();
    } catch (err) {
      setError('Failed to update grievance');
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) { fetchGrievances(); return; }
    try {
      const res = await axios.get(
        `http://localhost:5000/api/grievances/search?title=${searchTerm}`,
        authHeader
      );
      setGrievances(res.data);
    } catch (err) {
      setError('Search failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('student');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>🎓 SGMS Portal</h1>
        <div style={styles.navRight}>
          <span style={styles.welcomeText}>👤 {student?.name}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        {/* Alerts */}
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.successMsg}>{success}</div>}

        {/* Submit Grievance Form */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📝 Submit New Grievance</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Title</label>
                <input
                  type="text"
                  placeholder="Grievance title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  style={styles.input}
                >
                  <option>Academic</option>
                  <option>Hostel</option>
                  <option>Transport</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                placeholder="Describe your grievance in detail..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                style={{ ...styles.input, height: '100px', resize: 'vertical' }}
              />
            </div>
            <button type="submit" style={styles.submitBtn}>Submit Grievance</button>
          </form>
        </div>

        {/* Search */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🔍 Search Grievances</h2>
          <div style={styles.searchRow}>
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ ...styles.input, flex: 1 }}
            />
            <button onClick={handleSearch} style={styles.searchBtn}>Search</button>
            <button onClick={() => { setSearchTerm(''); fetchGrievances(); }} style={styles.clearBtn}>Clear</button>
          </div>
        </div>

        {/* Grievances List */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📋 My Grievances ({grievances.length})</h2>
          {grievances.length === 0 ? (
            <p style={styles.noData}>No grievances found. Submit one above!</p>
          ) : (
            grievances.map((g) => (
              <div key={g._id} style={styles.grievanceCard}>
                {editId === g._id ? (
                  // Edit Mode
                  <div style={styles.editForm}>
                    <input
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      style={styles.input}
                      placeholder="Title"
                    />
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      style={{ ...styles.input, height: '80px' }}
                      placeholder="Description"
                    />
                    <div style={styles.formRow}>
                      <select
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        style={styles.input}
                      >
                        <option>Academic</option>
                        <option>Hostel</option>
                        <option>Transport</option>
                        <option>Other</option>
                      </select>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        style={styles.input}
                      >
                        <option>Pending</option>
                        <option>Resolved</option>
                      </select>
                    </div>
                    <div style={styles.actionRow}>
                      <button onClick={() => handleEditSave(g._id)} style={styles.saveBtn}>Save</button>
                      <button onClick={() => setEditId(null)} style={styles.cancelBtn}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div style={styles.grievanceHeader}>
                      <h3 style={styles.grievanceTitle}>{g.title}</h3>
                      <span style={{
                        ...styles.statusBadge,
                        background: g.status === 'Resolved' ? 'rgba(0,200,100,0.2)' : 'rgba(255,165,0,0.2)',
                        color: g.status === 'Resolved' ? '#00c864' : '#ffa500',
                        border: `1px solid ${g.status === 'Resolved' ? '#00c864' : '#ffa500'}`,
                      }}>
                        {g.status}
                      </span>
                    </div>
                    <p style={styles.grievanceDesc}>{g.description}</p>
                    <div style={styles.grievanceMeta}>
                      <span style={styles.categoryBadge}>{g.category}</span>
                      <span style={styles.dateText}>
                        {new Date(g.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={styles.actionRow}>
                      <button
                        onClick={() => { setEditId(g._id); setEditForm({ title: g.title, description: g.description, category: g.category, status: g.status }); }}
                        style={styles.editBtn}
                      >
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDelete(g._id)} style={styles.deleteBtn}>
                        🗑️ Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#0a0a0a', color: '#e0e0e0' },
  navbar: {
    background: 'rgba(255,255,255,0.05)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(10px)',
  },
  navTitle: { color: '#00d4ff', fontSize: '22px', fontWeight: '700' },
  navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  welcomeText: { color: '#aaa', fontSize: '14px' },
  logoutBtn: {
    background: 'rgba(255,59,59,0.15)',
    border: '1px solid rgba(255,59,59,0.3)',
    color: '#ff6b6b',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  },
  content: { maxWidth: '900px', margin: '0 auto', padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: '24px' },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '28px',
  },
  cardTitle: { color: '#00d4ff', fontSize: '18px', fontWeight: '600', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  formRow: { display: 'flex', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 },
  label: { color: '#aaa', fontSize: '13px' },
  input: {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
  },
  submitBtn: {
    background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    alignSelf: 'flex-start',
    minWidth: '160px',
  },
  searchRow: { display: 'flex', gap: '12px', alignItems: 'center' },
  searchBtn: {
    background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  clearBtn: {
    background: 'rgba(255,255,255,0.08)',
    color: '#aaa',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  noData: { color: '#555', textAlign: 'center', padding: '40px 0' },
  grievanceCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
  },
  grievanceHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  grievanceTitle: { color: '#fff', fontSize: '16px', fontWeight: '600' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
  grievanceDesc: { color: '#888', fontSize: '14px', lineHeight: '1.6', marginBottom: '12px' },
  grievanceMeta: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px' },
  categoryBadge: {
    background: 'rgba(0,212,255,0.1)',
    color: '#00d4ff',
    border: '1px solid rgba(0,212,255,0.3)',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
  },
  dateText: { color: '#555', fontSize: '12px' },
  actionRow: { display: 'flex', gap: '10px' },
  editBtn: {
    background: 'rgba(0,212,255,0.1)',
    color: '#00d4ff',
    border: '1px solid rgba(0,212,255,0.3)',
    borderRadius: '8px',
    padding: '7px 16px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  deleteBtn: {
    background: 'rgba(255,59,59,0.1)',
    color: '#ff6b6b',
    border: '1px solid rgba(255,59,59,0.3)',
    borderRadius: '8px',
    padding: '7px 16px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  editForm: { display: 'flex', flexDirection: 'column', gap: '12px' },
  saveBtn: {
    background: 'rgba(0,200,100,0.15)',
    color: '#00c864',
    border: '1px solid rgba(0,200,100,0.3)',
    borderRadius: '8px',
    padding: '7px 16px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  cancelBtn: {
    background: 'rgba(255,255,255,0.05)',
    color: '#aaa',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '7px 16px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  error: {
    background: 'rgba(255,59,59,0.15)',
    border: '1px solid rgba(255,59,59,0.3)',
    color: '#ff6b6b',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
  },
  successMsg: {
    background: 'rgba(0,200,100,0.15)',
    border: '1px solid rgba(0,200,100,0.3)',
    color: '#00c864',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
  },
};

export default Dashboard;