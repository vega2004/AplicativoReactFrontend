export const SummaryCard = ({ title, value, description }) => {
  return (
    <div className="summary-card">
      <p className="summary-card-title">{title}</p>
      <h2 className="summary-card-value">{value}</h2>
      {description && <span className="summary-card-description">{description}</span>}
    </div>
  );
};