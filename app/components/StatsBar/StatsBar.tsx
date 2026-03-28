import "./StatsBar.scss";

export type Stat = {
  label: string;
  value?: string;
  values?: string[];
}

export type StatsBarProps = {
  leftStats?: Stat[];
  centerStat?: Stat;
  rightStats?: Stat[];
}

export default function StatsBar({leftStats = [], centerStat, rightStats = []}: StatsBarProps) {

  function renderStats(stat: Stat, className = "") {

    const values = [];
    if (stat.value) values.push(stat.value);
    if (stat.values) values.push(...stat.values);

    return (
      <div key={stat.label} className={`stats ${className}`}>
        <span>{stat.label}</span>
        {Array.isArray(values) ? 
          values.map((value, index) => <span key={index}>{value}</span>)
           : <span>{values}</span>
        }
      </div>
    )
  }

  return (
    <div className="stats-bar">
        <div className="stats-group stats-group--left">
          {leftStats.map((stat) => renderStats(stat))}
      </div>
      <div className="stats-group stats-group--center">
        <div className="stats stats--large">
          {centerStat && renderStats(centerStat, "stats--large")}
        </div>
      </div>
      <div className="stats-group stats-group--right">
        {rightStats.map((stat) => renderStats(stat))}
      </div>
    </div>
  )
}