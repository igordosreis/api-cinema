/* eslint-disable operator-linebreak */
/* eslint-disable max-len */
import 'dotenv/config';

// NUMBERS
export const PAGE_NUMBER_DEFAULT = 0;
export const LIMIT_NUMBER_DEFAULT = 20;
export const MAX_DAYS_REMAINING = 30;

// STRINGS

// -- ORDER STATUS
export const STATUS_WAITING = 'waiting';
export const STATUS_PAID = 'paid';
export const STATUS_CANCELLED = 'cancelled';
export const STATUS_EXPIRED = 'expired';

// -- ERROR MSGS
export const OPERATION_UNAVAILABLE = 'Operacão indisponível.';

// TMDB API

// -- TMDB API_KEY
export const { API_KEY } = process.env;

// -- TMDB URLs & ENDPOINTS
// -- -- TMDB DISCOVER
export const TMDB_URL_BASE_DISCOVER = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&include_adult=false&include_video=false&language=pt-BR&region=BR&page=1&with_release_type=2|3&include_video=true`;
export const RELEASE_DATE_START = '&release_date.gte=';
export const RELEASE_DATE_END = '&release_date.lte=';
export const SORT_BY_POPULARITY_DESC = '&sort_by=popularity.desc'; // API default behaviour
export const SORT_BY_RELEASE_DATE_ASC = '&primary_release_date.asc';

// -- -- TMDB MOVIE DETAILS
export const TMDB_URL_BASE_DETAILS = 'https://api.themoviedb.org/3/movie/';
export const DETAILS_AUTH_AND_APPEND = `?api_key=${API_KEY}&language=pt-BR&region=BR&append_to_response=videos,images,credits&include_image_language=pt,null`;

// -- -- TMDB GENRE LIST
export const TMDB_URL_BASE_GENRE = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;
export const LANGUAGE_PT_BR = '&language=pt-br';

// SUPERAPP

// -- SUPERAPP BEARER_TOKEN
export const { BEARER_TOKEN } = process.env;

// -- SUPERAPP URLs & ENDPOINTS
export const SUPERAPP_BASE_URL = 'https://node.clubecerto.com.br/superapp';

// -- -- SUPERAPP CINEMA
export const SUPERAPP_CINEMA_BASE_URL = 'https://node.clubecerto.com.br/superapp/cinema';

// -- -- SUPERAPP AUTH
export const SUPERAPP_URL_BASE_AUTH =
  'https://node.clubecerto.com.br/superapp/microservices/validations/cinema';

// -- -- SUPERAPP PAYMENT MICROSERVICE
export const CREATE_PAYMENT_URL = 'https://node.clubecerto.com.br/superapp/microservices/payment/';
export const EMAIL_WEBHOOK_MOCK =
  'https://node.clubecerto.com.br/superapp/webhook/mocks/email/igor';
