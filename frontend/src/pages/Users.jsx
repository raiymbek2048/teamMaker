import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllUsers(search);
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Участники</h1>
        <p className="text-lg text-gray-600">
          Найдите людей для своего проекта
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Поиск участников
        </label>
        <input
          type="text"
          placeholder="Введите имя или навык..."
          className="input-field"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Users Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Участники не найдены
          </h3>
          <p className="text-gray-600">
            Попробуйте изменить параметры поиска
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Link
              key={user.id}
              to={`/users/${user.id}`}
              className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6"
            >
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-600 font-bold text-2xl">
                    {user.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 truncate">
                    {user.fullName || user.username}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">@{user.username}</p>
                  {user.location && (
                    <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{user.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {user.bio && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {user.bio}
                </p>
              )}

              {user.skills && user.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {user.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {user.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{user.skills.length - 3}
                    </span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Results count */}
      {!loading && users.length > 0 && (
        <div className="text-center text-gray-600">
          Найдено участников: {users.length}
        </div>
      )}
    </div>
  );
};

export default Users;
