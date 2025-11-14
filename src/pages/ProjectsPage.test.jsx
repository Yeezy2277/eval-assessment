import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProjectsPage from './ProjectsPage.jsx';

const mockProjects = [
  {
    id: 'alpha-wave',
    name: 'Alpha Wave Monitoring',
    owner: 'Research',
    status: 'Active',
    summary: 'Alpha summary',
    lastUpdated: 'Nov 12, 2025',
    team: ['A']
  },
  {
    id: 'beta-harbor',
    name: 'Harbor Logistics Revamp',
    owner: 'Operations',
    status: 'Paused',
    summary: 'Beta summary',
    lastUpdated: 'Nov 11, 2025',
    team: ['B']
  }
];

const mockCreateProject = vi.fn();
let mockHookReturn;

vi.mock('../hooks/useProjects.js', () => ({
  useProjects: () => mockHookReturn
}));

beforeEach(() => {
  mockHookReturn = {
    projects: mockProjects,
    isLoading: false,
    createProject: mockCreateProject,
    mutationState: { type: null, targetId: null }
  };
  mockCreateProject.mockReset();
});

describe('ProjectsPage', () => {
  it('filters projects by the entered query', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ProjectsPage />
      </MemoryRouter>
    );

    const input = screen.getByRole('searchbox', { name: /filter projects/i });
    await user.type(input, 'alpha');

    expect(screen.getByText('Alpha Wave Monitoring')).toBeInTheDocument();
    expect(screen.queryByText('Harbor Logistics Revamp')).not.toBeInTheDocument();
    expect(screen.getByText(/matching project/i).textContent).toMatch('1 matching project');
  });

  it('submits a new project via the composer form', async () => {
    const user = userEvent.setup();
    mockCreateProject.mockResolvedValue({ id: 'gamma', name: 'Gamma' });

    render(
      <MemoryRouter>
        <ProjectsPage />
      </MemoryRouter>
    );

    const [composer] = screen.getAllByRole('form', { name: /quick add project/i });
    const composerUtils = within(composer);
    await user.type(composerUtils.getByLabelText(/project name/i), 'Gamma Launch');
    await user.type(composerUtils.getByLabelText(/^owner/i), 'Growth');
    await user.click(composerUtils.getByRole('button', { name: /add project/i }));

    await waitFor(() => expect(mockCreateProject).toHaveBeenCalled());
    expect(mockCreateProject).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Gamma Launch',
        owner: 'Growth',
        status: 'planning'
      })
    );
    expect(composerUtils.getByLabelText(/project name/i)).toHaveValue('');
  });
});

