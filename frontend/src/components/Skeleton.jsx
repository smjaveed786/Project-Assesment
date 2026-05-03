export default function Skeleton({ type, style }) {
  return <div className={`skeleton skeleton-${type}`} style={style}></div>;
}

export function DashboardSkeleton() {
  return (
    <div className="page-fade-in">
      <div className="header-section">
        <Skeleton type="title" style={{ width: '300px' }} />
        <Skeleton type="text" style={{ width: '450px' }} />
      </div>
      
      <div className="stats-grid">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} type="card" />
        ))}
      </div>

      <div className="content-grid">
        <Skeleton type="card" style={{ height: '300px' }} />
        <Skeleton type="card" style={{ height: '300px' }} />
      </div>
    </div>
  );
}

export function GridSkeleton() {
  return (
    <div className="grid">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Skeleton key={i} type="card" />
      ))}
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="overview-card">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', padding: '1rem', borderBottom: '1px solid var(--border)' }}>
          <Skeleton type="avatar" />
          <Skeleton type="text" style={{ flex: 1, height: '1.5rem' }} />
          <Skeleton type="text" style={{ width: '100px', height: '1.5rem' }} />
        </div>
      ))}
    </div>
  );
}
