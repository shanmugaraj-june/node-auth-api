import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const useBooking = (doctorId) => {
  const navigate = useNavigate();

  const [doctor,       setDoctor]       = useState(null);
  const [slots,        setSlots]        = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal,    setShowModal]    = useState(false);
  const [notes,        setNotes]        = useState('');
  const [loading,      setLoading]      = useState(true);
  const [booking,      setBooking]      = useState(false);
  const [error,        setError]        = useState('');
  const [success,      setSuccess]      = useState(false);

  const fetchData = useCallback(async () => {
    if (!doctorId) return;
    setLoading(true);
    setError('');
    try {
      const [docRes, slotRes] = await Promise.all([
        api.get(`/doctors/${doctorId}`),
        api.get(`/doctors/${doctorId}/slots`),
      ]);
      setDoctor(docRes.data.doctor);
      setSlots(slotRes.data.slots);
    } catch (err) {
      setError('Failed to load doctor details.');
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Group slots by date for the SlotPicker
  const slotsByDate = slots.reduce((acc, slot) => {
    const date = slot.slot_date.split('T')[0]; // normalise to YYYY-MM-DD
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {});

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSlot(null);
    setNotes('');
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot) return;
    setBooking(true);
    setError('');
    try {
      await api.post('/appointments', {
        doctor_id: parseInt(doctorId),
        slot_id:   selectedSlot.id,
        notes:     notes.trim() || null,
      });
      setSuccess(true);
      setShowModal(false);
      // Remove the booked slot from local state immediately
      setSlots(prev => prev.filter(s => s.id !== selectedSlot.id));
      setSelectedSlot(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.');
      setShowModal(false);
    } finally {
      setBooking(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today    = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString())    return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (timeStr) =>
    new Date(`1970-01-01T${timeStr}`).toLocaleTimeString('en-IN', {
      hour:   '2-digit',
      minute: '2-digit',
      hour12: true,
    });

  return {
    doctor, slotsByDate, selectedSlot,
    showModal, notes, setNotes,
    loading, booking, error, success,
    handleSelectSlot, handleCloseModal,
    handleConfirmBooking, formatDate, formatTime,
    goBack: () => navigate('/doctors'),
    goAppointments: () => navigate('/appointments'),
  };
};

export default useBooking;