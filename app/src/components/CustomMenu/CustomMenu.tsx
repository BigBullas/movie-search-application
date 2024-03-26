import React, { useEffect, useState } from 'react';
import { FileTextOutlined, FolderOutlined } from '@ant-design/icons';
import type { MenuProps, MenuTheme } from 'antd';
import { Menu } from 'antd';
import { api } from '../../api';
import { NotePreview, Dir } from '../../api/Api';

import styles from './CustomMenu.module.scss';
console.log(styles);

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
          console.log(peekDir); // ...обработка данных узла... (вывод в консоль)
          createMenuStructure(dirMap, peekDir, globalNoteList);

          lastDirVisited = memory.pop(); // убираем узел из памяти (стека) и запоминаем его
        }

        // если узел на предыдущей итерации был листом
      } else {
        console.log(peekDir); // ...обработка данных узла... (вывод в консоль)
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

const CustomMenu: React.FC = () => {
  const [theme, setTheme] = useState<MenuTheme>('light');
  const [current, setCurrent] = useState('1');

  const [noteList, setNoteList] = useState<NotePreview[]>([]);
  const [dirList, setDirList] = useState<Dir[]>([]);
  const [navbar, setNavbar] = useState<MenuItem[]>();

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
    console.log('0.3', navbar);
  };

  const createStructure = async () => {
    await requestForNotesOverview();
    await requestForDirOverview();
    createNavbar();
  };

  useEffect(() => {
    createStructure();
  }, []);

  useEffect(() => {
    console.log('createNavbar: ', noteList, dirList, navbar);
    createNavbar();
  }, [noteList, dirList]);

  // useEffect(() => {
  //   console.log('noteList: ', noteList);
  // }, [noteList]);

  // useEffect(() => {
  //   console.log('dirList: ', dirList);
  // }, [dirList]);

  // useEffect(() => {
  //   console.log('navbar: ', navbar);
  // }, [navbar]);

  const requestForNotesOverview = async () => {
    try {
      const response = await api.notes.overviewList();

      console.log('response.data.notes: ', response.data.notes);

      if (response.data.notes) {
        console.log('1');
        setNoteList(response.data.notes);
      }
    } catch (error) {
      console.log('Error in EditPayloadList: ', error);
    }
  };

  const requestForDirOverview = async () => {
    try {
      const response = await api.dirs.overviewList();

      console.log('response.data.dirs: ', response.data.dirs);

      if (response.data.dirs) {
        console.log('2');
        setDirList(response.data.dirs);
      }
    } catch (error) {
      console.log('Error in EditPayloadList: ', error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const changeTheme = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return (
    <>
      {/* <Switch
        checked={theme === 'dark'}
        onChange={changeTheme}
        checkedChildren="Dark"
        unCheckedChildren="Light"
      /> */}
      <Menu
        theme={theme}
        onClick={onClick}
        style={{ textAlign: 'left' }}
        // defaultOpenKeys={['sub1']}
        selectedKeys={[current]}
        mode="inline"
        items={navbar}
      />
      {/* <div className={styles.test001}>ADJDFKSLD</div> */}
    </>
  );
};

export default CustomMenu;

// const items: MenuItem[] = [
//   getItem('Navigation One', 'dirId', <FolderOpenOutlined />, [
//     getItem('name 1', 'noteId 1', <FileTextOutlined />),
//     getItem('Option 2', '2', <FileTextOutlined />),
//     getItem('Option 3', '3', <FileTextOutlined />),
//     getItem('Option 4', '4', <FileTextOutlined />),
//   ]),

//   getItem('Navigation Two', 'sub2', <FolderOutlined />, [
//     getItem('Option 5', '5', <FileTextOutlined />),
//     getItem('Option 6', '6', <FileTextOutlined />),
//     getItem('Submenu', 'sub3', <FolderOutlined />, [
//       getItem('Option 7', '7', <FileTextOutlined />),
//       getItem('Option 8', '8', <FileTextOutlined />),
//     ]),
//   ]),

//   getItem('Navigation Three', 'sub4', <FolderOutlined />, [
//     getItem('Option 9', '9'),
//     getItem('Option 10', '10'),
//     getItem('Option 11', '11'),
//     getItem('Option 12', '12'),
//   ]),
// ];
