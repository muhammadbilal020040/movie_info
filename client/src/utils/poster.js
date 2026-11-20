import { API_BASE } from './constants';

export const PLACEHOLDER_POSTER = '/placeholder-poster.svg';

export function getPosterUrl(posterPath) {
  if (!posterPath) return PLACEHOLDER_POSTER;
  if (posterPath.startsWith('http')) return posterPath;
  return `${API_BASE}/${posterPath.replace(/^\//, '')}`;
}
