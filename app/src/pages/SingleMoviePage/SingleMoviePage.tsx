import React from 'react';
import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';

// import styles from './MoviesPage.module.scss';

// console.log(styles);

// type Props = {
//   changeBreadcrump: Function;
// };

const SingleMoviePage: React.FC = () => {
  const onChange: PaginationProps['onChange'] = (pageNumber) => {
    console.log('Page: ', pageNumber);
  };
  return (
    <div>
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
