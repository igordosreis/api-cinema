/* eslint-disable operator-linebreak */
/* eslint-disable max-len */
import 'dotenv/config';

// TMDB API
// TMDB API_KEY
const { API_KEY } = process.env;

// TMDB URLs & ENDPOINTS
export const URL_BASE = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&include_adult=false&include_video=false&language=pt-BR&region=BR&page=1&with_release_type=2|3`;
export const RELEASE_DATE_START = '&release_date.gte=';
export const RELEASE_DATE_END = '&release_date.lte=';
export const SORT_BY_POPULARITY = '&sort_by=popularity.desc';
