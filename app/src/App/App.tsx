// import classes from "./App.module.scss";
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout, Flex, message } from 'antd';
// import { api } from './../api';

const { Sider, Content } = Layout;

import CustomMenu from '../components/CustomMenu';
import Search from 'antd/es/input/Search';
import CustomHeader from '../components/CustomHeader';
import { Note } from '../api/Api';
import EditorPage from '../pages/EditorPage';
import CreationPage from '../pages/CreationPage';

const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [isUpdateNoteAndDirList, setIsUpdateNoteAndDirList] =
  const [isUpdateNoteAndDirList, setIsUpdateNoteAndDirList] =
    React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  // const [noteList, setNotelist] = React.useState<NotePreview[]>([]);
  const [currentNote, setCurrentNote] = React.useState<Note>({});

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
                  <Sider style={siderStyle} width={'260px'}>
                    <Search
                      placeholder="Поиск"
                      allowClear
                      onSearch={() => {}}
                      style={{ width: '80%', margin: '1em 0' }}
                    />
                    <CustomMenu
                      currentNote={currentNote}
                      setCurrentNote={setCurrentNote}
                      isUpdate={isUpdateNoteAndDirList}
                    ></CustomMenu>
                  </Sider>
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

{
  /* <Routes>
<Route path="/home" element={<HomePage />} />
<Route path="/*" element={
  <Layout style={layoutStyle}>
    <CustomHeader />
    <Layout>
      <Sider style={siderStyle} width={'260px'}>
        <Search placeholder="Поиск" allowClear onSearch={() => {}} style={{ width: '80%', margin: '1em 0' }} />
        <CustomMenu />
      </Sider>
      <Content style={contentStyle}>
        <Routes>
         <Route path="/" element={<h1>Страница списка папок и файлов</h1>} />
         <Route path="/note/:id" element={<EditorPage />} />
        </Routes>
      </Content>
    </Layout>
  </Layout>
} />
</Routes> */
}

/*    <BrowserRouter>
      <Header />
      <ContainerUnderHeader desc={ desc } path={ path } draftID={ draftID }/>

      <Routes>
        <Route path="/" element={<PayloadsPage changeBreadcrump = {changeBreadcrump} payloads={ payloads }
         loading = { loading } getPayloadList={ getPayloadList } draftID = { draftID } setDraftID = { setDraftID }/>} />
        <Route path="/edit_payloads/" element = {<EditPayloadListPage changeBreadcrump={changeBreadcrump}/> } />
        <Route path="/edit_payload/:id" element = {<SinglePayloadPage changeBreadcrump = {changeBreadcrump} isEdit = {true}/>} />
        <Route path="/payload/:id" element = {<SinglePayloadPage changeBreadcrump = {changeBreadcrump} isEdit = {false}/>} />

        <Route path="/rocket_flights" element = { <FlightsPage changeBreadcrump={changeBreadcrump}/> }/>
        <Route path="/rocket_flight/:id" element = { <SingleFlightPage changeBreadcrump={changeBreadcrump} draftId={draftID} setDraftId={ setDraftID }/> }/>

        <Route path="/auth" element = { <AuthPage changeBreadcrump = {changeBreadcrump}/> }/>
        <Route path="/reg" element = { <RegPage  changeBreadcrump = {changeBreadcrump}/> }/>
        <Route path="/profile" element = { <ProfilePage changeBreadcrump={changeBreadcrump} draftID = { draftID } setDraftID = { setDraftID } />}/>
      </Routes>
    </BrowserRouter> */

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
  // lineHeight: '100vh',
  color: '#black',
  backgroundColor: '#FFFFFF',

  // borderRight: '2px solid #9C9C9C',
  // height: '10vh',
  // display: 'flex',
  // padding: '0px 5px',
};

const layoutStyle = {
  overflow: 'hidden',
  width: '100%',
  maxWidth: '100%',
};
