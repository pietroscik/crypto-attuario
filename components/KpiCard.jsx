/**
 * KpiCard - Reusable KPI display component
 * Shows a title, value, and optional delta/change indicator
 */

import { getDeltaClass } from '../lib/helpers/format';

export default function KpiCard({ title, value, delta, unit, tooltip, loading }) {
  if (loading) {
    return (
      <div className="kpi-card kpi-card--loading">
        <div className="kpi-card__title">{title}</div>
        <div className="kpi-card__value">Loading...</div>
      </div>
    );
  }

  return (
    <div className="kpi-card" title={tooltip || ''}>
      <div className="kpi-card__title">{title}</div>
      <div className="kpi-card__value">
        {value}
        {unit && <span className="kpi-card__unit">{unit}</span>}
      </div>
      {delta !== null && delta !== undefined && (
        <div className={`kpi-card__delta ${getDeltaClass(delta)}`}>
          {delta > 0 && '+'}
          {typeof delta === 'number' ? delta.toFixed(2) : delta}%
        </div>
      )}
    </div>
  );
}
