import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'personalcinema.mediaItems';
const today = () => new Date().toISOString().slice(0, 10);
const blankForm = () => ({ title: '', type: 'movie', director: '', genre: '', rating: '5', watchDate: today() });

function readItems() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function App() {
  const [items, setItems] = useState(readItems);
  const [form, setForm] = useState(blankForm);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('date');
  const [storageWarning, setStorageWarning] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      setStorageWarning(false);
    } catch {
      setStorageWarning(true);
    }
  }, [items]);

  const highRated = useMemo(() => items.filter((item) => item.rating >= 8), [items]);
  const visibleItems = useMemo(() => items
    .filter((item) => filter === 'all' || item.type === filter)
    .sort((a, b) => sort === 'rating'
      ? b.rating - a.rating
      : sort === 'title'
        ? a.title.localeCompare(b.title)
        : b.watchDate.localeCompare(a.watchDate)), [items, filter, sort]);

  const recommendations = useMemo(() => {
    const mostCommon = (field) => {
      const counts = new Map();
      highRated.forEach((item) => {
        const value = item[field]?.trim();
        if (value) counts.set(value, (counts.get(value) || 0) + 1);
      });
      return [...counts].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([value]) => value);
    };
    return { genres: mostCommon('genre'), directors: mostCommon('director') };
  }, [highRated]);

  function submit(event) {
    event.preventDefault();
    const title = form.title.trim();
    if (!title) return;
    setItems((current) => [{ ...form, title, id: crypto.randomUUID(), rating: Number(form.rating) }, ...current]);
    setForm(blankForm());
  }

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <main className="shell">
      {storageWarning && <div className="storage-warning" role="status">Browser storage is unavailable, so changes will only last while this page is open.</div>}
      <header className="hero">
        <div className="eyebrow">YOUR PERSONAL WATCH JOURNAL</div>
        <h1>Every story, <span>remembered.</span></h1>
        <p>Keep the films and series you love in one thoughtful collection.</p>
        <div className="stats">
          <div><strong>{items.length}</strong><span>Titles logged</span></div>
          <div><strong>{highRated.length}</strong><span>Rated 8 or higher</span></div>
        </div>
      </header>

      <section className="panel">
        <div className="section-heading"><div><div className="eyebrow">THE COLLECTION</div><h2>Add something you watched</h2></div><span className="clapper">✦</span></div>
        <form onSubmit={submit} className="form-grid">
          <label className="wide">Title<input required maxLength="120" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="What did you watch?" /></label>
          <label>Format<select value={form.type} onChange={(e) => update('type', e.target.value)}><option value="movie">Movie</option><option value="series">TV series</option></select></label>
          <label>Your rating <span className="hint">(1–10)</span><input type="number" min="1" max="10" value={form.rating} onChange={(e) => update('rating', e.target.value)} /></label>
          <label>Director<input maxLength="100" value={form.director} onChange={(e) => update('director', e.target.value)} placeholder="Optional" /></label>
          <label>Genre<input maxLength="60" value={form.genre} onChange={(e) => update('genre', e.target.value)} placeholder="Optional" /></label>
          <label>Watched on<input type="date" value={form.watchDate} onChange={(e) => update('watchDate', e.target.value)} /></label>
          <div className="form-action"><button className="primary" type="submit">Add to collection <span>↗</span></button></div>
        </form>
      </section>

      {(recommendations.genres.length > 0 || recommendations.directors.length > 0) && <section className="insight panel">
        <div className="eyebrow">A LITTLE ABOUT YOUR TASTE</div><h2>Your next movie night, inspired by your favorites.</h2>
        <div className="chips">{recommendations.genres.map((genre) => <span key={`g-${genre}`}>Explore more <b>{genre}</b></span>)}{recommendations.directors.map((director) => <span key={`d-${director}`}>Revisit films by <b>{director}</b></span>)}</div>
      </section>}

      <section className="library">
        <div className="library-top"><div><div className="eyebrow">YOUR LIBRARY</div><h2>Watch history <span>{visibleItems.length}</span></h2></div>
          <div className="controls"><label>Show<select value={filter} onChange={(e) => setFilter(e.target.value)}><option value="all">Everything</option><option value="movie">Movies</option><option value="series">Series</option></select></label><label>Order<select value={sort} onChange={(e) => setSort(e.target.value)}><option value="date">Recently watched</option><option value="rating">Top rated</option><option value="title">Title A–Z</option></select></label></div>
        </div>
        {visibleItems.length === 0 ? <div className="empty"><div className="empty-icon">◷</div><h3>Your next favorite starts here.</h3><p>Add a movie or series above to begin your collection.</p></div> : <div className="cards">{visibleItems.map((item) => <article className="movie-card" key={item.id}>
          <div className="poster"><span>{item.type === 'movie' ? 'FILM' : 'SERIES'}</span><strong>{item.title.slice(0, 1).toUpperCase()}</strong></div>
          <div className="card-content"><div className="card-meta"><span>{item.type === 'movie' ? 'MOVIE' : 'TV SERIES'}</span><time dateTime={item.watchDate}>{new Date(`${item.watchDate}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</time></div>
            <h3>{item.title}</h3><div className="detail">{[item.director, item.genre].filter(Boolean).join(' · ') || 'No details added'}</div>
            <div className="card-bottom"><span className="rating">★ <b>{item.rating}</b><small>/10</small></span><button className="delete" onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))} aria-label={`Remove ${item.title}`}>Remove</button></div>
          </div>
        </article>)}</div>}
      </section>
      <footer>Made for people who love a good story <span>✦</span></footer>
    </main>
  );
}

export default App;

