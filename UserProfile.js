import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [routes, setRoutes] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/users/${userId || 'me'}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser(response.data.user);
      setStats(response.data.stats);
      setRoutes(response.data.recentRoutes || []);
      setAchievements(response.data.achievements || []);
      setEditForm(response.data.user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleEditChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/users/${user._id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(editForm);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const getAchievementIcon = (type) => {
    const icons = {
      carbon_saver: '🌱',
      route_explorer: '🗺️',
      eco_warrior: '💚',
      health_champion: '💪',
      consistency: '🔥',
      pioneer: '🚀'
    };
    return icons[type] || '🏆';
  };

  const getLevel = (carbonSaved) => {
    if (carbonSaved >= 10000) return { level: 5, title: 'Eco Master' };
    if (carbonSaved >= 5000) return { level: 4, title: 'Green Champion' };
    if (carbonSaved >= 2000) return { level: 3, title: 'Eco Warrior' };
    if (carbonSaved >= 500) return { level: 2, title: 'Climate Hero' };
    return { level: 1, title: 'Eco Beginner' };
  };

  const levelInfo = getLevel(stats.carbonSaved || 0);

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-error">
        <h2>User not found</h2>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="user-profile">
      {/* Header Section */}
      <div className="profile-header">
        <div className="header-background">
          <div className="header-overlay"></div>
        </div>
        
        <div className="profile-main-info">
          <div className="avatar-section">
            <div className="profile-avatar large">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="level-badge">
              <span className="level-number">Lvl {levelInfo.level}</span>
              <span className="level-title">{levelInfo.title}</span>
            </div>
          </div>
          
          <div className="profile-details">
            <div className="profile-name-section">
              {editing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => handleEditChange('name', e.target.value)}
                  className="edit-input"
                />
              ) : (
                <h1>{user.name}</h1>
              )}
              <div className="profile-actions">
                {editing ? (
                  <>
                    <button onClick={handleSaveProfile} className="btn-primary">
                      Save
                    </button>
                    <button onClick={handleEditToggle} className="btn-secondary">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={handleEditToggle} className="btn-secondary">
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
            
            {editing ? (
              <input
                type="text"
                value={editForm.bio || ''}
                onChange={(e) => handleEditChange('bio', e.target.value)}
                placeholder="Add a bio..."
                className="edit-input bio-input"
              />
            ) : (
              <p className="profile-bio">
                {user.bio || 'Eco-friendly commuter making a difference one route at a time.'}
              </p>
            )}
            
            <div className="profile-meta">
              <span className="meta-item">
                <span className="meta-icon">📍</span>
                {editing ? (
                  <select
                    value={editForm.city}
                    onChange={(e) => handleEditChange('city', e.target.value)}
                    className="edit-select"
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Kolkata">Kolkata</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                  </select>
                ) : (
                  user.city
                )}
              </span>
              <span className="meta-item">
                <span className="meta-icon">📅</span>
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card highlight">
          <div className="stat-icon">🌍</div>
          <div className="stat-info">
            <h3>{(stats.carbonSaved / 1000).toFixed(1)} kg</h3>
            <p>CO₂ Saved</p>
            <small>Equivalent to {((stats.carbonSaved / 1000) / 21).toFixed(1)} trees</small>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🗺️</div>
          <div className="stat-info">
            <h3>{stats.routesCompleted}</h3>
            <p>Eco Routes</p>
            <small>{stats.totalDistance} km traveled</small>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-info">
            <h3>{stats.totalDuration}</h3>
            <p>Active Time</p>
            <small>Across all journeys</small>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💪</div>
          <div className="stat-info">
            <h3>{stats.caloriesBurned}</h3>
            <p>Calories Burned</p>
            <small>Through active travel</small>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </button>
        <button 
          className={`tab ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          Achievements
        </button>
        <button 
          className={`tab ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          Preferences
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="content-grid">
              <div className="content-card">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  {routes.slice(0, 5).map((route, index) => (
                    <div key={route._id} className="activity-item">
                      <div className="activity-icon">
                        {getTransportIcon(route.transportMode)}
                      </div>
                      <div className="activity-details">
                        <h4>{route.startLocation.name} → {route.endLocation.name}</h4>
                        <p>{route.transportMode.replace('_', ' ')} • {(route.distance / 1000).toFixed(1)} km</p>
                        <span className="activity-time">
                          {new Date(route.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="activity-impact">
                        <span className="carbon-saved">+{(route.carbonSaved / 1000).toFixed(1)}kg</span>
                      </div>
                    </div>
                  ))}
                </div>
                {routes.length === 0 && (
                  <div className="empty-state">
                    <span className="empty-icon">🚶</span>
                    <p>No recent activity</p>
                  </div>
                )}
              </div>

              <div className="content-card">
                <h3>Transport Preferences</h3>
                <div className="preferences-chart">
                  <div className="preference-item">
                    <span className="pref-label">Walking</span>
                    <div className="pref-bar">
                      <div className="pref-fill" style={{width: '40%'}}></div>
                    </div>
                    <span className="pref-percent">40%</span>
                  </div>
                  <div className="preference-item">
                    <span className="pref-label">Cycling</span>
                    <div className="pref-bar">
                      <div className="pref-fill" style={{width: '30%'}}></div>
                    </div>
                    <span className="pref-percent">30%</span>
                  </div>
                  <div className="preference-item">
                    <span className="pref-label">Public Transit</span>
                    <div className="pref-bar">
                      <div className="pref-fill" style={{width: '20%'}}></div>
                    </div>
                    <span className="pref-percent">20%</span>
                  </div>
                  <div className="preference-item">
                    <span className="pref-label">E-Vehicle</span>
                    <div className="pref-bar">
                      <div className="pref-fill" style={{width: '10%'}}></div>
                    </div>
                    <span className="pref-percent">10%</span>
                  </div>
                </div>
              </div>

              <div className="content-card">
                <h3>Weekly Progress</h3>
                <div className="progress-chart">
                  <div className="chart-placeholder">
                    <span className="chart-icon">📈</span>
                    <p>Carbon savings trend</p>
                  </div>
                </div>
              </div>

              <div className="content-card">
                <h3>Top Achievements</h3>
                <div className="achievements-preview">
                  {achievements.slice(0, 3).map(achievement => (
                    <div key={achievement.id} className="achievement-preview">
                      <span className="achievement-icon">
                        {getAchievementIcon(achievement.type)}
                      </span>
                      <div className="achievement-info">
                        <h4>{achievement.title}</h4>
                        <p>{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="activity-content">
            <div className="activity-filters">
              <select className="filter-select">
                <option value="all">All Activities</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="walking">Walking</option>
                <option value="cycling">Cycling</option>
                <option value="transit">Public Transit</option>
              </select>
            </div>
            
            <div className="activities-list">
              {routes.map(route => (
                <div key={route._id} className="activity-card">
                  <div className="activity-header">
                    <div className="activity-type">
                      <span className="type-icon">
                        {getTransportIcon(route.transportMode)}
                      </span>
                      <span className="type-name">
                        {route.transportMode.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="activity-date">
                      {new Date(route.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="activity-route">
                    <h4>{route.startLocation.name} → {route.endLocation.name}</h4>
                  </div>
                  
                  <div className="activity-stats">
                    <div className="activity-stat">
                      <span className="stat-label">Distance</span>
                      <span className="stat-value">{(route.distance / 1000).toFixed(1)} km</span>
                    </div>
                    <div className="activity-stat">
                      <span className="stat-label">Duration</span>
                      <span className="stat-value">{formatDuration(route.duration)}</span>
                    </div>
                    <div className="activity-stat">
                      <span className="stat-label">CO₂ Saved</span>
                      <span className="stat-value highlight">+{(route.carbonSaved / 1000).toFixed(1)} kg</span>
                    </div>
                    <div className="activity-stat">
                      <span className="stat-label">Calories</span>
                      <span className="stat-value">{route.caloriesBurned}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {routes.length === 0 && (
                <div className="empty-activities">
                  <span className="empty-icon">🗺️</span>
                  <h3>No activities yet</h3>
                  <p>Start planning eco-routes to see your activity here</p>
                  <button 
                    onClick={() => navigate('/plan-route')}
                    className="btn-primary"
                  >
                    Plan Your First Route
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="achievements-content">
            <div className="achievements-grid">
              {achievements.map(achievement => (
                <div key={achievement.id} className="achievement-card">
                  <div className="achievement-icon-large">
                    {getAchievementIcon(achievement.type)}
                  </div>
                  <div className="achievement-content">
                    <h3>{achievement.title}</h3>
                    <p>{achievement.description}</p>
                    <span className="achievement-date">
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="achievement-badge">
                    <span className="badge-text">🏆</span>
                  </div>
                </div>
              ))}
              
              {achievements.length === 0 && (
                <div className="empty-achievements">
                  <span className="empty-icon">🏆</span>
                  <h3>No achievements yet</h3>
                  <p>Complete eco-routes to unlock achievements</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="preferences-content">
            <div className="preferences-form">
              <div className="form-section">
                <h3>Transport Preferences</h3>
                <div className="preference-options">
                  <label className="preference-option">
                    <input type="checkbox" defaultChecked />
                    <span className="checkmark"></span>
                    <span className="option-icon">🚶</span>
                    <span className="option-label">Walking</span>
                  </label>
                  <label className="preference-option">
                    <input type="checkbox" defaultChecked />
                    <span className="checkmark"></span>
                    <span className="option-icon">🚴</span>
                    <span className="option-label">Cycling</span>
                  </label>
                  <label className="preference-option">
                    <input type="checkbox" defaultChecked />
                    <span className="checkmark"></span>
                    <span className="option-icon">🚆</span>
                    <span className="option-label">Public Transit</span>
                  </label>
                  <label className="preference-option">
                    <input type="checkbox" />
                    <span className="checkmark"></span>
                    <span className="option-icon">🔌</span>
                    <span className="option-label">Electric Vehicle</span>
                  </label>
                  <label className="preference-option">
                    <input type="checkbox" />
                    <span className="checkmark"></span>
                    <span className="option-icon">🛺</span>
                    <span className="option-label">Auto Rickshaw</span>
                  </label>
                </div>
              </div>

              <div className="form-section">
                <h3>Notification Settings</h3>
                <div className="notification-options">
                  <label className="notification-option">
                    <input type="checkbox" defaultChecked />
                    <span className="checkmark"></span>
                    <span className="option-label">Achievement notifications</span>
                  </label>
                  <label className="notification-option">
                    <input type="checkbox" defaultChecked />
                    <span className="checkmark"></span>
                    <span className="option-label">Weekly progress reports</span>
                  </label>
                  <label className="notification-option">
                    <input type="checkbox" />
                    <span className="checkmark"></span>
                    <span className="option-label">Eco tips and suggestions</span>
                  </label>
                </div>
              </div>

              <div className="form-section">
                <h3>Privacy Settings</h3>
                <div className="privacy-options">
                  <label className="privacy-option">
                    <span className="option-label">Profile visibility</span>
                    <select defaultValue="public">
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  </label>
                  <label className="privacy-option">
                    <span className="option-label">Activity sharing</span>
                    <select defaultValue="public">
                      <option value="public">Share all activities</option>
                      <option value="carbon">Share only carbon savings</option>
                      <option value="private">Don't share activities</option>
                    </select>
                  </label>
                </div>
              </div>

              <button className="btn-primary save-preferences">
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions
const getTransportIcon = (mode) => {
  const icons = {
    walking: '🚶',
    cycling: '🚴',
    electric_vehicle: '🔌',
    public_transit: '🚆',
    car_pool: '👥',
    car: '🚗',
    motorcycle: '🏍️',
    auto_rickshaw: '🛺'
  };
  return icons[mode] || '🚗';
};

const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

export default UserProfile;