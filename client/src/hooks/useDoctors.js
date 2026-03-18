import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const SPECIALTIES = [
  'All',
  'Cardiologist',
  'Neurologist',
  'Dermatologist',
  'Orthopedic',
  'General Physician',
];

const useDoctors = () => {
  const [doctors,       setDoctors]       = useState([]);
  const [filtered,      setFiltered]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');
  const [search,        setSearch]        = useState('');
  const [activeSpecialty, setActiveSpecialty] = useState('All');

  // Fetch once on mount
  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/doctors');
      setDoctors(data.doctors);
      setFiltered(data.doctors);
    } catch (err) {
      setError('Failed to load doctors. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  // Re-filter whenever search or specialty changes
  useEffect(() => {
    let result = [...doctors];

    if (activeSpecialty !== 'All') {
      result = result.filter(d =>
        d.specialization.toLowerCase() === activeSpecialty.toLowerCase()
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  }, [search, activeSpecialty, doctors]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setActiveSpecialty('All'); // reset pill when typing
  };

  const handleSpecialty = (specialty) => {
    setActiveSpecialty(specialty);
    setSearch(''); // reset search when picking a pill
  };

  return {
    filtered, loading, error,
    search, handleSearch,
    activeSpecialty, handleSpecialty,
    specialties: SPECIALTIES,
    total: doctors.length,
    retry: fetchDoctors,
  };
};

export default useDoctors;