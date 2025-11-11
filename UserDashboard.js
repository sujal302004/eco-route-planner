import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDashboard = ({ user }) => {
  const [routeHistory, setRouteHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Fetch route history
      const historyResponse = await axios.get('http://localhost:3001/api/routes/history');
      setRouteHistory(historyResponse.data);

      // Fetch user stats
      const statsResponse = await axios.get(`http://localhost:3001/api/users/stats/${user.id}`);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Mock data for demo
      setRouteHistory([
        {
          id: 1,
          start: 'New York',
          end: 'Brooklyn',
          distance: 15.2,
          duration: 28,
          ecoScore: 85,
          co2Saved: 2.1,
          date: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 2,
          start: 'Manhattan',
          end: 'Queens',
          distance: 12.8,
          duration: 24,
          ecoScore: 82,
          co2Saved: 1.8,
          date: new Date(Date.now() - 172800000).toISOString()
        }
      ]);

      setStats({
        totalCO2Saved: user.totalCO2Saved,
        totalDistance: user.totalDistance,
        ecoScore: user.ecoScore,
        routesCompleted: 12,
        carbonRank: 'Eco Champion',
        equivalentTrees: 0.226
      });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your eco dashboard...</p>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1>📊 My Eco Dashboard</h1>
        <p>Track your sustainable travel impact</p>
      </div>

      {stats && (
        <div className="stats-overview">
          <div className="stat-card main-stat">
            <div className="stat-icon">🌱</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalCO2Saved} kg</div>
              <div className="stat-label">Total CO₂ Saved</div>
              <div className="stat-subtext">Equivalent to {stats.equivalentTrees} trees</div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📏</div>
              <div className="stat-value">{stats.totalDistance} km</div>
              <div className="stat-label">Distance Traveled</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-value">{stats.ecoScore}</div>
              <div className="stat-label">Eco Score</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🚀</div>
              <div className="stat-value">{stats.routesCompleted}</div>
              <div className="stat-label">Routes Completed</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-value">{stats.carbonRank}</div>
              <div className="stat-label">Carbon Rank</div>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-sections">
        <div className="section">
          <h3>📈 Recent Routes</h3>
          <div className="route-history">
            {routeHistory.length > 0 ? (
              routeHistory.map(route => (
                <div key={route.id} className="history-item">
                  <div className="route-info">
                    <div className="route-path">
                      <span className="from">{route.start}</span>
                      <span className="arrow">→</span>
                      <span className="to">{route.end}</span>
                    </div>
                    <div className="route-meta">
                      <span>{route.distance} km • {route.duration} min</span>
                    </div>
                  </div>
                  <div className="route-eco">
                    <div 
                      className="eco-badge"
                      style={{
                        backgroundColor: route.ecoScore >= 80 ? '#10b981' : 
                                        route.ecoScore >= 60 ? '#f59e0b' : '#ef4444'
                      }}
                    >
                      {route.ecoScore}%
                    </div>
                    <div className="co2-saved">+{route.co2Saved} kg CO₂</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">
                <p>No route history yet. Start planning to see your impact!</p>
              </div>
            )}
          </div>
        </div>

        <div className="section">
          <h3>🎯 Eco Achievements</h3>
          <div className="achievements">
            <div className="achievement unlocked">
              <span className="achievement-icon">🌿</span>
              <div className="achievement-content">
                <div className="achievement-title">First Eco Route</div>
                <div className="achievement-desc">Plan your first sustainable route</div>
              </div>
              <span className="achievement-status">✅</span>
            </div>

            <div className="achievement unlocked">
              <span className="achievement-icon">💰</span>
              <div className="achievement-content">
                <div className="achievement-title">Fuel Saver</div>
                <div className="achievement-desc">Save 10L of fuel</div>
              </div>
              <span className="achievement-status">✅</span>
            </div>

            <div className="achievement locked">
              <span className="achievement-icon">🌳</span>
              <div className="achievement-content">
                <div className="achievement-title">Tree Planter</div>
                <div className="achievement-desc">Save CO₂ equivalent to 1 tree</div>
              </div>
              <span className="achievement-status">🔒</span>
            </div>

            <div className="achievement locked">
              <span className="achievement-icon">🏆</span>
              <div className="achievement-content">
                <div className="achievement-title">Eco Champion</div>
                <div className="achievement-desc">Reach 100 kg CO₂ saved</div>
              </div>
              <span className="achievement-status">🔒</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;