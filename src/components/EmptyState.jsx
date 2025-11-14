function EmptyState({ title, message, action }) {
  return (
    <section className="empty-state" role="status" aria-live="polite">
      <div aria-hidden="true" className="empty-state-emoji">
        ✨
      </div>
      <h2>{title}</h2>
      <p>{message}</p>
      {action}
    </section>
  );
}

export default EmptyState;

