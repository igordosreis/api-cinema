/* eslint-disable operator-linebreak */
/* eslint-disable max-len */
import 'dotenv/config';

// TMDB API

// TMDB API_KEY
const { API_KEY } = process.env;

// TMDB URLs & ENDPOINTS
// DISCOVER
export const URL_BASE_DISCOVER = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&include_adult=false&include_video=false&language=pt-BR&region=BR&page=1&with_release_type=2|3`;
export const RELEASE_DATE_START = '&release_date.gte=';
export const RELEASE_DATE_END = '&release_date.lte=';
export const SORT_BY_POPULARITY_DESC = '&sort_by=popularity.desc'; // API default behaviour
export const SORT_BY_RELEASE_DATE_ASC = '&primary_release_date.asc';

// MOVIE DETAILS
export const URL_BASE_DETAILS = 'https://api.themoviedb.org/3/movie/';
export const DETAILS_AUTH_AND_APPEND = `?api_key=${API_KEY}&language=pt-BR&region=BR&append_to_response=videos,images,credits&include_image_language=pt,null`;

// GENRE LIST
export const URL_BASE_GENRE = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;
export const LANGUAGE_PT_BR = '&language=pt-br';
