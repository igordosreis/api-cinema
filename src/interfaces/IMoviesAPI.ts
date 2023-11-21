/* eslint-disable camelcase */
export type IMoviesResults = {
  page: number;
  results: IMovieInfo[];
  total_pages: number;
  total_results: number;
};

export type IMoviesResultsWithLinks = {
  page: number;
  results: IMovieInfoWithImgLinks[];
  total_pages: number;
  total_results: number;
};

export interface IMovieInfo {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string; // Assuming the release_date is always in "YYYY-MM-DD" format
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface IMovieInfoWithImgLinks extends IMovieInfo {
  backdropImgLink: string;
  posterImgLink: string;
}

interface Genre {
  id: number;
  name: string;
}

interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

interface Video {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

interface Image {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

interface ImageWithLinks extends Image {
  imgLink: string;
}

interface Videos {
  results: Video[];
}

interface Images {
  backdrops: Image[];
  logos: Image[];
  posters: Image[];
}

interface ImagesWithLinks {
  backdrops: ImageWithLinks[];
  logos: ImageWithLinks[];
  posters: ImageWithLinks[];
}

export interface IMovieDetails {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: null | any; // Adjust this based on the actual type
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  videos: Videos;
  images: Images;
}

export interface IMovieDetailsWithImgLinks extends Omit<IMovieDetails, 'Images'> {
  backdropImgLink: string;
  images: ImagesWithLinks;
}
