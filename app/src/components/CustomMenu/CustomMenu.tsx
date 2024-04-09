import React, { useEffect, useState } from 'react';
import { FileTextOutlined, FolderOutlined } from '@ant-design/icons';
import type { MenuProps, MenuTheme } from 'antd';
import { Dropdown, Menu } from 'antd';
import { api } from '../../api';
import { NotePreview, Dir, Note } from '../../api/Api';

// import styles from './CustomMenu.module.scss';
import { useNavigate } from 'react-router-dom';

const createMenuStructure = (
  dirMap: Map<number, MenuItem>,
  currentDir: Dir,
  globalNoteList: NotePreview[],
) => {
  if (currentDir.dirId) {
    const noteList: MenuItem[] = [];
    const dirList: MenuItem[] = [];
    let childDir;
    globalNoteList.forEach((value) => {
      if (value.parentDir === currentDir.dirId) {
        noteList.push(getItem(value.name, value.noteId, <FileTextOutlined />));
      }
    });
    currentDir.subdirs?.forEach((value) => {
      if (value.dirId) {
        childDir = dirMap.get(value.dirId);
        if (childDir) {
          dirList.push(childDir);
        } else {
          console.log(`${value} don't have MenuItem in dirMap`);
          dirList.push(
            getItem(value.name, `d${value.dirId}`, <FolderOutlined />),
          );
        }
      }
    });
    dirMap.set(
      currentDir.dirId,
      getItem(currentDir.name, `d${currentDir.dirId}`, <FolderOutlined />, [
        ...dirList,
        ...noteList,
      ]),
    );
  }
};

const reverseFolderTraversal = (dir: Dir, globalNoteList: NotePreview[]) => {
  const memory: Dir[] = []; // память (стек) (в начале пуста)
  let cur_dir: Dir | null = dir; // текущая ссылка (в начале равна ссылке на корень дерева)
  let lastDirVisited; // последний обработанный узел на данный момент
  const dirMap: Map<number, MenuItem> = new Map();

  // цикл перебора узлов
  //     закончить цикл, как только память (стек) опустеет
  //     и текущая ссылка перестанет указывать на узел дерева
  while (memory.length > 0 || cur_dir) {
    // если текущая ссылка указывает на узел дерева, заглубляемся до листа (итерация заглубления)
    if (cur_dir) {
      memory.push(cur_dir); // поместить ссылку в память (стек)
      // перейти к правому потомку
      if (cur_dir.subdirs) {
        cur_dir = cur_dir.subdirs[cur_dir.subdirs.length - 1]; // потомок есть
      } else {
        cur_dir = null;
      } // потомка нет

      // если текущая ссылка не указывает на узел дерева (узел на предыдущей
      // итерации заглубления был листом или возвращаемся вверх)
    } else {
      const peekDir: Dir = memory[memory.length - 1]; // ссылка на узел в вершине стека

      // если узел на предыдущей итерации не был листом (возвращаемся вверх)
      if (peekDir.subdirs) {
        // ищем ветку, откуда вернулись
        let i;
        for (i = peekDir.subdirs.length - 1; i >= 0; i--) {
          if (peekDir.subdirs[i].dirId === lastDirVisited?.dirId) break;
        }

        // если существует ветка левее, переходим по ней
        if (i > 0) {
          cur_dir = peekDir.subdirs[i - 1];
        } else {
          // иначе (у узла на предыдущей итерации все потомки обработаны)
          // console.log(peekDir); // ...обработка данных узла... (вывод в консоль)
          createMenuStructure(dirMap, peekDir, globalNoteList);

          lastDirVisited = memory.pop(); // убираем узел из памяти (стека) и запоминаем его
        }

        // если узел на предыдущей итерации был листом
      } else {
        // console.log(peekDir); // ...обработка данных узла... (вывод в консоль)
        createMenuStructure(dirMap, peekDir, globalNoteList);

        lastDirVisited = memory.pop(); // убираем узел из памяти (стека) и запоминаем его
      }
    }
  }

  if (lastDirVisited?.dirId) {
    return dirMap.get(lastDirVisited?.dirId);
  }
  return null;
};

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

type Props = {
  isUpdate: boolean;
  currentNote: Note;
  setCurrentNote: React.Dispatch<React.SetStateAction<Note>>;
};

