import React, { useEffect, useState } from 'react';
import styles from './CustomFindContainer.module.scss';
import { Collapse } from 'antd';
import { NoteSearchItem } from '../../api/Api';
import { api } from '../../api';
import { useDebouncedCallback } from 'use-debounce';
const { Panel } = Collapse;

console.log(styles);

type Props = {
  findValue: string;
};

const CustomFindContainer: React.FC<Props> = ({ findValue }) => {
  const [findList, setFindList] = useState<NoteSearchItem[]>([]);

  const requestFindList = async () => {
    const response = await api.notes.searchCreate({ query: findValue });
    console.log(response, response.data.items);
    setFindList(response.data.items);
  };

  const debouncedSearch = useDebouncedCallback(
    // function
    requestFindList,
    // delay in ms
    300,
  );

  useEffect(() => {
    if (findValue) {
      debouncedSearch();
    }
  }, [findValue]);

  return (
    <div>
      <Collapse
        bordered={false}
        activeKey={findList.map((item) => {
          return `${item.noteId}`;
        })}
        collapsible="icon"
      >
        {findList.map((item) => {
          if (!item.nameHighlight) {
            item.nameHighlight = [item.name];
          }
          if (item.bodyHighlight) {
            return (
              <Panel
                header={
                  <div
                    key={item.noteId}
                    className={styles.markedText}
                    style={{ textAlign: 'left' }}
                    dangerouslySetInnerHTML={{ __html: item.nameHighlight[0] }}
                  />
                }
                key={item.noteId}
              >
                {item.bodyHighlight.map((innerItem, index) => {
                  return (
                    <div key={index}>
                      <p
                        key={index + `__${item.noteId}`}
                        style={{
                          paddingLeft: 12,
                          textAlign: 'left',
                          margin: 0,
                        }}
                        className={styles.markedText}
                        dangerouslySetInnerHTML={{ __html: innerItem }}
                      />
                      {item.bodyHighlight.length - index > 1 && (
                        <hr style={{ opacity: 0.2 }}></hr>
                      )}
                    </div>
                  );
                })}
              </Panel>
            );
          } else {
            return (
              <Panel
                header={
                  <div
                    className={styles.markedText}
                    style={{ textAlign: 'left' }}
                    dangerouslySetInnerHTML={{ __html: item.nameHighlight[0] }}
                  ></div>
                }
                key={item.noteId}
                showArrow={false}
              ></Panel>
            );
          }
        })}
      </Collapse>
    </div>
  );
};

export default CustomFindContainer;
