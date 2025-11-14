import { Link, useParams } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects.js';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'planning', label: 'Planning' },
  { value: 'paused', label: 'Paused' }
];

function ProjectDetailsPage() {
  const { projectId } = useParams();
  const { isLoading, getProjectById, updateProjectStatus, mutationState } = useProjects();
  const project = getProjectById(projectId);
  const isUpdating = mutationState.type === 'update' && mutationState.targetId === projectId;

  if (isLoading) {
    return (
      <main className="page">
        <p role="status" aria-live="polite">
          Loading project…
        </p>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="page">
        <p role="alert">Sorry, we could not find that project.</p>
        <Link className="inline-link" to="/">
          ← Back to all projects
        </Link>
      </main>
    );
  }

  return (
    <main className="page">
      <Link className="inline-link" to="/">
        ← Back to all projects
      </Link>
      <article className="project-details">
        <header>
          <h1>{project.name}</h1>
          <span className={`status status-${project.status.toLowerCase()}`}>{project.status}</span>
        </header>
        <p>{project.summary}</p>

        <section className="status-panel">
          <label className="status-field">
            <span>Update status</span>
            <select
              value={project.status.toLowerCase()}
              onChange={(event) => updateProjectStatus(project.id, event.target.value)}
              disabled={isUpdating}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          {isUpdating ? (
            <p role="status" aria-live="polite">
              Saving status update…
            </p>
          ) : null}
        </section>

        <section>
          <h2>Snapshot</h2>
          <dl>
            <div>
              <dt>Owner</dt>
              <dd>{project.owner}</dd>
            </div>
            <div>
              <dt>Budget</dt>
              <dd>{project.budget}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>{project.lastUpdated}</dd>
            </div>
            <div>
              <dt>Team</dt>
              <dd>{project.team?.length ? project.team.join(', ') : '—'}</dd>
            </div>
          </dl>
        </section>
      </article>
    </main>
  );
}

export default ProjectDetailsPage;

