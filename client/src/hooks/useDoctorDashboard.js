import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api/axios';

const useDoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [activeTab,    setActiveTab]    = useState('upcoming');
  const [actionTarget, setActionTarget] = useState(null); // { appointment, newStatus }
  const [updating,     setUpdating]     = useState(false);
  const [actionError,  setActionError]  = useState('');

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/appointments/doctor');
      setAppointments(data.appointments);
    } catch (err) {
      setError('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const now = new Date();

  const tabs = useMemo(() => {
    const upcoming  = appointments.filter(a => {
      if (['cancelled','completed'].includes(a.status)) return false;
      return new Date(`${a.slot_date.split('T')[0]}T${a.start_time}`) >= now;
    });
    const today = upcoming.filter(a => {
      const d = new Date(a.slot_date.split('T')[0] + 'T00:00:00');
      return d.toDateString() === new Date().toDateString();
    });
    const completed = appointments.filter(a => a.status === 'completed');
    const cancelled = appointments.filter(a => a.status === 'cancelled');

    return { upcoming, today, completed, cancelled };
  }, [appointments]);

  // Stats for the summary row
  const stats = useMemo(() => ({
    total:     appointments.length,
    upcoming:  tabs.upcoming.length,
    today:     tabs.today.length,
    completed: tabs.completed.length,
  }), [appointments, tabs]);

  const handleAction = (appointment, newStatus) => {
    setActionTarget({ appointment, newStatus });
    setActionError('');
  };

  const handleDismiss = () => {
    setActionTarget(null);
    setActionError('');
  };

  const handleConfirmAction = async () => {
    if (!actionTarget) return;
    setUpdating(true);
    setActionError('');
    try {
      await api.patch(`/appointments/${actionTarget.appointment.id}/status`, {
        status: actionTarget.newStatus,
      });
      setAppointments(prev =>
        prev.map(a =>
          a.id === actionTarget.appointment.id
            ? { ...a, status: actionTarget.newStatus }
            : a
        )
      );
      setActionTarget(null);
    } catch (err) {
      setActionError(err.response?.data?.error || 'Update failed. Try again.');
    } finally {
      setUpdating(false);
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
      weekday: 'short', day: 'numeric', month: 'short',
    });
  };

  const formatTime = (t) =>
    new Date(`1970-01-01T${t}`).toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', hour12: true,
    });

  return {
    tabs, stats, loading, error, activeTab, setActiveTab,
    actionTarget, updating, actionError,
    handleAction, handleDismiss, handleConfirmAction,
    formatDate, formatTime,
    retry: fetchAppointments,
  };
};

export default useDoctorDashboard;