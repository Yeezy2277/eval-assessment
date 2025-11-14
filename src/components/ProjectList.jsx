import { Link } from 'react-router-dom';
import EmptyState from './EmptyState.jsx';

function ProjectList({ projects, onResetFilter }) {
  if (!projects.length) {
    const hasFilter = typeof onResetFilter === 'function';
    return (
      <EmptyState
        title={hasFilter ? 'No matches yet' : 'No projects yet'}
        message={
          hasFilter
            ? 'Try a different phrase or clear the filter to start over.'
            : 'Add a project to get started once data becomes available.'
        }
        action={
          hasFilter ? (
            <button type="button" className="inline-button" onClick={onResetFilter}>
              Clear filter
            </button>
          ) : null
        }
      />
    );
  }

  return (
    <ul className="project-grid" aria-live="polite">
      {projects.map((project) => (
        <li key={project.id} className="project-card">
          <div>
            <h3>{project.name}</h3>
            <p>{project.summary}</p>
          </div>
          <div className="project-meta">
            <span>{project.owner}</span>
            <span className={`status status-${project.status.toLowerCase()}`}>{project.status}</span>
          </div>
          <small className="project-updated" aria-label={`Last updated ${project.lastUpdated}`}>
            Updated {project.lastUpdated}
          </small>
          <Link className="inline-link" to={`/projects/${project.id}`}>
            View details →
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default ProjectList;

