import React, { useEffect, useState } from 'react';
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
import { Note } from '../../api/Api';
import { api } from '../../api';
import { MessageInstance } from 'antd/es/message/interface';

console.log(styles);

type Props = {
  // isUpdateNoteAndDirList: boolean;
  // setIsUpdateNoteAndDirList: React.Dispatch<React.SetStateAction<boolean>>;
  currentNote: Note;
  setCurrentNote: React.Dispatch<React.SetStateAction<Note>>;
  messageApi: MessageInstance;
};

const CustomHeader: React.FC<Props> = ({
  currentNote,
  setCurrentNote,
  messageApi,
}) => {
  const [currentNoteTitle, setCurrentNoteTitle] = useState(currentNote.name);

  useEffect(() => {
    setCurrentNoteTitle(currentNote.name);
  }, [currentNote]);

  const requestUpdateNote = async () => {
    try {
      if (currentNote.noteId) {
        const response = await api.notes.notesUpdate(
          currentNote.noteId,
          currentNote,
        );
        console.log(response.status);
        //TODO: проверить работу contextHolder
        messageApi.open({
          type: 'success',
          content: 'Конспект успешно обновлён',
        });
      }
    } catch (error) {
      console.log('Error in handleUpdateNote: ', error);
    }
  };

  const handleUpdateNote = (event: React.MouseEvent) => {
    event.preventDefault();
    requestUpdateNote();
  };

  const handleUpdateTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const changedTitle = event.target.value;
    // setCurrentNoteTitle(changedTitle);
    setCurrentNote((oldNote) => {
      oldNote.name = changedTitle;
      return oldNote;
    });
    requestUpdateNote();
  };

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
            <Input
              value={currentNoteTitle}
              placeholder="Новый документ"
              onChange={handleUpdateTitle}
            />
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
            <Button type="default" onClick={() => {}}>
              Поделиться
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
