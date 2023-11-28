/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable max-lines-per-function */
import {
  CastMember,
  CrewMember,
  IGenreInfo,
  IMovieDetails,
  // IMovieDetailsWithImgLinks,
  IMovieInfo,
  // IMovieInfoWithImgLinks,
} from '../interfaces/IMoviesAPI';

class FormatMovies {
  private sliceFiveFromCastDetails = (cast: CastMember[]) => cast.slice(0, 5);

  private filterCrewForDirectorAndProducers = (crew: CrewMember[]) =>
    crew.filter(
      ({ job }) => job === 'Director' || job === 'Producer' || job === 'Executive Producer',
    );

  addImgLinksToAllMovies = (moviesArray: IMovieInfo[]): IMovieInfo[] => {
    const moviesWithImgLinks = moviesArray.map((movie) => ({
      ...movie,
      backdrop_path: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
      poster_path: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
    }));

    return moviesWithImgLinks;
  };

  addGenresNamesToAllMovies = (moviesArray: IMovieInfo[], genresList: IGenreInfo[]) => {
    const moviesWithParsedGenres = moviesArray.map((movie) => {
      const parsedGenres = movie.genre_ids.map((movieGenreId) => {
        const currentGenreObject = genresList.find((genre) => genre.id === movieGenreId);

        return currentGenreObject;
      });

      const { genre_ids, ...movieInfo } = movie;

      return {
        ...movieInfo,
        genresInfo: parsedGenres,
      };
    });

    return moviesWithParsedGenres;
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
    const cast = this.sliceFiveFromCastDetails(movieDetails.credits.cast).map((actor) => ({
      ...actor,
      profile_path: `https://image.tmdb.org/t/p/original${actor.profile_path}`,
    }));
    const crew = this.filterCrewForDirectorAndProducers(movieDetails.credits.crew).map(
      (crewMember) => ({
        ...crewMember,
        profile_path: `https://image.tmdb.org/t/p/original${crewMember.profile_path}`,
      }),
    );

    const images = { backdrops, logos, posters };
    const credits = { cast, crew };

    const MovieDetailsWithLinks: IMovieDetails = Object.assign(movieDetails, {
      backdrop_path: `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`,
      images,
      credits,
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

    const MovieDetailsWithLinks: IMovieDetails = Object.assign(movieDetails, { videos: results });

    return MovieDetailsWithLinks;
  };
}

export default new FormatMovies();
