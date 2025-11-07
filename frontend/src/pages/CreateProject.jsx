import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI } from '../services/api';
import { PROJECT_SPHERES, PROJECT_TYPES } from '../utils/constants';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    sphere: '',
    description: '',
    requiredSkills: '',
    location: '',
    team: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Convert comma-separated strings to arrays
      const projectData = {
        ...formData,
        requiredSkills: formData.requiredSkills
          .split(',')
          .map((skill) => skill.trim())
          .filter((skill) => skill),
        team: formData.team
          .split(',')
          .map((role) => role.trim())
          .filter((role) => role),
      };

      const response = await projectAPI.createProject(projectData);
      navigate(`/projects/${response.data.id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Не удалось создать проект');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Создать новый проект</h1>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Название проекта *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="input-field"
              placeholder="Введите название проекта"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Тип проекта *
              </label>
              <select
                id="type"
                name="type"
                required
                className="input-field"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="">Выберите тип</option>
                {PROJECT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sphere" className="block text-sm font-medium text-gray-700 mb-2">
                Сфера проекта *
              </label>
              <select
                id="sphere"
                name="sphere"
                required
                className="input-field"
                value={formData.sphere}
                onChange={handleChange}
              >
                <option value="">Выберите сферу</option>
                {PROJECT_SPHERES.map((sphere) => (
                  <option key={sphere} value={sphere}>
                    {sphere}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Описание проекта *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows="5"
              className="input-field resize-none"
              placeholder="Опишите ваш проект, его цели и задачи"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Локация *
            </label>
            <input
              id="location"
              name="location"
              type="text"
              required
              className="input-field"
              placeholder="Например: Бишкек, Кыргызстан"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="requiredSkills" className="block text-sm font-medium text-gray-700 mb-2">
              Требуемые навыки
            </label>
            <input
              id="requiredSkills"
              name="requiredSkills"
              type="text"
              className="input-field"
              placeholder="Например: JavaScript, React, Node.js (через запятую)"
              value={formData.requiredSkills}
              onChange={handleChange}
            />
            <p className="mt-1 text-sm text-gray-500">
              Перечислите навыки через запятую
            </p>
          </div>

          <div>
            <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-2">
              Требуемые роли в команде
            </label>
            <input
              id="team"
              name="team"
              type="text"
              className="input-field"
              placeholder="Например: Frontend Developer, Designer, Project Manager (через запятую)"
              value={formData.team}
              onChange={handleChange}
            />
            <p className="mt-1 text-sm text-gray-500">
              Перечислите необходимые роли через запятую
            </p>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Создание...' : 'Создать проект'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
