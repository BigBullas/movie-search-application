// import classes from "./App.module.scss";
import React, { useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Layout, Flex } from 'antd';
import { api } from './../api';

const { Sider, Content } = Layout;
import { getCodeString } from 'rehype-rewrite';
import katex from 'katex';
import 'katex/dist/katex.css';
import CustomMenu from '../components/CustomMenu';
import Search from 'antd/es/input/Search';
import CustomBreadcrumb from '../components/CustomBreadcrumb';
import CustomHeader from '../components/CustomHeader';

const mdKaTeX = `This is to display the
\`\$\$\c = \\pm\\sqrt{a^2 + b^2}\$\$\`
 in one line

\`\`\`KaTeX
c = \\pm\\sqrt{a^2 + b^2}
\`\`\`
`;

type Note = {
  noteId?: number;
  name?: string;
  parentDir?: number;
};

const App: React.FC = () => {
  const [value, setValue] = React.useState(mdKaTeX);
  const [notes, setNotes] = React.useState<Note[]>([]);

  useEffect(() => {
    requestForOverview();
    requestOntNote();
  }, []);

  useEffect(() => {
    // Этот код будет выполнен каждый раз, когда notes обновляется
    console.log(notes);
  }, [notes]); // Зависимость от notes

  const requestOntNote = async () => {
    try {
      const response = await api.notes.notesDetail(1);
      console.log(response.data);
      if (response.data.body) {
        setValue(response.data.body);
      }
      console.log(notes);
    } catch (error) {
      console.log('Error in EditPayloadList: ', error);
    }
  };

  const handleChangeText = (
    value: React.SetStateAction<string | undefined>,
  ) => {
    console.log('handleChangeText_value: ', value);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setValue(value);
  };

  const requestForOverview = async () => {
    try {
      const response = await api.notes.overviewList();

      console.log(response.data.notes);

      if (response.data.notes) {
        console.log('1');
        setNotes(response.data.notes);
      }
      console.log(notes);
    } catch (error) {
      console.log('Error in EditPayloadList: ', error);
    }
  };

  const requestNote = async (id = 1) => {
    try {
      const response = await api.notes.notesDetail(id);
      console.log(response.data);
    } catch (error) {
      console.log('Error in EditPayloadList: ', error);
    }
  };

  const handleCreateNote = async (event: React.MouseEvent) => {
    event.preventDefault();
    const note = {
      userId: 1,
      name: 'example',
      body: 'nasjkdhfjkhasdfjkasdf',
      parentDir: 0,
    };

    try {
      const response = await api.notes.notesCreate(note);
      console.log(response.data.noteId);
      requestNote(response.data.noteId);
    } catch (error) {
      console.log('Error in EditPayloadList: ', error);
    }
  };

  const handleUpdateNote = async (event: React.MouseEvent) => {
    event.preventDefault();
    const note = {
      userId: 1,
      name: 'example2',
      body: value,
      parentDir: 0,
    };

    try {
      const response = await api.notes.notesUpdate(1, note);
      console.log(response.status);
    } catch (error) {
      console.log('Error in EditPayloadList: ', error);
    }
  };

  return (
    <Flex gap="middle" wrap="wrap" style={{ height: '100%' }}>
      <Layout style={layoutStyle}>
        <CustomHeader
          handleCreateNote={handleCreateNote}
          handleUpdateNote={handleUpdateNote}
        ></CustomHeader>
        <Layout>
          <Sider style={siderStyle} width={'260px'}>
            <Search
              placeholder="Поиск"
              allowClear
              onSearch={() => {}}
              style={{ width: '80%', margin: '1em 0' }}
            />
            <CustomMenu></CustomMenu>
          </Sider>
          <Content style={contentStyle}>
            <div style={{ paddingBottom: '2em' }}>
              <CustomBreadcrumb></CustomBreadcrumb>
            </div>

            <div style={editor} data-color-mode="light">
              <MDEditor
                value={value}
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
                      return (
                        <code className={String(className)}>{children}</code>
                      );
                    },
                  },
                }}
              />
            </div>
          </Content>
        </Layout>
      </Layout>
    </Flex>
  );
};

export default App;

const editor: React.CSSProperties = {
  height: '800px !import',
  padding: '0 10',
};

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
