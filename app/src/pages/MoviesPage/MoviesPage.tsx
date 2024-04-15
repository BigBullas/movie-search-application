import React, { useEffect, useState } from 'react';
import type { PaginationProps } from 'antd';
import { Card, Pagination } from 'antd';
const { Meta } = Card;
import { api } from '../../api';
import { MovieDtoV14 } from '../../api/Api';

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
      <div>
        {moviesList &&
          moviesList.map((item) => {
            return (
              <Card
                key={item.id}
                hoverable
                style={{ width: 240 }}
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
            );
          })}
        <Card
          hoverable
          style={{ width: 240 }}
          cover={
            <img
              alt="example"
              src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
            />
          }
        >
          <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>
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
