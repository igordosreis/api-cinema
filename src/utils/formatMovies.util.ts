/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable max-lines-per-function */
import {
  CastMember,
  CrewMember,
  IGenreList,
  IMovieDetails,
  // IMovieDetailsWithImgLinks,
  IMovieInfo,
  // IMovieInfoWithImgLinks,
} from '../interfaces/IMoviesAPI';
import fetchMoviesAPIUtil from './fetchMoviesAPI.util';

interface formatMoviesParams {
  moviesArray: IMovieInfo[];
  isRandomized?: boolean;
  isSorted?: boolean;
}

class FormatMovies {
  private sortByReleaseDate = (moviesArray: IMovieInfo[]): IMovieInfo[] => {
    const sortedMoviesByReleaseDate = moviesArray.sort(
      (movieA, movieB) =>
        new Date(movieA.release_date).getTime() - new Date(movieB.release_date).getTime(),
    );

    return sortedMoviesByReleaseDate;
  };

  private addImgLinksToAllMovies = (moviesArray: IMovieInfo[]): IMovieInfo[] => {
    const moviesWithImgLinks = moviesArray.map((movie) => ({
      ...movie,
      backdrop_path: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
      poster_path: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
    }));

    return moviesWithImgLinks;
  };

  private addGenresNamesToAllMovies = async (moviesArray: IMovieInfo[]) => {
    const genresList: IGenreList | undefined = await fetchMoviesAPIUtil.fetchGenres();
    if (genresList) {
      const { genres } = genresList;
      const moviesWithParsedGenres = moviesArray.map((movie) => {
        const parsedGenres = movie.genre_ids.map((movieGenreId) => {
          const currentGenreObject = genres.find((genre) => genre.id === movieGenreId);

          return currentGenreObject;
        });

        return {
          ...movie,
          genre_ids: parsedGenres,
        };
      });

      return moviesWithParsedGenres;
    }
  };

  formatAllMovies = async ({
    moviesArray,
    isRandomized,
    isSorted,
  }: formatMoviesParams): Promise<IMovieInfo[] | undefined> => {
    if (isRandomized) {
      const allMoviesWithImgLinks = this.addImgLinksToAllMovies(moviesArray).sort(
        () => Math.random() - 0.5,
      );
      const allMoviesWithLinksAndGenres = await this.addGenresNamesToAllMovies(
        allMoviesWithImgLinks,
      );

      return allMoviesWithLinksAndGenres;
    }

    if (isSorted) {
      const allMoviesWithImgLinks = this.addImgLinksToAllMovies(moviesArray);
      const sortedAllMoviesWithImgLinks = this.sortByReleaseDate(allMoviesWithImgLinks);
      const allMoviesWithLinksAndGenres = await this.addGenresNamesToAllMovies(
        sortedAllMoviesWithImgLinks,
      );

      return allMoviesWithLinksAndGenres;
    }

    const allMoviesWithImgLinks = this.addImgLinksToAllMovies(moviesArray);
    const allMoviesWithLinksAndGenres = await this.addGenresNamesToAllMovies(allMoviesWithImgLinks);

    return allMoviesWithLinksAndGenres;
  };

  private sliceFiveFromCastDetails = (cast: CastMember[]) => cast.slice(0, 5);

  private filterCrewForDirectorAndProducers = (crew: CrewMember[]) =>
    crew.filter(
      ({ job }) => job === 'Director' || job === 'Producer' || job === 'Executive Producer',
    );

  private addImgLinksToMovieDetails = (movieDetails: IMovieDetails): IMovieDetails => {
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

    const movieDetailsWithImageLinks: IMovieDetails = Object.assign(movieDetails, {
      backdrop_path: `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`,
      images,
      credits,
    });

    return movieDetailsWithImageLinks;
  };

  private addYoutubeLinksToMovieDetails = (movieDetails: IMovieDetails): IMovieDetails => {
    const results = movieDetails.videos.results.map((video) => {
      const { key, ...newVideoObj } = video;

      const youtubeLink = `https://www.youtube.com/watch?v=${key}`;
      newVideoObj.youtubeLink = youtubeLink;

      return newVideoObj;
    });

    const movieDetailsWithYoutubeLinks: IMovieDetails = Object.assign(movieDetails, {
      videos: results,
    });

    return movieDetailsWithYoutubeLinks;
  };

  formatMovieDetails = (movieDetails: IMovieDetails): IMovieDetails => {
    const movieDetailsWithImageLinks = this.addImgLinksToMovieDetails(movieDetails);
    const movieDetailsWithImageAndYoutubeLinks = this.addYoutubeLinksToMovieDetails(
      movieDetailsWithImageLinks,
    );

    return movieDetailsWithImageAndYoutubeLinks;
  };
}

export default new FormatMovies();
