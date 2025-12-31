import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IssuerDirectory = () => {
  const [issuers, setIssuers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [copiedDID, setCopiedDID] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchIssuers();
  }, [searchTerm, selectedCategory, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/directory/categories`);
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchIssuers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: 9
      };
      
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;

      const response = await axios.get(`${API_URL}/api/directory/issuers`, { params });
      
      if (response.data.success) {
        setIssuers(response.data.data);
        setTotalPages(response.data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching issuers:', error);
      setError('Failed to load issuers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyDID = async (did) => {
    try {
      await navigator.clipboard.writeText(did);
      setCopiedDID(did);
      setTimeout(() => setCopiedDID(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setCurrentPage(1);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Issuer Directory</h1>
        <p style={styles.subtitle}>Find trusted credential issuers</p>
      </div>

      {/* Search & Filter */}
      <div style={styles.searchContainer}>
        <div style={styles.searchRow}>
          <div style={styles.searchInputWrapper}>
            <input
              type="text"
              placeholder="Search by name, organization, or category..."
              value={searchTerm}
              onChange={handleSearch}
              style={styles.searchInput}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            style={styles.categorySelect}
          >
            <option value="">All Categories</option>
            <option value="Education">Education</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Government">Government</option>
            <option value="Finance">Finance</option>
            <option value="Technology">Technology</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {(searchTerm || selectedCategory) && (
          <div style={styles.activeFilters}>
            <span style={styles.filterLabel}>Active filters:</span>
            {searchTerm && (
              <span style={styles.filterBadge}>Search: {searchTerm}</span>
            )}
            {selectedCategory && (
              <span style={styles.filterBadge}>{selectedCategory}</span>
            )}
            <button onClick={resetFilters} style={styles.clearButton}>
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Loading issuers...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={styles.error}>
          <p>{error}</p>
          <button onClick={fetchIssuers} style={styles.retryButton}>Retry</button>
        </div>
      )}

      {/* Issuers Grid */}
      {!loading && !error && (
        <>
          <div style={styles.grid}>
            {issuers.map((issuer) => (
              <div key={issuer._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.categoryBadge}>{issuer.category || 'Other'}</span>
                </div>

                <div style={styles.cardBody}>
                  <h3 style={styles.issuerName}>{issuer.name}</h3>

                  <div style={styles.infoRow}>
                    <span style={styles.icon}>🏢</span>
                    <span style={styles.infoText}>{issuer.organization || 'N/A'}</span>
                  </div>

                  <div style={styles.infoRow}>
                    <span style={styles.icon}>📧</span>
                    <span style={styles.infoText}>{issuer.email}</span>
                  </div>

                  <p style={styles.description}>
                    {issuer.description || 'No description available'}
                  </p>

                  <div style={styles.statsBox}>
                    <div style={styles.statNumber}>
                      {issuer.issuedCredentialsCount?.toLocaleString() || 0}
                    </div>
                    <div style={styles.statLabel}>Credentials Issued</div>
                  </div>

                  <div style={styles.didSection}>
                    <label style={styles.didLabel}>Issuer DID</label>
                    <div style={styles.didRow}>
                      <code style={styles.didCode}>{issuer.did}</code>
                      <button
                        onClick={() => copyDID(issuer.did)}
                        style={{
                          ...styles.copyButton,
                          ...(copiedDID === issuer.did ? styles.copyButtonSuccess : {})
                        }}
                        title="Copy DID"
                      >
                        {copiedDID === issuer.did ? '✓' : '📋'}
                      </button>
                    </div>
                  </div>

                  <button style={styles.requestButton}>
                    Request Credential
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{...styles.paginationButton, ...(currentPage === 1 ? styles.paginationButtonDisabled : {})}}
              >
                ← Previous
              </button>

              <div style={styles.pageNumbers}>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    style={{
                      ...styles.pageNumber,
                      ...(currentPage === i + 1 ? styles.pageNumberActive : {})
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                style={{...styles.paginationButton, ...(currentPage === totalPages ? styles.paginationButtonDisabled : {})}}
              >
                Next →
              </button>
            </div>
          )}

          {/* No Results */}
          {!loading && issuers.length === 0 && (
            <div style={styles.noResults}>
              <div style={styles.noResultsIcon}>🔍</div>
              <h3 style={styles.noResultsTitle}>No issuers found</h3>
              <p style={styles.noResultsText}>Try adjusting your search or filters</p>
              <button onClick={resetFilters} style={styles.clearFiltersButton}>
                Clear Filters
              </button>
            </div>
          )}
        </>
      )}

      {/* Copy Notification */}
      {copiedDID && (
        <div style={styles.toast}>
          ✓ DID copied to clipboard!
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '32px 16px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b7280'
  },
  searchContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
    maxWidth: '1200px',
    margin: '0 auto 24px'
  },
  searchRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '16px'
  },
  searchInputWrapper: {
    position: 'relative'
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px'
  },
  categorySelect: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: 'white',
    cursor: 'pointer'
  },
  activeFilters: {
    marginTop: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap'
  },
  filterLabel: {
    fontSize: '14px',
    color: '#6b7280'
  },
  filterBadge: {
    padding: '4px 12px',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '9999px',
    fontSize: '14px'
  },
  clearButton: {
    marginLeft: 'auto',
    padding: '4px 12px',
    background: 'none',
    border: 'none',
    color: '#3b82f6',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  loading: {
    textAlign: 'center',
    padding: '48px 0',
    color: '#6b7280'
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #e5e7eb',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    margin: '0 auto 16px',
    animation: 'spin 1s linear infinite'
  },
  error: {
    textAlign: 'center',
    padding: '48px',
    backgroundColor: '#fee2e2',
    borderRadius: '8px',
    maxWidth: '600px',
    margin: '0 auto'
  },
  retryButton: {
    marginTop: '16px',
    padding: '8px 24px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
    maxWidth: '1200px',
    margin: '0 auto 24px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  cardHeader: {
    background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
    padding: '12px 16px'
  },
  categoryBadge: {
    color: 'white',
    fontWeight: '600',
    fontSize: '14px'
  },
  cardBody: {
    padding: '20px'
  },
  issuerName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '12px'
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#6b7280'
  },
  icon: {
    fontSize: '16px'
  },
  infoText: {
    fontSize: '14px'
  },
  description: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '16px',
    lineHeight: '1.5'
  },
  statsBox: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '12px',
    textAlign: 'center',
    marginBottom: '16px'
  },
  statNumber: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#3b82f6'
  },
  statLabel: {
    fontSize: '12px',
    color: '#6b7280'
  },
  didSection: {
    marginBottom: '16px'
  },
  didLabel: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: '4px'
  },
  didRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  didCode: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: '4px',
    padding: '6px 8px',
    fontSize: '11px',
    fontFamily: 'monospace',
    color: '#1f2937',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  copyButton: {
    padding: '6px 12px',
    backgroundColor: '#e5e7eb',
    color: '#1f2937',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  copyButtonSuccess: {
    backgroundColor: '#10b981',
    color: 'white'
  },
  requestButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '32px'
  },
  paginationButton: {
    padding: '8px 16px',
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  paginationButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  pageNumbers: {
    display: 'flex',
    gap: '8px'
  },
  pageNumber: {
    width: '40px',
    height: '40px',
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  pageNumberActive: {
    backgroundColor: '#3b82f6',
    color: 'white',
    borderColor: '#3b82f6'
  },
  noResults: {
    textAlign: 'center',
    padding: '48px',
    backgroundColor: 'white',
    borderRadius: '8px',
    maxWidth: '600px',
    margin: '0 auto'
  },
  noResultsIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  noResultsTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '8px'
  },
  noResultsText: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '16px'
  },
  clearFiltersButton: {
    padding: '8px 24px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  toast: {
    position: 'fixed',
    bottom: '32px',
    right: '32px',
    backgroundColor: '#10b981',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    zIndex: 1000
  }
};

export default IssuerDirectory;