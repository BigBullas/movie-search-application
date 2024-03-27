import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

import { getCodeString } from 'rehype-rewrite';
import katex from 'katex';
import 'katex/dist/katex.css';

import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import styles from './EditorPage.module.scss';
import { Note } from '../../api/Api';
import { api } from '../../api';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DownloadOutlined,
  FileImageOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import CustomDragger from '../../components/CustomDragger';

console.log(styles);

// noteId?: number;
// name?: string;
// body?: string;
// createdAt?: string;
// lastUpdate?: string;
// parentDir?: number;
// userId?: number;

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

const EditorPage: React.FC<Props> = ({
  note,
  setNote,
  contextHolder,
  isUpdateNoteAndDirList,
  setIsUpdateNoteAndDirList,
}) => {
  const { id: strNoteId } = useParams<string>();
  const currentNoteId = Number(strNoteId);
  const formRef = useRef(null);

  const navigate = useNavigate();
  const [size] = useState<SizeType>('large');

  const [noteText, setNoteText] = useState<string | undefined>(note.body);
  const [isActiveDragger, setIsDragger] = useState(false);
  const [isImageDragger, setIsImageDragger] = useState<boolean | null>(null);

  useEffect(() => {
    if (currentNoteId !== 0) {
      requestOnNote();
    } else {
      setIsDragger(false);
      setIsImageDragger(null);
    }
  }, [currentNoteId]);

  useEffect(() => {
    setNoteText(note.body);
  }, [note]);

  const requestOnNote = async () => {
    try {
      const response = await api.notes.notesDetail(currentNoteId);
      setNote(response.data);

      console.log(note);
    } catch (error) {
      console.log('Error in requestOntNote: ', error);
    }
  };

  const handleChangeText = (
    value: React.SetStateAction<string | undefined>,
  ) => {
    // console.log('handleChangeText_value: ', value);
    setNoteText(value);
    setNote((note: Note) => {
      note.body = String(value);
      return note;
    });
  };

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
    setIsDragger(true);
    setIsImageDragger(true);
  };

  const handleClickImportFiles = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsDragger(true);
    setIsImageDragger(false);
  };

  const requestUploadFile = async (event: React.ChangeEvent) => {
    event.preventDefault();
    console.log('requestUploadFile', event.target.files);
    const response = await api.recognizer.mixedCreate({
      images: event.target.files,
    });
    console.log(response);
  };

  async function sendFormData(formData) {
    try {
      const response = await fetch(
        'https://smartlectures.ru/api/v1/recognizer/mixed',
        {
          method: 'POST',
          body: formData,
        },
      );

      console.log(response);

      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }

      // const data = await response.json();
      // console.log(data);
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(event);
    const formData = new FormData();
    formData.append('images', event.target.files[0]);
    await sendFormData(formData);
  };

  return (
    <div className="payload_list_container">
      {contextHolder}
      <div style={{ paddingBottom: '2em' }}>
        <CustomBreadcrumb />
      </div>

      {currentNoteId === 0 && (
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
              {/* <input type="file" onChange={requestUploadFile}></input> */}
              <form ref={formRef}>
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  required
                  onChange={handleSubmit}
                />
                <button type="submit">Submit</button>
              </form>
              <CustomDragger
                isActive={isActiveDragger}
                isImage={isImageDragger}
              ></CustomDragger>
            </div>
          </div>
          <h2>Предварительный вид документа</h2>
        </>
      )}

      <div className={styles.editor} data-color-mode="light">
        <MDEditor
          value={noteText}
          height={800}
          onChange={handleChangeText}
          previewOptions={{
            components: {
              code: ({ children = [], className, ...props }) => {
                if (
                  typeof children === 'string' &&
                  /^\$\$(.*)\$\$/.test(children)
                ) {
                  const html = katex.renderToString(
                    children.replace(/^\$\$(.*)\$\$/, '$1'),
                    {
                      throwOnError: false,
                    },
                  );
                  return (
                    <code
                      dangerouslySetInnerHTML={{ __html: html }}
                      style={{ background: 'transparent' }}
                    />
                  );
                }
                const code =
                  // eslint-disable-next-line react/prop-types
                  props.node && props.node.children
                    ? // eslint-disable-next-line react/prop-types
                      getCodeString(props.node.children)
                    : children;
                if (
                  typeof code === 'string' &&
                  typeof className === 'string' &&
                  /^language-katex/.test(className.toLocaleLowerCase())
                ) {
                  const html = katex.renderToString(code, {
                    throwOnError: false,
                  });
                  return (
                    <code
                      style={{ fontSize: '150%' }}
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  );
                }
                return <code className={String(className)}>{children}</code>;
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
