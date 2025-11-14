import { useState } from 'react';

const initialForm = {
  name: '',
  owner: '',
  summary: '',
  status: 'planning',
  team: ''
};

const statusOptions = [
  { value: 'planning', label: 'Planning' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' }
];

function ProjectComposer({ onCreate, isBusy }) {
  const [formState, setFormState] = useState(initialForm);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      await onCreate(formState);
      setFormState(initialForm);
    } catch (err) {
      setError(err.message || 'Unable to create project');
    }
  };

  return (
    <form className="composer-card" onSubmit={handleSubmit} aria-label="Quick add project">
      <div className="composer-header">
        <div>
          <p className="composer-label">Quick add</p>
          <h2>Capture a lightweight initiative</h2>
          <p className="composer-hint">New entries appear at the top of the list.</p>
        </div>
        <button type="submit" className="primary-button" disabled={isBusy}>
          {isBusy ? 'Saving…' : 'Add project'}
        </button>
      </div>

      <div className="composer-grid">
        <label>
          <span>Project name</span>
          <input
            name="name"
            type="text"
            placeholder="Retail kiosk rollout"
            value={formState.name}
            onChange={handleChange}
            required
            disabled={isBusy}
          />
        </label>
        <label>
          <span>Owner</span>
          <input
            name="owner"
            type="text"
            placeholder="Field Ops"
            value={formState.owner}
            onChange={handleChange}
            required
            disabled={isBusy}
          />
        </label>
        <label>
          <span>Status</span>
          <select name="status" value={formState.status} onChange={handleChange} disabled={isBusy}>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Team (comma separated)</span>
          <input
            name="team"
            type="text"
            placeholder="Joy, Priya, Jon"
            value={formState.team}
            onChange={handleChange}
            disabled={isBusy}
          />
        </label>
      </div>

      <label className="composer-summary">
        <span>Summary</span>
        <textarea
          name="summary"
          rows="3"
          placeholder="One sentence describing scope and definition of done."
          value={formState.summary}
          onChange={handleChange}
          disabled={isBusy}
        />
      </label>

      {error ? (
        <p className="composer-error" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}

export default ProjectComposer;

