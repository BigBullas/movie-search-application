import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

import { getCodeString } from 'rehype-rewrite';
import katex from 'katex';
import 'katex/dist/katex.css';

import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import styles from './EditorPage.module.scss';
import { Note, Snippet } from '../../api/Api';
import { api } from '../../api';
import { useParams } from 'react-router-dom';
import { Menu, Dropdown } from 'antd';

console.log(styles);

type Props = {
  note: Note;
  setNote: React.Dispatch<React.SetStateAction<Note>>;
  snippets: Snippet[];
  setSnippets: React.Dispatch<React.SetStateAction<Snippet[]>>; // for adding new snippet
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
  snippets,
  contextHolder,
}) => {
  const inputForContextMenu = useRef<HTMLInputElement | null>(null);

  const [noteText, setNoteText] = useState<string | undefined>(note.body);

  const [cursorPosition, setCursorPosition] = useState(0);
  const [currentKeyContextMenu, setCurrentKeyContextMenu] = useState('');

  const [isSnippetsMenu, setIsSnippetsMenu] = useState(false);
  const [snippetsIndex, setSnippetsIndex] = useState(0);
  const [snippetsContextMenu, setSnippetsContextMenu] = useState<JSX.Element>(
    <></>,
  );

  console.log(snippetsContextMenu);

  const currentHref = window.location.href;
  const hasNote = currentHref.includes('/note/');
  const hasCreateNote = currentHref.includes('/create_note');

  const { id: strNoteId } = useParams<string>();
  let currentNoteId: number;
  if (hasNote) {
    currentNoteId = Number(strNoteId);
  } else {
    if (hasCreateNote) {
      currentNoteId = -1;
    } else {
      currentNoteId = 25;
    }
  }

  useEffect(() => {
    if (currentNoteId > 0) {
      requestOnNote();
    }
  }, [currentNoteId]);

  useEffect(() => {
    setNoteText(note.body);
  }, [note]);

  useEffect(() => {
    setSnippetsContextMenu(createSnippetsMenu());
  }, [snippets]);

  const requestOnNote = async () => {
    try {
      const response = await api.notes.notesDetail(currentNoteId);
      setNote(response.data);

      // console.log(note);
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

    if (value && String(value)[value.length - 1] === '/') {
      setIsSnippetsMenu(true);
      setSnippetsIndex(value.length - 1);
      console.log('isSnippetMenu');
    } else {
      if (
        value &&
        isSnippetsMenu &&
        (value?.length < snippetsIndex || value.length - snippetsIndex > 5)
      ) {
        setIsSnippetsMenu(false);
        console.log('off SnippetMenu');
      }
    }
  };

  const handleContextMenuOnEditor = (event: React.MouseEvent) => {
    event.preventDefault();
    // @ts-ignore
    setCursorPosition(event.target.selectionStart);
  };

  const handleClickInContextMenu = (key: string) => {
    if (key === 'pasteMix' || key === 'pasteText' || key === 'pasteMath') {
      setCurrentKeyContextMenu(key);
      inputForContextMenu.current?.click();
    }
    console.log('click the key: ', key);
  };

  async function sendFormData(formData: FormData) {
    try {
      console.log(currentKeyContextMenu);
      const response = await fetch(
        'https://smartlectures.ru/api/v1/recognizer/mixed',
        {
          method: 'POST',
          body: formData,
        },
      );
      const text = await response.json();
      console.log(text.text);
      let currentText = noteText;
      if (cursorPosition == currentText?.length) {
        currentText += text.text;
      } else {
        currentText =
          currentText?.substring(0, cursorPosition) +
          text.text +
          currentText?.substring(cursorPosition, currentText.length);
      }
      setNoteText(currentText);
      setNote((note: Note) => {
        note.body = String(currentText);
        return note;
      });
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  }

  const handleChangeInputForContextMenu = async (event: React.ChangeEvent) => {
    console.log(event);
    const formData = new FormData();
    // @ts-ignore
    formData.append('images', event.target.files[0]);
    await sendFormData(formData);
  };

  const createSnippetsMenu = () => {
    return (
      <Menu
        style={{ width: '320px', height: '350px' }}
        onClick={({ key }) => {
          handleClickInContextMenu(key);
        }}
        items={snippets.map((item) => {
          return {
            label: (
              <div>
                <p>{item.name}</p>
                <p>{item.description}</p>
              </div>
            ),
            key: item.snippetId,
          };
        })}
      ></Menu>
    );
  };

  const menu = (
    <Menu
      onClick={({ key }) => {
        handleClickInContextMenu(key);
      }}
      items={[
        { label: 'Вставить фото', key: 'addImage' },
        {
          label: 'Преобразовать',
          key: 'paste',
          children: [
            { label: 'Фото текста', key: 'pasteText' },
            { label: 'Фото формулы', key: 'pasteMath' },
          ],
        },
        {
          label: 'Добавить фото конспекта',
          key: 'pasteMix',
        },
      ]}
    ></Menu>
  );

  return (
    <div className="payload_list_container">
      {contextHolder}
      <div style={{ paddingBottom: '2em' }}>
        <CustomBreadcrumb />
      </div>
      <>
        {currentNoteId === -1 && <h2>Предварительный вид документа</h2>}
        <div className={styles.editor} data-color-mode="light">
          {/* {snippetsContextMenu} */}
          <Dropdown overlay={menu} trigger={['contextMenu']}>
            <MDEditor
              value={noteText}
              height={800}
              onChange={handleChangeText}
              onContextMenu={handleContextMenuOnEditor}
              preview="preview"
              textareaProps={{
                readOnly: currentNoteId === 25 ? true : false,
              }}
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
                    return (
                      <code className={String(className)}>{children}</code>
                    );
                  },
                },
              }}
            />
          </Dropdown>
          <input
            type="file"
            ref={inputForContextMenu}
            style={{ display: 'none' }}
            onChange={handleChangeInputForContextMenu}
          ></input>
        </div>
      </>
    </div>
  );
};

export default EditorPage;
