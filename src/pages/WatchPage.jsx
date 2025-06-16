import { useEffect, useState } from "react";
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import translations from '../context/translations.json';
import { fetchWatches } from "../api/watches";
import WatchCard from "../components/WatchCard";
import './WatchPage.css';

function WatchPage() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const [watches, setWatches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [sortBy, setSortBy] = useState("price");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await fetchWatches();
        setWatches(data);
      } catch (e) {
        console.error(t.loadError);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [t.loadError]);

  // Фильтрация по поисковому запросу
  const filteredWatches = watches.filter(watch => {
    const searchLower = searchQuery.toLowerCase();
    return (
      watch.brand.toLowerCase().includes(searchLower) ||
      watch.model.toLowerCase().includes(searchLower) ||
      watch.year.toString().includes(searchLower) ||
      watch.price.toString().includes(searchLower)
    );
  });

  // Сортировка часов
  const sortedWatches = [...filteredWatches].sort((a, b) => {
    if (sortBy === "price") {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    } else if (sortBy === "year") {
      return sortOrder === "asc" ? a.year - b.year : b.year - a.year;
    } else if (sortBy === "brand") {
      return sortOrder === "asc" 
        ? a.brand.localeCompare(b.brand) 
        : b.brand.localeCompare(a.brand);
    } else if (sortBy === "model") {
      return sortOrder === "asc" 
        ? a.model.localeCompare(b.model) 
        : b.model.localeCompare(a.model);
    }
    return 0;
  });

  // Пагинация
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWatches = sortedWatches.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(sortedWatches.length / itemsPerPage);

  return (
    <div className={`watch-page ${theme}`}>
      <h2 className="page-title">{t.catalog1}</h2>
      
      {/* Панель управления с поиском и сортировкой */}
      <div className="controls-container">
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className={`search-input ${theme}`}
        />

        <div className="sort-controls">
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className={`sort-select ${theme}`}
          >
            <option value="price">{t.sortPrice}</option>
            <option value="year">{t.sortYear}</option>
            <option value="brand">{t.sortBrand}</option>
            <option value="model">{t.sortModel}</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setCurrentPage(1);
            }}
            className={`sort-select ${theme}`}
          >
            <option value="asc">{t.sortAsc}</option>
            <option value="desc">{t.sortDesc}</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-spinner"></div>
      ) : (
        <>
          {sortedWatches.length === 0 ? (
            <p className={`no-results ${theme}`}>{t.noResults}</p>
          ) : (
            <>
              <div className="watches-grid">
                {paginatedWatches.map((watch) => (
                  <WatchCard key={watch.id} watch={watch} />
                ))}
              </div>

              {/* Пагинация */}
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className={`pagination-button ${theme} ${currentPage === 1 ? 'disabled' : ''}`}
                >
                  {t.prev}
                </button>
                
                <span className="page-info">
                  {t.page} {currentPage} {t.of} {totalPages || 1}
                </span>

                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`pagination-button ${theme} ${currentPage === totalPages ? 'disabled' : ''}`}
                >
                  {t.next}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default WatchPage;

