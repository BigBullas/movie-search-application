import React, { useEffect, useState } from 'react';
import type { PaginationProps } from 'antd';
import { Card, Pagination } from 'antd';
const { Meta } = Card;
import { api } from '../../api';
import { MovieDtoV14 } from '../../api/Api';
import { Link } from 'react-router-dom';

// import styles from './MoviesPage.module.scss';

// console.log(styles);

// type Props = {
//   changeBreadcrump: Function;
// };

const MoviesPage: React.FC = () => {
  const [moviesList, setMoviesList] = useState<MovieDtoV14[]>([]);
  const onChange: PaginationProps['onChange'] = (pageNumber) => {
    console.log('Page: ', pageNumber);
  };

  const requestMoviesList = async () => {
    const response = await api.v14.movieControllerFindManyByQueryV14({
      page: 1,
      limit: 10,
    });
    setMoviesList(response.data.docs);
    console.log(response.data);
  };

  useEffect(() => {
    requestMoviesList();
  }, []);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: '1em',
          flexWrap: 'wrap',
          padding: '1em',
        }}
      >
        {moviesList &&
          moviesList.map((item) => {
            return (
              <Link to={`/film/${item.id}`} key={item.id}>
                <Card
                  key={item.id}
                  hoverable
                  style={{ width: 240, cursor: 'pointer' }}
                  cover={
                    <img
                      alt={item.alternativeName ?? item.name ?? 'someMoviesImg'}
                      src={item.poster?.url ?? ''}
                    />
                  }
                >
                  <Meta
                    title={item.name}
                    description={`Рейтинг: ${String(item.rating?.kp)} Ограничение: ${String(item.ageRating)}`}
                  />
                </Card>
              </Link>
            );
          })}
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

export default MoviesPage;
