import { useMemo, useState } from 'react';
import ProjectComposer from '../components/ProjectComposer.jsx';
import ProjectList from '../components/ProjectList.jsx';
import SkeletonList from '../components/SkeletonList.jsx';
import { useProjects } from '../hooks/useProjects.js';

const STATUS_ORDER = {
  active: 0,
  planning: 1,
  paused: 2
};

function parseDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function ProjectsPage() {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState('updated');
  const { projects, isLoading, createProject, mutationState } = useProjects();

  const filteredProjects = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return projects;
    }

    return projects.filter((project) => {
      const haystacks = [
        project.name,
        project.summary,
        project.owner,
        Array.isArray(project.team) ? project.team.join(' ') : ''
      ];

      return haystacks.some((field) => field.toLowerCase().includes(normalized));
    });
  }, [projects, query]);

  const sortedProjects = useMemo(() => {
    const draft = [...filteredProjects];
    return draft.sort((a, b) => {
      if (sortKey === 'status') {
        const first = STATUS_ORDER[a.status.toLowerCase()] ?? 99;
        const second = STATUS_ORDER[b.status.toLowerCase()] ?? 99;
        return first - second || a.name.localeCompare(b.name);
      }

      if (sortKey === 'name') {
        return a.name.localeCompare(b.name);
      }

      return parseDate(b.lastUpdated) - parseDate(a.lastUpdated);
    });
  }, [filteredProjects, sortKey]);

  const handleResetFilter = () => setQuery('');
  const isCreating = mutationState.type === 'create';

  return (
    <main className="page">
      <header>
        <h1>Project Pulse</h1>
        <p>Track the state of in-flight initiatives and drill into their details.</p>
      </header>

      <ProjectComposer onCreate={createProject} isBusy={isCreating} />

      <section className="controls-grid" role="region" aria-label="List controls">
        <div className="filter-row">
          <label className="sr-only" htmlFor="project-search">
            Filter projects
          </label>
          <input
            className="search-input"
            id="project-search"
            type="search"
            role="searchbox"
            aria-label="Filter projects"
            aria-describedby="project-count"
            placeholder="Search by name, team, or owner"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <small id="project-count" aria-live="polite">
            {sortedProjects.length} matching {sortedProjects.length === 1 ? 'project' : 'projects'}
          </small>
        </div>

        <div className="filter-row">
          <label className="sr-only" htmlFor="project-sort">
            Sort projects
          </label>
          <select
            id="project-sort"
            className="sort-select"
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value)}
          >
            <option value="updated">Last updated (newest)</option>
            <option value="name">Name (A → Z)</option>
            <option value="status">Status (Active first)</option>
          </select>
        </div>
      </section>

      {isLoading ? (
        <>
          <p className="sr-only" role="status" aria-live="polite">
            Loading projects…
          </p>
          <SkeletonList />
        </>
      ) : (
        <ProjectList
          projects={sortedProjects}
          onResetFilter={query ? handleResetFilter : undefined}
        />
      )}
    </main>
  );
}

export default ProjectsPage;

