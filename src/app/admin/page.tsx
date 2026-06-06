"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getFirestoreClient } from '@/lib/firebase-client';
import {
  collection, getDocs, doc, setDoc, deleteDoc, query, orderBy
} from 'firebase/firestore';
import type { Booking, BlockedDate } from '@/types/booking';

/* ═══════════════════════════════════════════════════════════════════
 * Admin Dashboard — /admin
 * ─────────────────────────────────────────────────────────────────
 * Features:
 *   • Password-based login (simple token check)
 *   • Bookings table with search & filter
 *   • Revenue analytics
 *   • CSV export
 *   • Block dates & slots
 * ═══════════════════════════════════════════════════════════════════ */

const AdminDashboard = () => {
  /* ─── Auth ──────────────────────────────────────────────────── */
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  /* ─── Data ──────────────────────────────────────────────────── */
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockedDatesList, setBlockedDatesList] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(false);

  /* ─── Filters ──────────────────────────────────────────────── */
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'bookings' | 'analytics' | 'blocked'>('bookings');

  /* ─── Block date form ──────────────────────────────────────── */
  const [blockDate, setBlockDate] = useState('');
  const [blockReason, setBlockReason] = useState('');

  /* ─── Login handler ─────────────────────────────────────────── */
  const handleLogin = async () => {
    setAuthError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_token', data.token);
      } else {
        setAuthError('Invalid password.');
      }
    } catch {
      setAuthError('Login failed. Please try again.');
    }
  };

  /* ─── Check existing session ────────────────────────────────── */
  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  /* ─── Load data when authenticated ─────────────────────────── */
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const db = getFirestoreClient();
      if (!db) return;

      // Load bookings
      const bookingsQuery = query(collection(db, 'bookings'), orderBy('consultationDate', 'desc'));
      const bookingsSnap = await getDocs(bookingsQuery);
      const bookingsList: Booking[] = [];
      bookingsSnap.forEach((d) => {
        bookingsList.push(d.data() as Booking);
      });
      setBookings(bookingsList);

      // Load blocked dates
      const blockedSnap = await getDocs(collection(db, 'blockedDates'));
      const blocked: BlockedDate[] = [];
      blockedSnap.forEach((d) => {
        blocked.push(d.data() as BlockedDate);
      });
      setBlockedDatesList(blocked.sort((a, b) => a.date.localeCompare(b.date)));
    } catch (err) {
      console.error('[admin] Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  /* ─── Filtered bookings ─────────────────────────────────────── */
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        !searchTerm ||
        b.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.phone.includes(searchTerm);

      const matchesStatus = statusFilter === 'all' || b.bookingStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  /* ─── Analytics ─────────────────────────────────────────────── */
  const analytics = useMemo(() => {
    const confirmed = bookings.filter((b) => b.bookingStatus === 'confirmed');
    const totalRevenue = confirmed.reduce((sum, b) => sum + (b.amount || 0), 0);
    const thisMonth = confirmed.filter((b) => {
      const bookingMonth = b.consultationDate.substring(0, 7);
      const currentMonth = new Date().toISOString().substring(0, 7);
      return bookingMonth === currentMonth;
    });
    const monthlyRevenue = thisMonth.reduce((sum, b) => sum + (b.amount || 0), 0);

    return {
      totalBookings: bookings.length,
      confirmedBookings: confirmed.length,
      totalRevenue,
      monthlyBookings: thisMonth.length,
      monthlyRevenue,
    };
  }, [bookings]);

  /* ─── CSV Export ─────────────────────────────────────────────── */
  const exportCSV = () => {
    const headers = ['Booking ID', 'Name', 'Email', 'Phone', 'Date', 'Start Time', 'End Time', 'Status', 'Payment Status', 'Amount', 'Meet Link', 'Created At'];
    const rows = filteredBookings.map((b) => [
      b.bookingId,
      b.fullName,
      b.email,
      b.phone,
      b.consultationDate,
      b.startTime,
      b.endTime,
      b.bookingStatus,
      b.paymentStatus,
      b.amount?.toString() || '0',
      b.meetLink || '',
      typeof b.createdAt === 'string' ? b.createdAt : '',
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ─── Block / Unblock date ──────────────────────────────────── */
  const handleBlockDate = async () => {
    if (!blockDate) return;
    try {
      const db = getFirestoreClient();
      if (!db) return;
      await setDoc(doc(db, 'blockedDates', blockDate), {
        date: blockDate,
        reason: blockReason || 'Blocked by admin',
      });
      setBlockDate('');
      setBlockReason('');
      loadData();
    } catch (err) {
      console.error('[admin] Error blocking date:', err);
    }
  };

  const handleUnblockDate = async (date: string) => {
    try {
      const db = getFirestoreClient();
      if (!db) return;
      await deleteDoc(doc(db, 'blockedDates', date));
      loadData();
    } catch (err) {
      console.error('[admin] Error unblocking date:', err);
    }
  };

  /* ─── Styles ────────────────────────────────────────────────── */
  const pageStyle: React.CSSProperties = {
    minHeight: '100vh', background: '#0a0a0a', color: '#fff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  const cardStyle: React.CSSProperties = {
    background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#0a0a0a', border: '1px solid #333', color: '#fff',
    fontSize: '0.95rem', padding: '0.7rem 1rem', borderRadius: '8px', outline: 'none',
  };

  const btnStyle = (active: boolean): React.CSSProperties => ({
    background: active ? '#fff' : 'transparent',
    color: active ? '#000' : '#888',
    border: active ? 'none' : '1px solid #333',
    padding: '0.6rem 1.5rem', borderRadius: '100px', cursor: 'pointer',
    fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.2s ease',
  });

  /* ═══════════════════════ LOGIN SCREEN ═══════════════════════ */
  if (!isAuthenticated) {
    return (
      <div style={{ ...pageStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ ...cardStyle, maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Admin Dashboard</h1>
          <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '2rem' }}>Enter your admin password to continue.</p>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Password"
            style={{ ...inputStyle, marginBottom: '1rem' }}
            autoFocus
          />

          {authError && <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginBottom: '1rem' }}>{authError}</p>}

          <button onClick={handleLogin} style={{ ...btnStyle(true), width: '100%' }}>
            Login
          </button>
        </div>
      </div>
    );
  }

  /* ═══════════════════════ DASHBOARD ═══════════════════════ */
  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #222', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>📊 Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button onClick={loadData} style={{ ...btnStyle(false), fontSize: '0.8rem' }} disabled={loading}>
            {loading ? '↻ Loading...' : '↻ Refresh'}
          </button>
          <button
            onClick={() => { sessionStorage.removeItem('admin_token'); setIsAuthenticated(false); }}
            style={{ ...btnStyle(false), fontSize: '0.8rem', color: '#ff6b6b', borderColor: '#ff6b6b33' }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Tab navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {(['bookings', 'analytics', 'blocked'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={btnStyle(activeTab === tab)}
            >
              {tab === 'bookings' ? '📋 Bookings' : tab === 'analytics' ? '📈 Analytics' : '🚫 Blocked Dates'}
            </button>
          ))}
        </div>

        {/* ═════ BOOKINGS TAB ═════ */}
        {activeTab === 'bookings' && (
          <>
            {/* Search & Filter bar */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search by name, email, phone, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ ...inputStyle, maxWidth: '400px' }}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ ...inputStyle, maxWidth: '200px' }}
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refund_pending">Refund Pending</option>
              </select>
              <button onClick={exportCSV} style={btnStyle(false)}>
                ⬇ Export CSV
              </button>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={cardStyle}>
                <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Total Bookings</p>
                <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>{analytics.totalBookings}</p>
              </div>
              <div style={cardStyle}>
                <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.25rem' }}>This Month</p>
                <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>{analytics.monthlyBookings}</p>
              </div>
              <div style={cardStyle}>
                <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Total Revenue</p>
                <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: '#4ade80' }}>₹{analytics.totalRevenue.toLocaleString()}</p>
              </div>
              <div style={cardStyle}>
                <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Monthly Revenue</p>
                <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: '#4ade80' }}>₹{analytics.monthlyRevenue.toLocaleString()}</p>
              </div>
            </div>

            {/* Bookings table */}
            <div style={{ ...cardStyle, padding: 0, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #222' }}>
                    {['Booking ID', 'Name', 'Email', 'Phone', 'Date', 'Time', 'Amount', 'Status', 'Meet'].map((h) => (
                      <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: '#888', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                        No bookings found.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.bookingId} style={{ borderBottom: '1px solid #1a1a1a' }}>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#888' }}>{b.bookingId}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{b.fullName}</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#aaa' }}>{b.email}</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#aaa' }}>{b.phone}</td>
                        <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>{b.consultationDate}</td>
                        <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>{b.startTime} – {b.endTime}</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#4ade80', fontWeight: 600 }}>₹{b.amount}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{
                            display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '100px',
                            fontSize: '0.75rem', fontWeight: 600,
                            background: b.bookingStatus === 'confirmed' ? '#4ade8020' : b.bookingStatus === 'cancelled' ? '#ff6b6b20' : '#fbbf2420',
                            color: b.bookingStatus === 'confirmed' ? '#4ade80' : b.bookingStatus === 'cancelled' ? '#ff6b6b' : '#fbbf24',
                          }}>
                            {b.bookingStatus}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          {b.meetLink ? (
                            <a href={b.meetLink} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.8rem' }}>
                              Join ↗
                            </a>
                          ) : (
                            <span style={{ color: '#555' }}>—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ═════ ANALYTICS TAB ═════ */}
        {activeTab === 'analytics' && (
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem' }}>Revenue Overview</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              <div style={cardStyle}>
                <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Total Confirmed Bookings</p>
                <p style={{ fontSize: '3rem', fontWeight: 700, margin: 0 }}>{analytics.confirmedBookings}</p>
              </div>
              <div style={cardStyle}>
                <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Lifetime Revenue</p>
                <p style={{ fontSize: '3rem', fontWeight: 700, margin: 0, color: '#4ade80' }}>₹{analytics.totalRevenue.toLocaleString()}</p>
              </div>
              <div style={cardStyle}>
                <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem' }}>This Month&apos;s Revenue</p>
                <p style={{ fontSize: '3rem', fontWeight: 700, margin: 0, color: '#4ade80' }}>₹{analytics.monthlyRevenue.toLocaleString()}</p>
              </div>
              <div style={cardStyle}>
                <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem' }}>This Month&apos;s Bookings</p>
                <p style={{ fontSize: '3rem', fontWeight: 700, margin: 0 }}>{analytics.monthlyBookings}</p>
              </div>
            </div>

            {/* Monthly breakdown */}
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginTop: '2.5rem', marginBottom: '1rem', color: '#aaa' }}>Monthly Breakdown</h3>
            <div style={{ ...cardStyle, padding: 0, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #222' }}>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'left', color: '#888' }}>Month</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'right', color: '#888' }}>Bookings</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'right', color: '#888' }}>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const monthMap = new Map<string, { count: number; revenue: number }>();
                    bookings.filter((b) => b.bookingStatus === 'confirmed').forEach((b) => {
                      const month = b.consultationDate.substring(0, 7);
                      const existing = monthMap.get(month) || { count: 0, revenue: 0 };
                      monthMap.set(month, { count: existing.count + 1, revenue: existing.revenue + (b.amount || 0) });
                    });
                    const sorted = Array.from(monthMap.entries()).sort((a, b) => b[0].localeCompare(a[0]));
                    return sorted.map(([month, data]) => (
                      <tr key={month} style={{ borderBottom: '1px solid #1a1a1a' }}>
                        <td style={{ padding: '0.75rem 1rem' }}>{month}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>{data.count}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#4ade80', fontWeight: 600 }}>₹{data.revenue.toLocaleString()}</td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═════ BLOCKED DATES TAB ═════ */}
        {activeTab === 'blocked' && (
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem' }}>Block Dates</h2>

            {/* Block date form */}
            <div style={{ ...cardStyle, marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '1rem' }}>Add Blocked Date</h3>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.35rem' }}>Date</label>
                  <input
                    type="date"
                    value={blockDate}
                    onChange={(e) => setBlockDate(e.target.value)}
                    style={{ ...inputStyle, maxWidth: '200px' }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.35rem' }}>Reason (optional)</label>
                  <input
                    type="text"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    placeholder="e.g. Holiday, Personal"
                    style={inputStyle}
                  />
                </div>
                <button onClick={handleBlockDate} style={btnStyle(!!blockDate)} disabled={!blockDate}>
                  Block Date
                </button>
              </div>
            </div>

            {/* Blocked dates list */}
            <div style={{ ...cardStyle, padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #222' }}>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'left', color: '#888' }}>Date</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'left', color: '#888' }}>Reason</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'right', color: '#888' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {blockedDatesList.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                        No blocked dates.
                      </td>
                    </tr>
                  ) : (
                    blockedDatesList.map((bd) => (
                      <tr key={bd.date} style={{ borderBottom: '1px solid #1a1a1a' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{bd.date}</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#aaa' }}>{bd.reason}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                          <button
                            onClick={() => handleUnblockDate(bd.date)}
                            style={{ ...btnStyle(false), fontSize: '0.8rem', color: '#ff6b6b', borderColor: '#ff6b6b33', padding: '0.4rem 1rem' }}
                          >
                            Unblock
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
