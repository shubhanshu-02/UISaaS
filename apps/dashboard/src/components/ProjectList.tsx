'use client';
import { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { ComponentList } from './ComponentList';
import type { Project } from '@ui-saas/types';

export function ProjectList() {
  const { projects, isLoading, error, mutate } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<string | null>(null);

  async function handleDeleteProject(project: Project) {
    if (!confirm(`Are you sure you want to delete "${project.name}"? This will delete all components in this project.`)) {
      return;
    }

    setDeletingProject(project.id);
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await mutate(); // Refresh projects list
        if (selectedProject?.id === project.id) {
          setSelectedProject(null);
        }
      } else {
        const data = await response.json();
        alert(`Failed to delete project: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project. Please try again.');
    }
    setDeletingProject(null);
  }

  async function handleToggleProjectPrivacy(project: Project) {
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !project.isPublic }),
      });

      if (response.ok) {
        await mutate(); // Refresh projects list
      } else {
        const data = await response.json();
        alert(`Failed to update project privacy: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to update project privacy:', error);
      alert('Failed to update project privacy. Please try again.');
    }
  }

  function copyProjectUrl(project: Project) {
    const url = `${window.location.origin}/project/${project.slug}`;
    navigator.clipboard.writeText(url);
    alert('Project URL copied to clipboard!');
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-32"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Projects</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>There was a problem loading your projects. Please try again.</p>
              <button 
                onClick={() => mutate()} 
                className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating your first project.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project: Project) => (
          <div key={project.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Created {formatDate(project.createdAt)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleProjectPrivacy(project)}
                    className={`text-xs px-2 py-1 rounded-full ${
                      project.isPublic
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {project.isPublic ? '🌍 Public' : '🔒 Private'}
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedProject(
                      selectedProject?.id === project.id ? null : project
                    )}
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  >
                    {selectedProject?.id === project.id ? 'Hide' : 'View Components'}
                  </button>
                  
                  {project.isPublic && (
                    <button
                      onClick={() => copyProjectUrl(project)}
                      className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded"
                    >
                      📋 Copy URL
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteProject(project)}
                  disabled={deletingProject === project.id}
                  className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  {deletingProject === project.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>

              {project.theme && (
                <div className="mt-3 text-xs text-gray-500">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    🎨 Custom Theme Applied
                  </span>
                </div>
              )}
            </div>

            {selectedProject?.id === project.id && (
              <div className="border-t border-gray-200 px-5 py-4">
                <ComponentList projectId={project.id} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
