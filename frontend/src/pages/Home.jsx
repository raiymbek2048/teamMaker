import { useState, useEffect } from 'react';
import { projectAPI } from '../services/api';
import { PROJECT_SPHERES } from '../utils/constants';
import ProjectCard from '../components/ProjectCard';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSphere, setSelectedSphere] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, [selectedSphere, search]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedSphere) params.sphere = selectedSphere;

      const response = await projectAPI.getAllProjects(params);
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Найдите команду для вашего проекта
        </h1>
        <p className="text-lg text-gray-600">
          Присоединяйтесь к существующим проектам или создайте свой
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Поиск проектов
            </label>
            <input
              type="text"
              placeholder="Введите название или описание..."
              className="input-field"
              value={search}
              onChange={handleSearchChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Фильтр по сфере
            </label>
            <select
              className="input-field"
              value={selectedSphere}
              onChange={(e) => setSelectedSphere(e.target.value)}
            >
              <option value="">Все сферы</option>
              {PROJECT_SPHERES.map((sphere) => (
                <option key={sphere} value={sphere}>
                  {sphere}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Create Project CTA */}
      {isAuthenticated && (
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Есть идея для проекта?</h3>
              <p className="text-primary-100">
                Создайте свой проект и найдите единомышленников
              </p>
            </div>
            <Link
              to="/projects/create"
              className="bg-white text-primary-600 hover:bg-primary-50 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Создать проект
            </Link>
          </div>
        </div>
      )}

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
              Проекты не найдены
            </h3>
            <p className="text-gray-600 mb-6">
              Попробуйте изменить параметры поиска или создайте первый проект
            </p>
            {isAuthenticated && (
              <Link to="/projects/create" className="btn-primary">
                Создать проект
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* Results count */}
      {!loading && projects.length > 0 && (
        <div className="text-center text-gray-600">
          Найдено проектов: {projects.length}
        </div>
      )}
    </div>
  );
};

export default Home;
