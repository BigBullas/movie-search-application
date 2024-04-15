import React, { useEffect, useState } from 'react';
import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';
import { useParams } from 'react-router-dom';
import { api } from '../../api';
import { MovieDtoV14 } from '../../api/Api';

// import styles from './MoviesPage.module.scss';

// console.log(styles);

// type Props = {
//   changeBreadcrump: Function;
// };

// name description (/shortDescription) rating.imdb(kp) backdrop.url alternativeName ageRating persons(name, id, photo)

// https://api.kinopoisk.dev/v1.4/review - отзывы по movieId с пагинацией

// сериал или нет isSeries seasonsInfo (episodesCount number) seriesLength

// https://api.kinopoisk.dev/v1.4/season - эпизоды и серии по movieId с пагинацией

// https://api.kinopoisk.dev/v1.4/image - постеры, отображение которых показать в виде карусели

// similarMovies - похожие фильмы или сериалы в виде карусели и ссылок на такой фильм

const SingleMoviePage: React.FC = () => {
  const { id: strId } = useParams<string>();
  const id = Number(strId);

  const [currentMovie, setCurrentMovie] = useState<MovieDtoV14>({});

  const requestMovie = async () => {
    const response = await api.v14.movieControllerFindOneV14(id);
    console.log(response.data);
    setCurrentMovie(response.data);
  };

  useEffect(() => {
    requestMovie();
  }, [id]);

  const onChange: PaginationProps['onChange'] = (pageNumber) => {
    console.log('Page: ', pageNumber);
  };

  return (
    <div>
      <div>
        <div>{currentMovie.name}</div>
        <div>{currentMovie.alternativeName}</div>
        <div>{currentMovie.ageRating}</div>
        <div>{currentMovie.description}</div>
        <div>{currentMovie.shortDescription}</div>
        <div>{currentMovie.rating?.imdb}</div>
        <div>{currentMovie.backdrop?.url}</div>
        {currentMovie.persons?.map((item, index) => {
          return (
            <p key={index}>
              {String(item.id)} {item.name} {item.photo}
            </p>
          );
        })}
        <div>{String(currentMovie.isSeries)}</div>
        <div>
          {currentMovie.seasonsInfo?.map((item, index) => (
            <p key={index}>
              {String(item.episodesCount)} {String(item.number)}
            </p>
          ))}
        </div>
        {currentMovie.similarMovies?.map((item, index) => (
          <p key={index}>{item.name}</p>
        ))}
      </div>
      <div>
        <Pagination
          showQuickJumper
          defaultCurrent={2}
          total={500}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default SingleMoviePage;
