// import classes from "./App.module.scss";
import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout, Flex, message } from 'antd';
import { Resizable } from 're-resizable';
// import { api } from './../api';

const { Sider, Content } = Layout;

import CustomMenu from '../components/CustomMenu';
import Search from 'antd/es/input/Search';
import CustomHeader from '../components/CustomHeader';
import { Note, Snippet } from '../api/Api';
import EditorPage from '../pages/EditorPage';
import CreationPage from '../pages/CreationPage';
import CustomFindContainer from '../components/CustomFindContainer';
import { api } from '../api';

const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [isUpdateNoteAndDirList, setIsUpdateNoteAndDirList] =
  const [isUpdateNoteAndDirList, setIsUpdateNoteAndDirList] =
    React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  // const [noteList, setNotelist] = React.useState<NotePreview[]>([]);
  const [currentNote, setCurrentNote] = useState<Note>({});
  const [findValue, setFindValue] = useState<string>('');
  const [snippets, setSnippets] = useState<Snippet[]>([]);

  const handleChangeFindValue = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFindValue(event.target.value);
  };

  const handleEventFindValue = (newValue: string) => {
    setFindValue(newValue);
  };

  const requestSnippets = async () => {
    const response = await api.snippets.snippetsList();
    setSnippets(response.data.snippets);
  };

  useEffect(() => {
    requestSnippets();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/home" element={<h1>Страница описания</h1>} />
        <Route
          path="/*"
          element={
            <Flex gap="middle" wrap="wrap" style={{ height: '100%' }}>
              <Layout style={layoutStyle}>
                <Routes>
                  <Route
                    path="/note/:id"
                    element={
                      <CustomHeader
                        isFullHeader
                        currentNote={currentNote}
                        messageApi={messageApi}
                        setCurrentNote={setCurrentNote}
                        isUpdateNoteAndDirList={isUpdateNoteAndDirList}
                        setIsUpdateNoteAndDirList={setIsUpdateNoteAndDirList}
                      ></CustomHeader>
                    }
                  />
                  <Route
                    path="/create_note"
                    element={
                      <CustomHeader
                        isFullHeader
                        currentNote={currentNote}
                        messageApi={messageApi}
                        setCurrentNote={setCurrentNote}
                        isUpdateNoteAndDirList={isUpdateNoteAndDirList}
                        setIsUpdateNoteAndDirList={setIsUpdateNoteAndDirList}
                      ></CustomHeader>
                    }
                  />
                  <Route
                    path="/*"
                    element={
                      <CustomHeader
                        isFullHeader={false}
                        currentNote={currentNote}
                        messageApi={messageApi}
                        setCurrentNote={setCurrentNote}
                        isUpdateNoteAndDirList={isUpdateNoteAndDirList}
                        setIsUpdateNoteAndDirList={setIsUpdateNoteAndDirList}
                      ></CustomHeader>
                    }
                  />
                </Routes>
                <Layout>
                  <Resizable
                    className="asdfasdf"
                    defaultSize={{
                      width: '260px',
                      height: '100%',
                    }}
                  >
                    <Sider style={siderStyle} width={'100%'}>
                      <Search
                        placeholder="Поиск"
                        allowClear
                        onChange={handleChangeFindValue}
                        onSearch={handleEventFindValue}
                        value={findValue}
                        style={{ width: '80%', margin: '1em 0' }}
                      />
                      {!findValue ? (
                        <CustomMenu
                          currentNote={currentNote}
                          setCurrentNote={setCurrentNote}
                          isUpdate={isUpdateNoteAndDirList}
                          setIsUpdate={setIsUpdateNoteAndDirList}
                        ></CustomMenu>
                      ) : (
                        <CustomFindContainer
                          findValue={findValue}
                        ></CustomFindContainer>
                      )}
                    </Sider>
                  </Resizable>

                  <Content style={contentStyle}>
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <EditorPage
                            isUpdateNoteAndDirList={isUpdateNoteAndDirList}
                            setIsUpdateNoteAndDirList={
                              setIsUpdateNoteAndDirList
                            }
                            note={currentNote}
                            setNote={setCurrentNote}
                            snippets={snippets}
                            setSnippets={setSnippets}
                            contextHolder={contextHolder}
                          ></EditorPage>
                        }
                      />
                      <Route
                        path="/create_note/"
                        element={
                          <CreationPage
                            isUpdateNoteAndDirList={isUpdateNoteAndDirList}
                            setIsUpdateNoteAndDirList={
                              setIsUpdateNoteAndDirList
                            }
                            note={currentNote}
                            setNote={setCurrentNote}
                            contextHolder={contextHolder}
                          ></CreationPage>
                        }
                      ></Route>
                      <Route
                        path="/note/:id"
                        element={
                          <EditorPage
                            isUpdateNoteAndDirList={isUpdateNoteAndDirList}
                            setIsUpdateNoteAndDirList={
                              setIsUpdateNoteAndDirList
                            }
                            note={currentNote}
                            setNote={setCurrentNote}
                            snippets={snippets}
                            setSnippets={setSnippets}
                            contextHolder={contextHolder}
                          ></EditorPage>
                        }
                      />
                      <Route
                        path="/dir/:id"
                        element={
                          <h1>
                            Страница списка папок и файлов определённой папки
                          </h1>
                        }
                      />
                    </Routes>
                  </Content>
                </Layout>
              </Layout>
            </Flex>
          }
        />
      </Routes>
    </>
  );
};

export default App;

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '100%',
  color: 'black',
  backgroundColor: '#f0f2f5',
  padding: '2em 5em',
};

const siderStyle: React.CSSProperties = {
  height: '100%',
  textAlign: 'center',
  color: '#black',
  backgroundColor: '#FFFFFF',
};

const layoutStyle = {
  overflow: 'hidden',
  width: '100%',
  maxWidth: '100%',
};
