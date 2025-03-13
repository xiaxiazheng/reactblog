import React from "react";
import styles from "./index.module.scss";

interface Props<T> {
    treeList: T[];
    renderTitle: (item: T) => React.ReactNode;
    renderChildren: (item: T) => React.ReactNode;
}

const Tree: <T>(props: Props<T>) => JSX.Element = (
    props
) => {
    const { treeList, renderTitle, renderChildren } = props;

    const renderItem = (treeList?: any[]) => {
        return treeList?.map((item, index) => {
            const key = item?.key || index;
            if (item?.children?.length > 0) {
                return (
                    <div className={styles.subTree} key={key}>
                        <div className={styles.subTreeHeader}>
                            {renderTitle?.(item)}
                        </div>
                        <div className={styles.subTreeContent}>
                            {renderItem(item.children)}
                        </div>
                    </div>
                );
            } else {
                return (
                    <div key={key} className={styles.treeItem}>
                        {renderChildren?.(item)}
                    </div>
                );
            }
        });
    };

    return <div className={styles.tree}>{renderItem(treeList)}</div>;
};

export default Tree;
