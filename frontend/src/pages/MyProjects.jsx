import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI } from '../services/api';
import ProjectCard from '../components/ProjectCard';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getMyProjects();
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch my projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Мои проекты</h1>
            <p className="text-lg text-gray-600">
              Проекты, которые вы создали или в которых участвуете
            </p>
          </div>
          <Link to="/projects/create" className="btn-primary">
            Создать проект
          </Link>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="max-w-md mx-auto">
            <svg
              className="w-24 h-24 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              У вас пока нет проектов
            </h3>
            <p className="text-gray-600 mb-6">
              Создайте свой первый проект или присоединитесь к существующему
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link to="/projects/create" className="btn-primary">
                Создать проект
              </Link>
              <Link to="/" className="btn-secondary">
                Найти проект
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Results count */}
          <div className="text-center text-gray-600">
            Всего проектов: {projects.length}
          </div>
        </>
      )}
    </div>
  );
};

export default MyProjects;
