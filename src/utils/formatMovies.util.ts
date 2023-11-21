import {
  IMovieDetails,
  // IMovieDetailsWithImgLinks,
  IMovieInfo,
  // IMovieInfoWithImgLinks,
} from '../interfaces/IMoviesAPI';

class FormatMovies {
  addImgLinksToAllMovies = (moviesArray: IMovieInfo[]): IMovieInfo[] => {
    const moviesWithImgLinks = moviesArray.map((movie) => ({
      ...movie,
      backdrop_path: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
      poster_path: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
    }));

    return moviesWithImgLinks;
  };

  addImgLinksToMovieDetails = (movieDetails: IMovieDetails): IMovieDetails => {
    const backdrops = movieDetails.images.backdrops.map((image) => ({
      ...image,
      file_path: `https://image.tmdb.org/t/p/original${image.file_path}`,
    }));
    const logos = movieDetails.images.logos.map((image) => ({
      ...image,
      file_path: `https://image.tmdb.org/t/p/original${image.file_path}`,
    }));
    const posters = movieDetails.images.posters.map((image) => ({
      ...image,
      file_path: `https://image.tmdb.org/t/p/original${image.file_path}`,
    }));

    const images = { backdrops, logos, posters };

    const MovieDetailsWithLinks: IMovieDetails = Object.assign(movieDetails, {
      backdrop_path: `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`,
      images,
    });

    return MovieDetailsWithLinks;
  };

  addYoutubeLinksToMovieDetails = (movieDetails: IMovieDetails): IMovieDetails => {
    const results = movieDetails.videos.results.map((video) => {
      const { key, ...newVideoObj } = video;

      const youtubeLink = `https://www.youtube.com/watch?v=${key}`;
      newVideoObj.youtubeLink = youtubeLink;

      return newVideoObj;
    });

    const MovieDetailsWithLinks = Object.assign(movieDetails, { videos: results });

    return MovieDetailsWithLinks;
  };
}

export default new FormatMovies();
