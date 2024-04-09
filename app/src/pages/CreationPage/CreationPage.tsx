import React, { useEffect, useState } from 'react';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import { Note } from '../../api/Api';
import { api } from '../../api';
import { useNavigate } from 'react-router-dom';
import {
  DownloadOutlined,
  FileImageOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import CustomDragger from '../../components/CustomDragger';
import styles from './CreationPage.module.scss';

console.log(styles);

type Props = {
  note: Note;
  setNote: React.Dispatch<React.SetStateAction<Note>>;
  contextHolder: React.ReactElement<
    unknown,
    string | React.JSXElementConstructor<unknown>
  >;
  isUpdateNoteAndDirList: boolean;
  setIsUpdateNoteAndDirList: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreationPage: React.FC<Props> = ({
  note,
  setNote,
  contextHolder,
  isUpdateNoteAndDirList,
  setIsUpdateNoteAndDirList,
}) => {
  const navigate = useNavigate();
  const [size] = useState<SizeType>('large');

  const [isActiveDragger, setIsActiveDragger] = useState(false);
  const [isImageDragger, setIsImageDragger] = useState<boolean | null>(null);

  useEffect(() => {
    setIsActiveDragger(false);
    setIsImageDragger(null);
  }, []);

  const requestNote = async (id: number) => {
    try {
      const response = await api.notes.notesDetail(id);

      console.log(response.data);

      setNote(response.data);
      setIsUpdateNoteAndDirList(!isUpdateNoteAndDirList);

      navigate(`/note/${id}`);
      // TODO: добавить link на страницу редактирования пустой заметки
    } catch (error) {
      console.log('Error in requestNote: ', error);
    }
  };

  const handleClickCreateNote = async (event: React.MouseEvent) => {
    event.preventDefault();
    let newNote: Note = {};
    if (note.name) {
      newNote = {
        userId: 1,
        parentDir: 0,
        name: note.name,
      };
    } else {
      newNote = {
        userId: 1,
        parentDir: 0,
      };
    }

    try {
      const response = await api.notes.notesCreate(newNote);

      console.log(response.data.noteId);

      requestNote(response.data.noteId);
    } catch (error) {
      console.log('Error in handleCreateNote: ', error);
    }
  };

  const handleClickDownloadImages = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsActiveDragger(true);
    setIsImageDragger(true);
  };

  const handleClickImportFiles = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsActiveDragger(true);
    setIsImageDragger(false);
  };

  async function sendFormData(formData: FormData) {
    try {
      const response = await fetch(
        'https://smartlectures.ru/api/v1/recognizer/mixed',
        {
          method: 'POST',
          body: formData,
        },
      );
      const text = await response.json();
      console.log(text.text);
      const newNote: Note = {};
      newNote.body = text.text;
      newNote.parentDir = 0;
      newNote.userId = 1;
      newNote.noteId = 0;
      setNote(newNote);
      navigate('/note/0');
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  }

  // const requestUploadFile = async (event: React.ChangeEvent) => {
  //   event.preventDefault();
  //   console.log('requestUploadFile', event.target.files);
  //   const response = await api.recognizer.mixedCreate({
  //     images: event.target.files,
  //   });
  //   console.log(response);
  // };

  return (
    <div className="payload_list_container">
      {contextHolder}
      <div style={{ paddingBottom: '2em' }}>
        <CustomBreadcrumb />
      </div>

      <>
        <div>
          <div>
            <h2 style={{ marginTop: '0' }}>Создание документа</h2>
          </div>
          <div className={styles.buttonContainer}>
            <Button
              type="default"
              icon={<PlusOutlined />}
              size={size}
              onClick={handleClickCreateNote}
            >
              Пустой документ
            </Button>
            <Button
              type={isImageDragger ? 'primary' : 'default'}
              icon={<FileImageOutlined />}
              size={size}
              onClick={handleClickDownloadImages}
            >
              Загрузка фотографий
            </Button>
            <Button
              type={
                isImageDragger !== null && !isImageDragger
                  ? 'primary'
                  : 'default'
              }
              icon={<DownloadOutlined />}
              size={size}
              onClick={handleClickImportFiles}
            >
              Импорт файлов
            </Button>
          </div>
          <div>
            <CustomDragger
              isActive={isActiveDragger}
              isImage={isImageDragger}
              setIsActive={setIsActiveDragger}
              sendFormData={sendFormData}
            ></CustomDragger>
          </div>
        </div>
      </>
    </div>
  );
};

export default CreationPage;
