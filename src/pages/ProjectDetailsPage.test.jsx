import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProjectDetailsPage from './ProjectDetailsPage.jsx';

const mockUpdateProjectStatus = vi.fn();
let mockHookReturn;

vi.mock('../hooks/useProjects.js', () => ({
  useProjects: () => mockHookReturn
}));

beforeEach(() => {
  mockHookReturn = {
    isLoading: false,
    getProjectById: () => ({
      id: 'alpha-wave',
      name: 'Alpha Wave Monitoring',
      summary: 'Alpha summary',
      owner: 'Research',
      budget: '$100',
      lastUpdated: 'Nov 12, 2025',
      status: 'Active',
      team: ['A']
    }),
    updateProjectStatus: mockUpdateProjectStatus,
    mutationState: { type: null, targetId: null }
  };
  mockUpdateProjectStatus.mockReset();
});

describe('ProjectDetailsPage', () => {
  it('invokes updateProjectStatus when the status select changes', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/projects/alpha-wave']}>
        <Routes>
          <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    const select = screen.getByLabelText(/update status/i);
    await user.selectOptions(select, 'paused');

    expect(mockUpdateProjectStatus).toHaveBeenCalledWith('alpha-wave', 'paused');
  });
});

