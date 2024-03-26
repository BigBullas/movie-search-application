import React from 'react';
import styles from './CustomBreadcrumb.module.scss';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';

console.log(styles);

// type Props = {
//   changeBreadcrump: Function;
// };

const CustomBreadcrumb: React.FC = () => {
  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">
          <UserOutlined />
          <span>Application List</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Application</Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
};

export default CustomBreadcrumb;
