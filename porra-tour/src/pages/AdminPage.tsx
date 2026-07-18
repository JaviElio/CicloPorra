import React from 'react';

const DEFAULT_GITHUB_REPO = 'https://github.com/JaviElio/CicloPorra';

export function AdminPage() {
  const repoUrl = (import.meta.env.VITE_GITHUB_REPO as string | undefined) || DEFAULT_GITHUB_REPO;
  const workflowUrl = `${repoUrl}/actions/workflows/scrape-tour.yml`;

  const handleRunWorkflow = () => {
    window.open(workflowUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="card admin-page">
      <h1 style={{ marginTop: 0 }}>Administración</h1>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 }}>
        <button className="admin-action-btn" type="button" onClick={handleRunWorkflow}>
          Ejecutar workflow scrape-tour
        </button>
      </div>
    </section>
  );
}
