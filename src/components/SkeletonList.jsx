function SkeletonCard() {
  return (
    <li className="project-card skeleton-card" aria-hidden="true">
      <div className="skeleton-line skeleton-line-lg" />
      <div className="skeleton-line" />
      <div className="skeleton-line" />
      <div className="skeleton-meta">
        <span className="skeleton-pill" />
        <span className="skeleton-pill" />
      </div>
    </li>
  );
}

function SkeletonList({ count = 4 }) {
  return (
    <ul className="project-grid" aria-live="polite">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </ul>
  );
}

export default SkeletonList;

