import React, { useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

import { getCodeString } from 'rehype-rewrite';
import katex from 'katex';
import 'katex/dist/katex.css';

import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import styles from './EditorPage.module.scss';
import { Note } from '../../api/Api';
import { api } from '../../api';
import { useParams } from 'react-router-dom';
import { Menu, Dropdown } from 'antd';

console.log(styles);

const menu = (
  <Menu
    onClick={({ key }) => {
      console.log('click the key: ', key);
    }}
    items={[
      { label: 'Преобразовать фото текста', key: 'pasteText' },
      { label: 'Преобразовать фото формулы', key: 'pasteMath' },
      {
        label: 'Добавить фото конспекта',
        key: 'pasteMix',
        onClick: () => console.log('pasteMix'),
      },
    ]}
  ></Menu>
);

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

const EditorPage: React.FC<Props> = ({ note, setNote, contextHolder }) => {
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

  const [noteText, setNoteText] = useState<string | undefined>(note.body);

  useEffect(() => {
    if (currentNoteId > 0) {
      requestOnNote();
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

  const handleContextMenuOnEditor = (event: React.MouseEvent) => {
    event.preventDefault();
    console.log(event);
  };

  return (
    <div className="payload_list_container">
      {contextHolder}
      <div style={{ paddingBottom: '2em' }}>
        <CustomBreadcrumb />
      </div>
      <>
        {currentNoteId === -1 && <h2>Предварительный вид документа</h2>}
        <div className={styles.editor} data-color-mode="light">
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
        </div>
      </>
    </div>
  );
};

export default EditorPage;
