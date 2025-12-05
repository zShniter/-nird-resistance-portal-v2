// src/context/ResistanceContext.jsx - CORRECTED
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { warriorAPI, statsAPI, donationAPI } from '../utils/api';

// Create context with proper typing
const ResistanceContext = createContext(null);

// Custom hook with proper error handling
export const useResistance = () => {
  const context = useContext(ResistanceContext);
  if (!context) {
    throw new Error('useResistance must be used within a ResistanceProvider');
  }
  return context;
};

export const ResistanceProvider = ({ children }) => {
  const [warriors, setWarriors] = useState([]);
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentWarrior, setCurrentWarrior] = useState(null);

  // Memoize fetchWarriors to prevent infinite re-renders
  const fetchWarriors = useCallback(async () => {
    setLoading(true);
    try {
      const response = await warriorAPI.getAll({ limit: 50 });
      if (response.data && response.data.warriors) {
        setWarriors(response.data.warriors);
      }
      setError(null);
    } catch (error) {
      setError('Failed to fetch warriors');
      console.error('Error fetching warriors:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await statsAPI.getStats();
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const response = await statsAPI.getLeaderboard();
      if (response.data) {
        setLeaderboard(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchWarriors(), fetchStats(), fetchLeaderboard()]);
      } catch (error) {
        setError('Failed to load initial data');
        console.error('Initial data load error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Load current warrior from localStorage
    const savedWarrior = localStorage.getItem('nird_current_warrior');
    if (savedWarrior) {
      try {
        setCurrentWarrior(JSON.parse(savedWarrior));
      } catch (error) {
        console.error('Error parsing saved warrior:', error);
      }
    }
  }, [fetchWarriors, fetchStats, fetchLeaderboard]);

  // Join resistance
  const joinResistance = async (warriorData) => {
    setLoading(true);
    try {
      const response = await warriorAPI.create(warriorData);
      
      if (response.data && response.data.warrior) {
        const newWarrior = response.data.warrior;
        
        // Update state
        setWarriors(prev => [newWarrior, ...prev]);
        setCurrentWarrior(newWarrior);
        
        // Save to localStorage
        localStorage.setItem('nird_current_warrior', JSON.stringify(newWarrior));
        
        // Refresh stats
        await Promise.all([fetchStats(), fetchLeaderboard()]);
        
        return response.data;
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to join resistance';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Update warrior
  const updateWarrior = async (id, updates) => {
    try {
      const response = await warriorAPI.update(id, updates);
      
      if (response.data && response.data.warrior) {
        const updatedWarrior = response.data.warrior;
        
        // Update local state
        setWarriors(prev => 
          prev.map(warrior => 
            warrior._id === id ? updatedWarrior : warrior
          )
        );
        
        // If updating current warrior
        if (currentWarrior?._id === id) {
          setCurrentWarrior(updatedWarrior);
          localStorage.setItem('nird_current_warrior', JSON.stringify(updatedWarrior));
        }
        
        return response.data;
      }
    } catch (error) {
      setError('Failed to update warrior');
      throw error;
    }
  };

  // Add achievement
  const addAchievement = async (warriorId, achievement) => {
    try {
      const response = await warriorAPI.addAchievement(warriorId, achievement);
      
      if (response.data) {
        // Refresh data
        await Promise.all([fetchWarriors(), fetchLeaderboard()]);
        return response.data;
      }
    } catch (error) {
      setError('Failed to add achievement');
      throw error;
    }
  };

  // Search warriors
  const searchWarriors = async (query) => {
    try {
      const response = await warriorAPI.search(query);
      return response.data?.warriors || [];
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  };

  // Refresh data
  const refreshData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchWarriors(), fetchStats(), fetchLeaderboard()]);
      setError(null);
    } catch (error) {
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setCurrentWarrior(null);
    localStorage.removeItem('nird_current_warrior');
  };

  const value = {
    warriors,
    stats,
    leaderboard,
    currentWarrior,
    loading,
    error,
    joinResistance,
    updateWarrior,
    addAchievement,
    searchWarriors,
    refreshData,
    logout,
    setCurrentWarrior,
    fetchWarriors, // Expose fetchWarriors if needed
    fetchStats,
    fetchLeaderboard
  };

  return (
    <ResistanceContext.Provider value={value}>
      {children}
    </ResistanceContext.Provider>
  );
};