import { useCallback, useEffect, useMemo, useState } from 'react';
import { projects as seedProjects } from '../data/projects.js';

const STATUS_LABELS = {
  active: 'Active',
  planning: 'Planning',
  paused: 'Paused'
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric'
});

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 32);

const formatStatus = (value = 'planning') => STATUS_LABELS[value.toLowerCase()] ?? 'Planning';

const formatDate = (value = new Date()) => dateFormatter.format(value);

const hydrateTeam = (teamInput = '') =>
  teamInput
    .split(',')
    .map((member) => member.trim())
    .filter(Boolean);

const ensureId = (name) => `${slugify(name || 'project')}-${Date.now().toString(36)}`;

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mutationState, setMutationState] = useState({ type: null, targetId: null });

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      if (!cancelled) {
        setProjects(seedProjects);
        setIsLoading(false);
      }
    }, 120);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const runWithLatency = useCallback((updater, meta) => {
    setMutationState(meta);
    return new Promise((resolve) => {
      setTimeout(() => {
        let nextState = [];
        setProjects((prev) => {
          nextState = typeof updater === 'function' ? updater(prev) : prev;
          return nextState;
        });
        setMutationState({ type: null, targetId: null });
        resolve(nextState);
      }, 200);
    });
  }, []);

  const createProject = useCallback(
    async ({ name, owner, summary, status, team }) => {
      const trimmedName = name?.trim();
      const trimmedOwner = owner?.trim();

      if (!trimmedName || !trimmedOwner) {
        throw new Error('Name and owner are required');
      }

      const newProject = {
        id: ensureId(trimmedName),
        name: trimmedName,
        owner: trimmedOwner,
        summary: summary?.trim() || 'Awaiting summary.',
        status: formatStatus(status),
        budget: '$0',
        lastUpdated: formatDate(),
        team: hydrateTeam(team)
      };

      await runWithLatency((prev) => [newProject, ...prev], { type: 'create', targetId: newProject.id });
      return newProject;
    },
    [runWithLatency]
  );

  const updateProjectStatus = useCallback(
    async (projectId, nextStatus) => {
      const statusLabel = formatStatus(nextStatus);
      await runWithLatency(
        (prev) =>
          prev.map((project) =>
            project.id === projectId
              ? { ...project, status: statusLabel, lastUpdated: formatDate() }
              : project
          ),
        { type: 'update', targetId: projectId }
      );
    },
    [runWithLatency]
  );

  const getProjectById = useCallback(
    (id) => projects.find((project) => project.id === id),
    [projects]
  );

  const helpers = useMemo(
    () => ({
      getProjectById,
      createProject,
      updateProjectStatus
    }),
    [createProject, getProjectById, updateProjectStatus]
  );

  return { projects, isLoading, error, mutationState, ...helpers };
}

export default useProjects;