const CustomMenu: React.FC<Props> = ({
  isUpdate,
  currentNote,
  setCurrentNote,
}) => {
  // const [theme, setTheme] = useState<MenuTheme>('light');
  const [theme] = useState<MenuTheme>('light');
  const navigate = useNavigate();
  const [currentNoteId, setCurrentNoteId] = useState(
    String(currentNote.noteId),
  );
  const [currentDirId, setCurrentDirId] = useState(`d${currentNote.parentDir}`);

  const [noteList, setNoteList] = useState<NotePreview[]>([]);
  const [dirList, setDirList] = useState<Dir[]>([]);
  const [navbar, setNavbar] = useState<MenuItem[]>();

  const [idWithContextMenu, setIdWithContextMenu] = useState('');
  console.log(idWithContextMenu);

  useEffect(() => {
    setCurrentNoteId(String(currentNote.noteId));
    setCurrentDirId(`d${currentNote.parentDir}`);
  }, [currentNote]);

  const createNavbar = () => {
    setNavbar([]);
    dirList.forEach((value) => {
      const dirMenu = reverseFolderTraversal(value, noteList);
      if (dirMenu) {
        setNavbar((navbar) => {
          if (navbar) {
            return [...navbar, dirMenu];
          } else {
            return [dirMenu];
          }
        });
      }
    });
    noteList.forEach((value) => {
      if (value.parentDir === 0) {
        setNavbar((navbar) => {
          if (navbar) {
            return [
              ...navbar,
              getItem(value.name, value.noteId, <FileTextOutlined />),
            ];
          } else {
            return [getItem(value.name, value.noteId, <FileTextOutlined />)];
          }
        });
      }
    });
  };

  const createStructure = async () => {
    await requestForNotesOverview();
    await requestForDirOverview();
    // createNavbar();
  };

  useEffect(() => {
    createStructure();
  }, [isUpdate]);

  useEffect(() => {
    // console.log('createNavbar: ', noteList, dirList, navbar);
    createNavbar();
  }, [noteList, dirList]);

  const requestForNotesOverview = async () => {
    try {
      const response = await api.notes.overviewList();

      // console.log('response.data.notes: ', response.data.notes);

      if (response.data.notes) {
        setNoteList(response.data.notes);
      }
    } catch (error) {
      console.log('Error in requestForNotesOverview: ', error);
    }
  };

  const requestForDirOverview = async () => {
    try {
      const response = await api.dirs.overviewList();

      // console.log('response.data.dirs: ', response.data.dirs);

      if (response.data.dirs) {
        setDirList(response.data.dirs);
      }
    } catch (error) {
      console.log('Error in requestForDirOverview: ', error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const changeTheme = (value: boolean) => {
  //   setTheme(value ? 'dark' : 'light');
  // };

  const onClick: MenuProps['onClick'] = (e) => {
    // console.log('click ', e);
    if (e.key.startsWith('d')) {
      setCurrentDirId(e.key);
      navigate(`/dir/${e.key.slice(1)}`);
    } else {
      setCurrentNoteId(e.key);
      setCurrentNote({});
      navigate(`/note/${e.key}`);
    }
  };

  const handleContextMenuOnNavbar = (event: React.MouseEvent) => {
    event.preventDefault();
    // @ts-ignore
    console.log(
      event,
      event.currentTarget,
      // @ts-ignore
      event.target.parentNode,
      // @ts-ignore
      event.target.parentNode.attributes[3].value,
    );
    // @ts-ignore
    const strId: string = event.target.parentNode.attributes[3].value;
    const index = strId.lastIndexOf('-') + 1;
    console.log(strId.substring(index));
    setIdWithContextMenu(strId.substring(index));
  };

  const menu = (
    <Menu
      onClick={({ key }) => {
        console.log(key);
        // handleClickInContextMenu(key);
      }}
      items={[
        { label: 'Создать заметку', key: 'createNote' },
        {
          label: 'Создать папку',
          key: 'createFolder',
        },
        {
          label: 'Изменить имя папки',
          key: 'editFolder',
        },
        {
          label: 'Удалить папку',
          key: 'deleteFolder',
        },
      ]}
    ></Menu>
  );

  return (
    <>
      {/* <Switch
        checked={theme === 'dark'}
        onChange={changeTheme}
        checkedChildren="Dark"
        unCheckedChildren="Light"
      /> */}
      <Dropdown overlay={menu} trigger={['contextMenu']}>
        <Menu
          theme={theme}
          onClick={onClick}
          onContextMenu={handleContextMenuOnNavbar}
          style={{ textAlign: 'left' }}
          defaultOpenKeys={[currentDirId]}
          selectedKeys={[currentNoteId]}
          mode="inline"
          items={navbar}
        />
      </Dropdown>
    </>
  );
};

export default CustomMenu;
