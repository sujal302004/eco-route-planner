import React from 'react';
import { getEcoScoreColor, formatCarbon, formatDistance, formatDuration } from '../services/ecoCalculator';
import './EcoScore.css';

const EcoScore = ({ route, onSaveRoute, isAuthenticated }) => {
  if (!route) return null;

  const { ecoMetrics, weatherConditions, recommendations, weatherImpact } = route;

  const handleSave = () => {
    if (onSaveRoute) {
      onSaveRoute(route);
    }
  };

  return React.createElement('div', { className: 'eco-score-panel' },
    React.createElement('div', { className: 'eco-score-header' },
      React.createElement('h3', null, 'Route Analysis'),
      isAuthenticated && React.createElement('button', {
        className: 'save-btn',
        onClick: handleSave
      }, 'Save Route')
    ),

    React.createElement('div', { className: 'metrics-grid' },
      React.createElement('div', { className: 'metric-card' },
        React.createElement('div', {
          className: 'metric-value',
          style: { color: getEcoScoreColor(ecoMetrics.ecoScore) }
        }, ecoMetrics.ecoScore),
        React.createElement('div', { className: 'metric-label' }, 'Eco Score')
      ),

      React.createElement('div', { className: 'metric-card' },
        React.createElement('div', { className: 'metric-value' },
          formatDistance(route.distance)
        ),
        React.createElement('div', { className: 'metric-label' }, 'Distance')
      ),

      React.createElement('div', { className: 'metric-card' },
        React.createElement('div', { className: 'metric-value' },
          formatDuration(route.duration)
        ),
        React.createElement('div', { className: 'metric-label' }, 'Duration')
      ),

      React.createElement('div', { className: 'metric-card' },
        React.createElement('div', { className: 'metric-value' },
          formatCarbon(ecoMetrics.carbonEmissions)
        ),
        React.createElement('div', { className: 'metric-label' }, 'CO₂ Emissions')
      )
    ),

    ecoMetrics.avoidedEmissions > 0 && React.createElement('div', { className: 'savings-card' },
      React.createElement('div', { className: 'savings-icon' }, '🌱'),
      React.createElement('div', { className: 'savings-content' },
        React.createElement('div', { className: 'savings-title' }, 'Eco Savings'),
        React.createElement('div', { className: 'savings-amount' },
          'You\'re saving ' + formatCarbon(ecoMetrics.avoidedEmissions) + ' of CO₂ compared to the standard route!'
        )
      )
    ),

    weatherConditions && React.createElement('div', { className: 'weather-card' },
      React.createElement('div', { className: 'weather-header' },
        React.createElement('span', null, 'Weather Conditions'),
        weatherImpact.impact !== 'none' && React.createElement('span', {
          className: `weather-impact ${weatherImpact.impact}`
        }, weatherImpact.impact.toUpperCase())
      ),
      React.createElement('div', { className: 'weather-details' },
        React.createElement('div', { className: 'weather-temp' },
          weatherConditions.temperature + '°C'
        ),
        React.createElement('div', { className: 'weather-desc' },
          weatherConditions.description
        ),
        React.createElement('div', { className: 'weather-wind' },
          'Wind: ' + weatherConditions.windSpeed + ' m/s'
        )
      ),
      weatherImpact.message && React.createElement('div', { className: 'weather-alert' },
        weatherImpact.message
      )
    ),

    recommendations && recommendations.length > 0 && React.createElement('div', { className: 'recommendations-card' },
      React.createElement('h4', null, 'Eco Recommendations'),
      recommendations.map((rec, index) =>
        React.createElement('div', {
          key: index,
          className: `recommendation ${rec.impact}`
        },
          React.createElement('div', { className: 'rec-icon' },
            rec.impact === 'high' ? '💚' : rec.impact === 'medium' ? '💛' : '💙'
          ),
          React.createElement('div', { className: 'rec-content' },
            React.createElement('div', { className: 'rec-message' }, rec.message),
            rec.carbonSavings && React.createElement('div', { className: 'rec-savings' },
              'Potential savings: ' + formatCarbon(rec.carbonSavings)
            )
          )
        )
      )
    )
  );
};

export default EcoScore;