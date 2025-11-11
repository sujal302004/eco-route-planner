import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navigation.css';

const Navigation = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userStats, setUserStats] = useState({
    carbonSaved: 0,
    routesCompleted: 0
  });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserStats();
      fetchNotifications();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/user-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserStats(response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Mock notifications for demo
      setNotifications([
        {
          id: 1,
          type: 'achievement',
          title: 'Carbon Saver!',
          message: 'You saved 5kg CO₂ this week',
          timestamp: new Date(),
          read: false
        },
        {
          id: 2,
          type: 'tip',
          title: 'Eco Tip',
          message: 'Try cycling for short distances',
          timestamp: new Date(Date.now() - 3600000),
          read: true
        }
      ]);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const getUnreadCount = () => {
    return notifications.filter(notif => !notif.read).length;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'achievement':
        return '🏆';
      case 'tip':
        return '💡';
      case 'alert':
        return '⚠️';
      default:
        return '📢';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        {/* Logo and Brand */}
        <div className="nav-brand">
          <Link to="/dashboard" className="brand-link">
            <div className="brand-logo">
              <span className="logo-icon">🌱</span>
              <span className="logo-text">EcoRoute</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-desktop">
          <div className="nav-links">
            <Link 
              to="/dashboard" 
              className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
            >
              <span className="nav-icon">📊</span>
              Dashboard
            </Link>
            <Link 
              to="/plan-route" 
              className={`nav-link ${location.pathname === '/plan-route' ? 'active' : ''}`}
            >
              <span className="nav-icon">🗺️</span>
              Plan Route
            </Link>
            <Link 
              to="/explore" 
              className={`nav-link ${location.pathname === '/explore' ? 'active' : ''}`}
            >
              <span className="nav-icon">🔍</span>
              Explore
            </Link>
            <Link 
              to="/leaderboard" 
              className={`nav-link ${location.pathname === '/leaderboard' ? 'active' : ''}`}
            >
              <span className="nav-icon">🏆</span>
              Leaderboard
            </Link>
          </div>

          <div className="nav-actions">
            {/* Quick Stats */}
            <div className="quick-stats">
              <div className="stat-item">
                <span className="stat-icon">🌍</span>
                <span className="stat-value">{(userStats.carbonSaved / 1000).toFixed(1)}kg</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🚀</span>
                <span className="stat-value">{userStats.routesCompleted}</span>
              </div>
            </div>

            {/* Notifications */}
            <div className="notification-container">
              <button 
                className="notification-btn"
                onClick={toggleNotifications}
              >
                <span className="notification-icon">🔔</span>
                {getUnreadCount() > 0 && (
                  <span className="notification-badge">{getUnreadCount()}</span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h3>Notifications</h3>
                    <button 
                      className="clear-all-btn"
                      onClick={clearAllNotifications}
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="notification-list">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="notification-icon">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="notification-content">
                            <h4>{notification.title}</h4>
                            <p>{notification.message}</p>
                            <span className="notification-time">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                          {!notification.read && (
                            <div className="unread-indicator"></div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="no-notifications">
                        <span className="no-notif-icon">📭</span>
                        <p>No notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="user-menu">
              <div className="user-info">
                <span className="user-avatar">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
                <span className="user-name">{user?.name}</span>
              </div>
              <div className="user-dropdown">
                <Link to="/profile" className="dropdown-item">
                  <span className="dropdown-icon">👤</span>
                  My Profile
                </Link>
                <Link to="/settings" className="dropdown-item">
                  <span className="dropdown-icon">⚙️</span>
                  Settings
                </Link>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item logout-btn">
                  <span className="dropdown-icon">🚪</span>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="nav-mobile">
          <button className="menu-toggle" onClick={toggleMenu}>
            <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          {isMenuOpen && (
            <div className="mobile-menu">
              <div className="mobile-user-info">
                <div className="user-avatar">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="user-details">
                  <h3>{user?.name}</h3>
                  <p>{user?.city}</p>
                </div>
                <div className="user-stats-mobile">
                  <div className="stat-mobile">
                    <span>{(userStats.carbonSaved / 1000).toFixed(1)}kg</span>
                    <small>CO₂ Saved</small>
                  </div>
                  <div className="stat-mobile">
                    <span>{userStats.routesCompleted}</span>
                    <small>Routes</small>
                  </div>
                </div>
              </div>

              <div className="mobile-nav-links">
                <Link 
                  to="/dashboard" 
                  className={`mobile-nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="nav-icon">📊</span>
                  Dashboard
                </Link>
                <Link 
                  to="/plan-route" 
                  className={`mobile-nav-link ${location.pathname === '/plan-route' ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="nav-icon">🗺️</span>
                  Plan Route
                </Link>
                <Link 
                  to="/explore" 
                  className={`mobile-nav-link ${location.pathname === '/explore' ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="nav-icon">🔍</span>
                  Explore
                </Link>
                <Link 
                  to="/leaderboard" 
                  className={`mobile-nav-link ${location.pathname === '/leaderboard' ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="nav-icon">🏆</span>
                  Leaderboard
                </Link>
                <Link 
                  to="/profile" 
                  className={`mobile-nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="nav-icon">👤</span>
                  Profile
                </Link>
                <Link 
                  to="/settings" 
                  className={`mobile-nav-link ${location.pathname === '/settings' ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="nav-icon">⚙️</span>
                  Settings
                </Link>
              </div>

              <div className="mobile-actions">
                <button 
                  className="mobile-notification-btn"
                  onClick={toggleNotifications}
                >
                  <span className="notification-icon">🔔</span>
                  Notifications
                  {getUnreadCount() > 0 && (
                    <span className="notification-badge-mobile">{getUnreadCount()}</span>
                  )}
                </button>

                <button 
                  className="logout-btn-mobile"
                  onClick={handleLogout}
                >
                  <span className="logout-icon">🚪</span>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="mobile-bottom-nav">
        <Link 
          to="/dashboard" 
          className={`bottom-nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          <span className="bottom-nav-icon">📊</span>
          <span className="bottom-nav-label">Home</span>
        </Link>
        <Link 
          to="/plan-route" 
          className={`bottom-nav-link ${location.pathname === '/plan-route' ? 'active' : ''}`}
        >
          <span className="bottom-nav-icon">🗺️</span>
          <span className="bottom-nav-label">Plan</span>
        </Link>
        <Link 
          to="/explore" 
          className={`bottom-nav-link ${location.pathname === '/explore' ? 'active' : ''}`}
        >
          <span className="bottom-nav-icon">🔍</span>
          <span className="bottom-nav-label">Explore</span>
        </Link>
        <Link 
          to="/leaderboard" 
          className={`bottom-nav-link ${location.pathname === '/leaderboard' ? 'active' : ''}`}
        >
          <span className="bottom-nav-icon">🏆</span>
          <span className="bottom-nav-label">Rank</span>
        </Link>
        <Link 
          to="/profile" 
          className={`bottom-nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
        >
          <span className="bottom-nav-icon">👤</span>
          <span className="bottom-nav-label">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;