/* eslint-disable function-paren-newline */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable max-lines-per-function */
import { DEFAULT_PERSON_IMAGE, MAX_DAYS_REMAINING } from '../constants';
import {
  CastMember,
  CrewMember,
  IGenreInfo,
  IGenreList,
  IMovieDetails,
  IMovieInfo,
} from '../interfaces/IMoviesAPI';
import dateUtils from './date.utils';
import fetchMoviesAPIUtil from './fetchMoviesAPI.util';

type IFormatMoviesParams = {
  moviesArray: IMovieInfo[];
  isSortedByReleaseDate?: boolean;
  isRandomized?: undefined;
} | {
  moviesArray: IMovieInfo[];
  isRandomized?: boolean;
  isSortedByReleaseDate?: undefined;
};

class FormatMovies {
  private sortByReleaseDate = (moviesArray: IMovieInfo[]): IMovieInfo[] => {
    const sortedMoviesByReleaseDate = moviesArray.sort(
      (movieA, movieB) =>
        new Date(movieA.release_date).getTime() - new Date(movieB.release_date).getTime(),
    );

    return sortedMoviesByReleaseDate;
  };

  private parseImgPathToImgLink = (imagePath: string | null): string => {
    const imageLink = `https://image.tmdb.org/t/p/w300${imagePath}`;

    return imageLink;
  };

  private getGenresList = async (): Promise<IGenreInfo[]> => {
    const { genres: genresList }: IGenreList = await fetchMoviesAPIUtil.fetchGenres();

    return genresList;
  };

  private parseGenresNames = (
    genreIds: (number | IGenreInfo)[],
    genresList: IGenreInfo[],
  ): (number | IGenreInfo)[] => {
    const parsedGenres = genreIds.map((movieGenreId) => {
      const currentGenreObject = genresList.find((genre) => genre.id === movieGenreId);

      return currentGenreObject || movieGenreId;
    });

    return parsedGenres;
  };

  private addReleaseInfoToMovie = (
    movie: IMovieInfo | IMovieDetails,
  ): Pick<IMovieInfo, 'isReleased' | 'daysRemainingAsNowPlaying' | 'daysToRelease'>
  | Pick<IMovieDetails, 'isReleased' | 'daysRemainingAsNowPlaying' | 'daysToRelease'> => {
    const currentDate = new Date();
    
    const movieReleaseDate = new Date(movie.release_date);
    const isReleased = currentDate.getTime() >= movieReleaseDate.getTime();
    
    return isReleased
      ? {
        isReleased,
        daysRemainingAsNowPlaying: MAX_DAYS_REMAINING 
          - dateUtils.differenceInDays(movieReleaseDate, currentDate),
      }
      : {
        isReleased,
        daysToRelease: dateUtils.differenceInDays(currentDate, movieReleaseDate),
      };
  };

  private getTopEightPopularMovies = (movies: IMovieInfo[]) => movies.slice(0, 8);

  formatAllMovies = async ({
    moviesArray,
    isRandomized, 
    isSortedByReleaseDate,
  }: IFormatMoviesParams): Promise<IMovieInfo[]> => {
    const genresList = await this.getGenresList();
    const formatedMovies = this.getTopEightPopularMovies(moviesArray).map((movie): IMovieInfo => {
      const formatedMovie = {
        ...movie,
        // backdrop_path: this.parseImgPathToImgLink(movie.backdrop_path),
        poster_path: this.parseImgPathToImgLink(movie.poster_path),
        genre_ids: this.parseGenresNames(movie.genre_ids, genresList),
        ...this.addReleaseInfoToMovie(movie),
      };

      return formatedMovie;
    });

    if (isRandomized) {
      const randomizedFormattedMovies = formatedMovies.sort(() => Math.random() - 0.5);

      return randomizedFormattedMovies;
    }

    if (isSortedByReleaseDate) {
      const sortedFormattedMovies = this.sortByReleaseDate(formatedMovies);

      return sortedFormattedMovies;
    }

    return formatedMovies;
  };

  private getFirstFiveElements = <T>(cast: T[]) => cast.slice(0, 5);

