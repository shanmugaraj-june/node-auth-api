import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [cancelTarget, setCancelTarget] = useState(null); // appointment to cancel
  const [cancelling,   setCancelling]   = useState(false);
  const [cancelError,  setCancelError]  = useState('');

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/appointments/my');
      setAppointments(data.appointments);
    } catch (err) {
      setError('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  // Split into upcoming vs past using slot_date + start_time
  const now = new Date();

  const upcoming = appointments.filter(a => {
    if (a.status === 'cancelled') return false;
    const dt = new Date(`${a.slot_date.split('T')[0]}T${a.start_time}`);
    return dt >= now;
  });

  const past = appointments.filter(a => {
    if (a.status === 'cancelled') return true; // cancelled always in past
    const dt = new Date(`${a.slot_date.split('T')[0]}T${a.start_time}`);
    return dt < now;
  });

  const handleCancelClick  = (appt) => { setCancelTarget(appt); setCancelError(''); };
  const handleCancelDismiss = ()     => { setCancelTarget(null); setCancelError(''); };

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    setCancelError('');
    try {
      await api.delete(`/appointments/${cancelTarget.id}`);
      // Update status in local state — no refetch needed
      setAppointments(prev =>
        prev.map(a => a.id === cancelTarget.id ? { ...a, status: 'cancelled' } : a)
      );
      setCancelTarget(null);
    } catch (err) {
      setCancelError(err.response?.data?.error || 'Could not cancel. Try again.');
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateStr) => {
    const date     = new Date(dateStr.split('T')[0] + 'T00:00:00');
    const today    = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === today.toDateString())    return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  const formatTime = (timeStr) =>
    new Date(`1970-01-01T${timeStr}`).toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', hour12: true,
    });

  return {
    upcoming, past, loading, error,
    cancelTarget, cancelling, cancelError,
    handleCancelClick, handleCancelDismiss, handleCancelConfirm,
    formatDate, formatTime,
    retry: fetchAppointments,
  };
};

export default useAppointments;