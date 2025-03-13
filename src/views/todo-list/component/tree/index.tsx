import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';

interface Props<T> {
    idKey?: string;
    fatherIdKey?: string;
    items: T[];
    renderTitle: (item: T) => React.ReactNode;
    renderChildren: (item: T) => React.ReactNode;
}

const Tree: <T>(props: Props<T>) => JSX.Element = (props) => {
    const { idKey = 'id', fatherIdKey = 'other_id', items, renderTitle, renderChildren } = props;

    function getItems<T>(prelist: T[]) {
        const list = [...prelist];
        const map = list.reduce((prev: any, cur: any) => {
            prev[cur[idKey]] = cur;
            cur.children = [];
            return prev;
        }, {});
        const l: T[] = [];
        list.forEach((item: any) => {
            item.key = item[idKey];
            item.label = item.name;
            if (item[fatherIdKey] && map[item[fatherIdKey]]) {
                map[item[fatherIdKey]].children.push(item);
            } else {
                l.push(item);
            }
        });
        return l;
    }
    const [treeList, setTreeList] = useState<any[]>([]);
    useEffect(() => {
        setTreeList(getItems(items));
    }, [items]);

    const renderItem = (items?: any[]) => {
        return items?.map(item => {
            if (item?.children?.length > 0) {
                return <div className={styles.subTree} key={item.key}>
                    <div className={styles.subTreeHeader}>{renderTitle?.(item)}</div>
                    <div className={styles.subTreeContent}>{renderItem(item.children)}</div>
                </div>
            } else {
                return <div key={item.key} className={styles.treeItem}>{renderChildren?.(item)}</div>
            }
        });
    }

    return <div className={styles.tree}>{renderItem(treeList)}</div>;
}

export default Tree;