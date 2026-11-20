/** Distinct cinema/film photos used across the public UI. Do not reuse paths. */
export const SITE_IMAGES = {
  homeHero: '/images/home-hero.jpg',
  homePromo: '/images/home-promo.jpg',
  homeBrowseCategories: '/images/home-browse-categories.jpg',
  homeBrowseGenres: '/images/home-browse-genres.jpg',
  bannerMovies: '/images/banner-movies.jpg',
  bannerCategories: '/images/banner-categories.jpg',
  bannerGenres: '/images/banner-genres.jpg',
  bannerCategoryDetail: '/images/banner-category-detail.jpg',
  bannerGenreDetail: '/images/banner-genre-detail.jpg',
};

/** Home hero backgrounds rotate every 10s (unique paths only). */
export const HERO_SLIDES = [
  '/images/home-hero.jpg',
  '/images/hero-slide-2.jpg',
  '/images/hero-slide-3.jpg',
  '/images/hero-slide-4.jpg',
  '/images/hero-slide-5.jpg',
];

const CATEGORY_TILES = {
  Hollywood: '/images/tile-hollywood.jpg',
  Bollywood: '/images/tile-bollywood.jpg',
  Animation: '/images/tile-animation.jpg',
  Documentary: '/images/tile-documentary.jpg',
  Independent: '/images/tile-independent.jpg',
};

const GENRE_TILES = {
  Action: '/images/tile-action.jpg',
  Comedy: '/images/tile-comedy.jpg',
  Drama: '/images/tile-drama.jpg',
  Horror: '/images/tile-horror.jpg',
  'Sci-Fi': '/images/tile-scifi.jpg',
  Romance: '/images/tile-romance.jpg',
  Thriller: '/images/tile-thriller.jpg',
  Adventure: '/images/tile-adventure.jpg',
};

const CATEGORY_FALLBACKS = Object.values(CATEGORY_TILES);
const GENRE_FALLBACKS = Object.values(GENRE_TILES);

export function categoryTileImage(category, index = 0) {
  if (category?.name && CATEGORY_TILES[category.name]) {
    return CATEGORY_TILES[category.name];
  }
  return CATEGORY_FALLBACKS[index % CATEGORY_FALLBACKS.length];
}

export function genreTileImage(genre, index = 0) {
  if (genre?.name && GENRE_TILES[genre.name]) {
    return GENRE_TILES[genre.name];
  }
  return GENRE_FALLBACKS[index % GENRE_FALLBACKS.length];
}
