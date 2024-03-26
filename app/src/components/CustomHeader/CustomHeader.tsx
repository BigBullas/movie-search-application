import React from 'react';
import { Layout, Button, Input } from 'antd';
// import { api } from './../api';

const { Header } = Layout;
import styles from './CustomHeader.module.scss';
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  FileImageOutlined,
  MenuUnfoldOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';

console.log(styles);

type Props = {
  handleCreateNote: (event: React.MouseEvent) => void;
  handleUpdateNote: (event: React.MouseEvent) => void;
};

const CustomHeader: React.FC<Props> = ({
  handleCreateNote,
  handleUpdateNote,
}) => {
  return (
    <Header className={styles.headerStyle}>
      <div className={styles.headerLeft}>
        <div className={styles.burgerAndLogo}>
          <div>
            <MenuUnfoldOutlined style={{ fontSize: '20px' }} />
          </div>
          <div className={styles.logo}>EasyTeX</div>
        </div>
        <div>
          <PlusCircleOutlined style={{ fontSize: '20px' }} />
        </div>
      </div>
      <div className={styles.headerRight}>
        <div className={styles.documentTitle}>
          <div>
            <Input placeholder="Новый документ" />
          </div>
          <div>
            <EditOutlined style={{ fontSize: '20px' }} />
          </div>
        </div>
        <div className={styles.documentInstruments}>
          <div className={styles.iconContainer}>
            <div>
              <FileImageOutlined style={{ fontSize: '20px' }} />
            </div>
            <div>
              <DeleteOutlined style={{ fontSize: '20px' }} />
            </div>
            <div>
              <ExportOutlined style={{ fontSize: '20px' }} />
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <Button type="default" onClick={handleCreateNote}>
              Создать
            </Button>
            <Button type="primary" onClick={handleUpdateNote}>
              Сохранить
            </Button>
          </div>
        </div>
      </div>
    </Header>
  );
};

export default CustomHeader;
