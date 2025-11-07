import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProjectCard = ({ project }) => {
  const { user } = useAuth();
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
    <Link to={`/projects/${project.id}`} className="block">
      <div className="card hover:scale-105 transition-transform duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
              {isOwner && (
                <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                  Владелец
                </span>
              )}
              {isMember && !isOwner && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                  Участник
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-gray-100 rounded">{project.type}</span>
              <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded">{project.sphere}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>

        <div className="mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{project.location}</span>
          </div>

          {project.requiredSkills && project.requiredSkills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.requiredSkills.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
              {project.requiredSkills.length > 4 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{project.requiredSkills.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-semibold text-sm">
                {project.owner?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-gray-600">{project.owner?.username}</span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>{project.members?.length || 0}</span>
            </div>
            <span>{formatDate(project.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