  private filterCrewForDirectorAndProducers = (crew: CrewMember[]) =>
    crew.filter(
      ({ job }) => job === 'Director' || job === 'Producer' || job === 'Executive Producer',
    );

  private addImgLinksToMovieDetails = (movieDetails: IMovieDetails) => {
    const backdrops = movieDetails.images.backdrops.map((image) => ({
      ...image,
      file_path: this.parseImgPathToImgLink(image.file_path),
    }));
    const logos = movieDetails.images.logos.map((image) => ({
      ...image,
      file_path: this.parseImgPathToImgLink(image.file_path),
    }));
    const posters = movieDetails.images.posters.map((image) => ({
      ...image,
      file_path: this.parseImgPathToImgLink(image.file_path),
    }));
    const cast = this.getFirstFiveElements<CastMember>(movieDetails.credits.cast).map((actor) => ({
      ...actor,
      profile_path: actor.profile_path
        ? this.parseImgPathToImgLink(actor.profile_path)
        : DEFAULT_PERSON_IMAGE,
    }));
    const crew = this.filterCrewForDirectorAndProducers(movieDetails.credits.crew).map(
      (crewMember) => ({
        ...crewMember,
        profile_path: crewMember.profile_path
          ? this.parseImgPathToImgLink(crewMember.profile_path)
          : DEFAULT_PERSON_IMAGE,
      }),
    );

    const images = { backdrops, logos, posters };
    const credits = { cast, crew };

    const movieDetailsWithImageLinks = {
      backdrop_path: this.parseImgPathToImgLink(movieDetails.backdrop_path),
      images,
      credits,
    };

    return movieDetailsWithImageLinks;
  };

  private addYoutubeLinksToMovieDetails = (movieDetails: IMovieDetails) => {
    const results = movieDetails.videos.results.map((video) => {
      const { key, ...newVideoObj } = video;

      const youtubeLink = `https://www.youtube.com/watch?v=${key}`;
      newVideoObj.youtubeLink = youtubeLink;

      return newVideoObj;
    });

    return { results };
  };

  private getAgeCertification = (movieDetails: IMovieDetails) => {
    const ageCertification = movieDetails.release_dates?.results.find((movie) => (
      movie.iso_3166_1 === 'BR'
    ))?.release_dates[0].certification;

    return ageCertification || null;
  };

  formatMovieDetails = (movieDetails: IMovieDetails): IMovieDetails => {
    const { release_dates, ...restOfDetails } = movieDetails;
    const movieWithImgYoutubeAndReleaseInfo = {
      ...restOfDetails,
      ...this.addImgLinksToMovieDetails(movieDetails),
      // videos: this.addYoutubeLinksToMovieDetails(movieDetails),
      poster_path: this.parseImgPathToImgLink(movieDetails.poster_path),
      certification: this.getAgeCertification(movieDetails),
      ...this.addReleaseInfoToMovie(movieDetails),
    };

    return movieWithImgYoutubeAndReleaseInfo;
  };

  replaceDotForComma = (distanceString: string): string => distanceString.replace('.', ',');

  formatDistance = (distance: number | null): string => {
    if (!distance) throw new Error('Invalid distance');
    const fixedDistance = distance.toFixed(1);

    const isDistanceBiggerThan1Km = distance >= 1;
    if (isDistanceBiggerThan1Km) {
      return `${fixedDistance.split('.')[0]} km`;
    }
    
    const formattedDistance = `${this.replaceDotForComma(distance.toFixed(1))} km`;
      
    return formattedDistance;
  };

  formatTitle = (title: string): string => {
    const wordsArray = title.trim().split(' ');

    const formattedTitle = wordsArray.reduce((accTitle: string, currWord: string) => {
      const firstLetterUppercase = currWord.charAt(0).toUpperCase();
      const remainingLettersLowercase = currWord.slice(1).toLowerCase();

      const capitalizedWord = firstLetterUppercase + remainingLettersLowercase;

      if (!accTitle) return capitalizedWord;

      return `${accTitle} ${capitalizedWord}`;
    }, '');

    return formattedTitle;
  };
}

export default new FormatMovies();
