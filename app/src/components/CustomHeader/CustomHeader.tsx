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
import { useNavigate } from 'react-router-dom';

console.log(styles);

type Props = {
  isFullHeader: boolean;
  isUpdateNoteAndDirList: boolean;
  setIsUpdateNoteAndDirList: React.Dispatch<React.SetStateAction<boolean>>;
  currentNote: Note;
  setCurrentNote: React.Dispatch<React.SetStateAction<Note>>;
  messageApi: MessageInstance;
};

const CustomHeader: React.FC<Props> = ({
  isFullHeader,
  isUpdateNoteAndDirList,
  setIsUpdateNoteAndDirList,
  currentNote,
  setCurrentNote,
  messageApi,
}) => {
  const navigate = useNavigate();
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
        messageApi.open({
          type: 'success',
          content: 'Конспект успешно обновлён',
        });
      }
    } catch (error) {
      console.log('Error in handleUpdateNote: ', error);
    }
  };

  const requestDeleteNote = async () => {
    try {
      if (currentNote.noteId) {
        const response = await api.notes.notesDelete(currentNote.noteId);

        console.log(response.status);
        // TODO: messageHolder утащить в другое место
        // messageApi.open({
        //   type: 'success',
        //   content: 'Конспект успешно удалён',
        // });
      }
    } catch (error) {
      console.log('Error in requestDeleteNote: ', error);
    }
  };

  const handleUpdateNote = (event: React.MouseEvent) => {
    event.preventDefault();
    requestUpdateNote();
  };

  const handleUpdateTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const changedTitle = event.target.value;
    setCurrentNoteTitle(changedTitle);
    setCurrentNote((oldNote) => {
      oldNote.name = changedTitle;
      return oldNote;
    });
  };

  const handleClickUpdateTitle = async (event: React.MouseEvent) => {
    event.preventDefault();
    await requestUpdateNote();
    setIsUpdateNoteAndDirList(!isUpdateNoteAndDirList);
  };

  const handleClickCreateNewNote = (event: React.MouseEvent) => {
    event.preventDefault();
    setCurrentNote({});
    setCurrentNoteTitle(undefined);
    navigate('/note/0');
  };

  const handleClickMainPage = (event: React.MouseEvent) => {
    event.preventDefault();
    setCurrentNote({});
    setCurrentNoteTitle(undefined);
    navigate('/');
  };

  const handleClickDeleteNote = async (event: React.MouseEvent) => {
    event.preventDefault();
    setCurrentNote({});
    setCurrentNoteTitle(undefined);
    setIsUpdateNoteAndDirList(!isUpdateNoteAndDirList);
    await requestDeleteNote();
    navigate('/');
  };

  return (
    <Header className={styles.headerStyle}>
      <div className={styles.headerLeft}>
        <div className={styles.burgerAndLogo}>
          <div style={{ alignItems: 'center' }}>
            <MenuUnfoldOutlined style={{ fontSize: '20px' }} />
          </div>
          <div className={styles.logo} onClick={handleClickMainPage}>
            EasyTeX
          </div>
        </div>
        <div style={{ alignItems: 'center' }}>
          <PlusCircleOutlined
            style={{ fontSize: '20px' }}
            onClick={handleClickCreateNewNote}
          />
        </div>
      </div>
      {isFullHeader && (
        <div className={styles.headerRight}>
          <div className={styles.documentTitle}>
            <div style={{ alignItems: 'center' }}>
              <Input
                value={currentNoteTitle}
                placeholder="Новый документ"
                onChange={handleUpdateTitle}
              />
            </div>
            <div style={{ alignItems: 'center' }}>
              <EditOutlined
                style={{ fontSize: '20px' }}
                onClick={handleClickUpdateTitle}
              />
            </div>
          </div>
          <div className={styles.documentInstruments}>
            <div className={styles.iconContainer}>
              <div>
                <FileImageOutlined style={{ fontSize: '20px' }} />
              </div>
              <div>
                <DeleteOutlined
                  style={{ fontSize: '20px' }}
                  onClick={handleClickDeleteNote}
                />
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
      )}
    </Header>
  );
};

export default CustomHeader;
