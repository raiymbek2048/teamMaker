import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getProjectById(id);
      setProject(response.data);
    } catch (error) {
      setError('Не удалось загрузить проект');
      console.error('Failed to fetch project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinProject = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await projectAPI.addMember(project.id, user.id);
      fetchProject(); // Refresh project data
    } catch (error) {
      setError('Не удалось присоединиться к проекту');
    }
  };

  const handleLeaveProject = async () => {
    try {
      await projectAPI.removeMember(project.id, user.id);
      fetchProject(); // Refresh project data
    } catch (error) {
      setError('Не удалось покинуть проект');
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Вы уверены, что хотите удалить этот проект?')) {
      try {
        await projectAPI.deleteProject(project.id);
        navigate('/');
      } catch (error) {
        setError('Не удалось удалить проект');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
        {error || 'Проект не найден'}
      </div>
    );
  }

  const isOwner = user?.id === project.owner?.id;
  const isMember = project.members?.some((member) => member.id === user?.id);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <h1 className="text-4xl font-bold text-gray-900">{project.name}</h1>
              {isOwner && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                  Владелец
                </span>
              )}
              {isMember && !isOwner && (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  Участник
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {project.type}
              </span>
              <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                {project.sphere}
              </span>
              <div className="flex items-center space-x-1 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">{project.location}</span>
              </div>
            </div>
          </div>

          {isAuthenticated && (
            <div className="flex items-center space-x-3">
              {isOwner ? (
                <>
                  <Link
                    to={`/projects/${project.id}/edit`}
                    className="btn-secondary"
                  >
                    Редактировать
                  </Link>
                  <button
                    onClick={handleDeleteProject}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Удалить
                  </button>
                </>
              ) : isMember ? (
                <button
                  onClick={handleLeaveProject}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Покинуть проект
                </button>
              ) : (
                <button
                  onClick={handleJoinProject}
                  className="btn-primary"
                >
                  Присоединиться
                </button>
              )}
            </div>
          )}
        </div>

        <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
          {project.description}
        </p>

        <div className="mt-6 flex items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="font-medium">{project.members?.length || 0} участников</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Создан {formatDate(project.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Required Skills */}
          {project.requiredSkills && project.requiredSkills.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Требуемые навыки</h2>
              <div className="flex flex-wrap gap-2">
                {project.requiredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-primary-50 text-primary-700 font-medium rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Team Roles */}
          {project.team && project.team.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Требуемые роли</h2>
              <div className="space-y-2">
                {project.team.map((role, index) => (
                  <div key={index} className="flex items-center space-x-2 text-gray-700">
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Owner */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Владелец проекта</h2>
            <Link
              to={`/users/${project.owner?.id}`}
              className="flex items-center space-x-3 hover:bg-gray-50 p-3 rounded-lg transition-colors"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold text-lg">
                  {project.owner?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{project.owner?.username}</p>
                {project.owner?.fullName && (
                  <p className="text-sm text-gray-600">{project.owner?.fullName}</p>
                )}
              </div>
            </Link>
          </div>

          {/* Members */}
          {project.members && project.members.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Участники ({project.members.length})
              </h2>
              <div className="space-y-2">
                {project.members.slice(0, 5).map((member) => (
                  <Link
                    key={member.id}
                    to={`/users/${member.id}`}
                    className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">
                        {member.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{member.username}</p>
                      {member.fullName && (
                        <p className="text-xs text-gray-600">{member.fullName}</p>
                      )}
                    </div>
                  </Link>
                ))}
                {project.members.length > 5 && (
                  <p className="text-sm text-gray-600 text-center pt-2">
                    +{project.members.length - 5} участников
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
