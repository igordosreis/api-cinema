/* eslint-disable max-lines-per-function */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { IMoviesResults } from '../interfaces/IMoviesAPI';

interface SearchMoviesParams {
  moviesNowPlaying: IMoviesResults,
  moviesPremieres: IMoviesResults,
  moviesUpcoming: IMoviesResults,
  genreId: string | undefined,
  titleQuery: string | undefined,
}

class SearchMovies {
  findByGenreAndTitle = ({
    moviesNowPlaying,
    moviesPremieres,
    moviesUpcoming,
    genreId,
    titleQuery,
  }: SearchMoviesParams): Omit<IMoviesResults, 'page' | 'total_pages'> => {
    const allMovies = [
      ...moviesNowPlaying.results, 
      ...moviesPremieres.results, 
      ...moviesUpcoming.results,
    ];

    const allMoviesWithoutDuplicates = allMovies.filter((movie, index) => (
      index === allMovies.findIndex((movieCheck) => movie.id === movieCheck.id)
    ));

    const allMoviesFilteredByTitle = titleQuery
      ? allMoviesWithoutDuplicates.filter(
        ({ title, original_title }) =>
          title.toLowerCase().includes(titleQuery.toLowerCase())
          || original_title.toLowerCase().includes(titleQuery.toLowerCase()),
      )
      : allMoviesWithoutDuplicates;

    const allMoviesFilteredByTitleAndGenre = genreId
      ? allMoviesFilteredByTitle.filter(({ genre_ids }) =>
        genre_ids.some((genre) => Number(genre) === Number(genreId)))
      : allMoviesFilteredByTitle;

    return {
      total_results: allMoviesFilteredByTitleAndGenre.length,
      results: allMoviesFilteredByTitleAndGenre,
    };
  };
}

export default new SearchMovies();
