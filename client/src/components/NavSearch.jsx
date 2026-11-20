import { useCallback, useEffect, useRef, useState } from 'react';
import api from '../services/api';
import { IconSearch } from './icons';
import SearchOverlay from './SearchOverlay';

const DEBOUNCE_MS = 280;
const TOP_LIMIT = 8;

export default function NavSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exactMatch, setExactMatch] = useState(true);
  const [message, setMessage] = useState(null);
  const [showingTop, setShowingTop] = useState(false);
  const requestId = useRef(0);
  const topCache = useRef(null);

  const closeOverlay = useCallback(() => {
    setOpen(false);
  }, []);

  const openOverlay = useCallback(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const trimmed = query.trim();
    const currentId = ++requestId.current;

    if (!trimmed) {
      setShowingTop(true);
      setExactMatch(true);
      setMessage(null);

      if (topCache.current) {
        setResults(topCache.current);
        setLoading(false);
        return undefined;
      }

      setLoading(true);
      api
        .get('/api/movies')
        .then((res) => {
          if (currentId !== requestId.current) return;
          const top = (res.data.data || []).slice(0, TOP_LIMIT);
          topCache.current = top;
          setResults(top);
        })
        .catch(() => {
          if (currentId !== requestId.current) return;
          setResults([]);
        })
        .finally(() => {
          if (currentId === requestId.current) setLoading(false);
        });

      return undefined;
    }

    setShowingTop(false);
    setLoading(true);

    const timer = window.setTimeout(() => {
      api
        .get('/api/movies', { params: { q: trimmed } })
        .then((res) => {
          if (currentId !== requestId.current) return;
          setResults(res.data.data || []);
          setExactMatch(res.data.exactMatch !== false);
          setMessage(res.data.message || null);
        })
        .catch(() => {
          if (currentId !== requestId.current) return;
          setResults([]);
          setExactMatch(true);
          setMessage(null);
        })
        .finally(() => {
          if (currentId === requestId.current) setLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [query, open]);

  return (
    <>
      <div className="nav-search">
        <label className="visually-hidden" htmlFor="nav-search-input">Search movies</label>
        <span className="nav-search-icon" aria-hidden="true">
          <IconSearch size={15} />
        </span>
        <input
          id="nav-search-input"
          type="search"
          className="nav-search-input"
          placeholder="Search movies..."
          value={query}
          onFocus={openOverlay}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              openOverlay();
            }
          }}
          autoComplete="off"
        />
      </div>

      <SearchOverlay
        open={open}
        query={query}
        onQueryChange={(value) => {
          setQuery(value);
          setOpen(true);
        }}
        onClose={closeOverlay}
        results={results}
        loading={loading}
        exactMatch={exactMatch}
        message={message}
        showingTop={showingTop}
      />
    </>
  );
}
