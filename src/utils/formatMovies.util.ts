/* eslint-disable operator-linebreak */
/* eslint-disable max-lines-per-function */
import {
  IMovieDetails,
  IMovieDetailsWithImgLinks,
  IMovieInfo,
  IMovieInfoWithImgLinks,
} from '../interfaces/IMoviesAPI';

class FormatMovies {
  addImgLinksToAllMovies = (moviesArray: IMovieInfo[]): IMovieInfoWithImgLinks[] => {
    const moviesWithImgLinks = moviesArray.map((movie) => ({
      ...movie,
      backdropImgLink: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
      posterImgLink: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
    }));

    return moviesWithImgLinks;
  };

  addImgLinksToMovieDetails = (movieDetails: IMovieDetails): IMovieDetailsWithImgLinks => {
    const backdrops = movieDetails.images.backdrops.map((image) => ({
      ...image,
      imgLink: `https://image.tmdb.org/t/p/original${image.file_path}`,
    }));
    const logos = movieDetails.images.logos.map((image) => ({
      ...image,
      imgLink: `https://image.tmdb.org/t/p/original${image.file_path}`,
    }));
    const posters = movieDetails.images.posters.map((image) => ({
      ...image,
      imgLink: `https://image.tmdb.org/t/p/original${image.file_path}`,
    }));

    const images = { backdrops, logos, posters };

    const MovieDetailsWithLinks: IMovieDetailsWithImgLinks = Object.assign(movieDetails, {
      backdropImgLink: `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`,
      images,
    });

    return MovieDetailsWithLinks;
  };
}

export default new FormatMovies();
