import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Search } from 'lucide-react';
import { alumniAPI } from '../services/api';

const Alumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const debounceRef = useRef(null);

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await alumniAPI.getAllAlumni();
      setAlumni(response.data || []);
    } catch (err) {
      console.error('Error fetching alumni:', err);
      setError('Failed to load alumni. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Debounce search term (300ms)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim());
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchTerm]);

  // Memoized filtered list
  const filteredAlumni = useMemo(() => {
    if (!debouncedTerm) return alumni;
    const q = debouncedTerm.toLowerCase();
    return alumni.filter((person = {}) => {
      const name = (person.name || '').toString().toLowerCase();
      const dept = (person.department || '').toString().toLowerCase();
      const batch = (person.batch ?? '').toString().toLowerCase();
      return (
        name.includes(q) ||
        dept.includes(q) ||
        batch.includes(q)
      );
    });
  }, [alumni, debouncedTerm]);

  const handleConnect = (person) => {
    // placeholder — add real connect logic or modal
    alert(`Connect request sent to ${person.name || 'alumnus'}`);
  };

  const initialsFromName = (name = '') => {
    if (!name) return 'MA';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <section className="space-y-4" aria-labelledby="alumni-heading">
      <div className="flex justify-between items-center">
        <h2 id="alumni-heading" className="text-2xl font-bold text-gray-800">Alumni Directory</h2>

        <div className="flex gap-2 items-center" role="search" aria-label="Search alumni">
          <label htmlFor="alumni-search" className="sr-only">Search alumni</label>
          <input
            id="alumni-search"
            type="text"
            placeholder="Search alumni by name, department or batch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Search alumni by name, department or batch"
          />
          <button
            type="button"
            aria-label="Clear search"
            className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            onClick={() => setSearchTerm('')}
            title="Clear search"
          >
            Clear
          </button>
          <button
            type="button"
            aria-label="Search"
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-200"
            onClick={() => setDebouncedTerm(searchTerm.trim())}
            title="Apply search"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="spinner" role="status" aria-label="Loading alumni"></div>
        </div>
      ) : error ? (
        <div className="text-red-600 p-4 bg-red-50 border border-red-100 rounded">
          {error}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600">
            Showing <strong>{filteredAlumni.length}</strong> {filteredAlumni.length === 1 ? 'result' : 'results'}{debouncedTerm ? ` for “${debouncedTerm}”` : ''}
          </p>

          {filteredAlumni.length === 0 ? (
            <div className="p-8 text-center text-gray-600" aria-live="polite">
              No alumni found. Try a different search or <button type="button" onClick={() => setSearchTerm('')} className="underline">clear search</button>.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Alumni list">
              {filteredAlumni.map((person) => {
                const id = person._id || person.id || person.email || Math.random().toString(36).slice(2, 9);
                return (
                  <article
                    key={id}
                    role="listitem"
                    className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition duration-200"
                    aria-labelledby={`alumni-name-${id}`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                        aria-hidden="true"
                      >
                        {initialsFromName(person.name)}
                      </div>
                      <div>
                        <h3 id={`alumni-name-${id}`} className="font-bold text-gray-800">
                          {person.name || 'Unknown'}
                        </h3>
                        <p className="text-sm text-gray-600">Batch of {person.batch ?? 'N/A'}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">🎓 {person.department || 'N/A'}</p>
                      <p className="text-sm text-gray-700">💼 {person.company || 'N/A'}</p>
                      <p className="text-sm text-gray-700">📧 {person.email || 'N/A'}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleConnect(person)}
                      className="mt-4 w-full bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition duration-200 font-medium"
                      aria-label={`Connect with ${person.name || 'alumnus'}`}
                    >
                      Connect
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Alumni;
