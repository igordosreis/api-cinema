/* eslint-disable max-lines-per-function */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { IMoviesResults } from '../interfaces/IMoviesAPI';

class SearchMovies {
  findByGenreAndTitle = (
    movies: IMoviesResults,
    genreId: string | undefined,
    titleQuery: string | undefined,
  ): Omit<IMoviesResults, 'page' | 'total_pages'> => {
    // console.log('movies.results: ', movies.results);

    const filteredByTitle = titleQuery
      ? movies.results.filter(
        ({ title, original_title }) =>
          title.toLowerCase().includes(titleQuery.toLowerCase())
          || original_title.toLowerCase().includes(titleQuery.toLowerCase()),
      )
      : movies.results;

    const filteredMovies = genreId
      ? filteredByTitle.filter(({ genre_ids }) =>
        genre_ids.some((genre) => Number(genre) === Number(genreId)))
      : filteredByTitle;

    return {
      total_results: filteredMovies.length,
      results: filteredMovies,
    };
  };
}

export default new SearchMovies();
