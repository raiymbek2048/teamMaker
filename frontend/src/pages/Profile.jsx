import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    bio: '',
    location: '',
    phone: '',
    telegram: '',
    instagram: '',
    skills: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        age: user.age || '',
        bio: user.bio || '',
        location: user.location || '',
        phone: user.phone || '',
        telegram: user.telegram || '',
        instagram: user.instagram || '',
        skills: user.skills?.join(', ') || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const profileData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        skills: formData.skills
          .split(',')
          .map((skill) => skill.trim())
          .filter((skill) => skill),
      };

      const result = await updateUser(profileData);

      if (result.success) {
        setSuccess('Профиль успешно обновлен');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Не удалось обновить профиль');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-12">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-primary-600 font-bold text-4xl">
                {user.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold">{user.fullName || user.username}</h1>
              <p className="text-primary-100">@{user.username}</p>
              <p className="text-primary-100 mt-1">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          {!isEditing ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Информация о профиле</h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary"
                >
                  Редактировать
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Полное имя
                  </label>
                  <p className="text-gray-900">{user.fullName || 'Не указано'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Возраст
                  </label>
                  <p className="text-gray-900">{user.age || 'Не указан'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Локация
                  </label>
                  <p className="text-gray-900">{user.location || 'Не указана'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Телефон
                  </label>
                  <p className="text-gray-900">{user.phone || 'Не указан'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Telegram
                  </label>
                  <p className="text-gray-900">{user.telegram || 'Не указан'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Instagram
                  </label>
                  <p className="text-gray-900">{user.instagram || 'Не указан'}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  О себе
                </label>
                <p className="text-gray-900 whitespace-pre-line">{user.bio || 'Расскажите о себе'}</p>
              </div>

              {user.skills && user.skills.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-3">
                    Навыки
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
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
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Редактировать профиль</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Полное имя
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    className="input-field"
                    placeholder="Иван Иванов"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Возраст
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="1"
                    max="120"
                    className="input-field"
                    placeholder="25"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Локация
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    className="input-field"
                    placeholder="Бишкек, Кыргызстан"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Телефон
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="input-field"
                    placeholder="+996700123456"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="telegram" className="block text-sm font-medium text-gray-700 mb-1">
                    Telegram
                  </label>
                  <input
                    id="telegram"
                    name="telegram"
                    type="text"
                    className="input-field"
                    placeholder="@username"
                    value={formData.telegram}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram
                  </label>
                  <input
                    id="instagram"
                    name="instagram"
                    type="text"
                    className="input-field"
                    placeholder="username"
                    value={formData.instagram}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  О себе
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="4"
                  className="input-field resize-none"
                  placeholder="Расскажите о себе, своем опыте и интересах"
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                  Навыки
                </label>
                <input
                  id="skills"
                  name="skills"
                  type="text"
                  className="input-field"
                  placeholder="JavaScript, React, Node.js (через запятую)"
                  value={formData.skills}
                  onChange={handleChange}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Перечислите свои навыки через запятую
                </p>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setError('');
                  }}
                  className="btn-secondary"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Сохранение...' : 'Сохранить изменения'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
