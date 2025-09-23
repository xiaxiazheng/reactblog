import { getHomeList, MarkdownShow, splitStr, splitMdStr, TodoItemTitle, TodoItemType } from '@xiaxiazheng/blog-libs';
import { Input, Pagination } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import List from '../../todo-list/todo-split-day-list';
import { SortKeyMap } from '../../todo-list/component/sort-btn';
import { formatArrayToTimeMap } from '../../todo-list/utils';
import TodoItemName from '../../todo-list/component/todo-item/todo-item-name';
import styles from './index.module.scss';
import Loading from '@/components/loading';

const HomeTodo: React.FC = () => {

    const getData = async () => {
        setLoading(true);
        try {
            const res = await getHomeList({
                pageNo,
                pageSize,
                keyword
            });
            if (res) {
                setTodoList(res.data.list);
                setTotal(res.data.total);
            }
        } finally {
            setLoading(false);
        }
    }

    const [loading, setLoading] = useState<boolean>(false);
    const [todoList, setTodoList] = useState<TodoItemType[]>([]);
    const [total, setTotal] = useState<number>(0);

    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [keyword, setKeyword] = useState('');
    const [activeTodo, setActiveTodo] = useState<TodoItemType | null>(null);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getData();
    }, [pageNo, pageSize]);

    const handleSearch = () => {
        if (pageNo !== 1) {
            setPageNo(1);
        } else {
            getData();
        }
    }

    return (
        <div className={styles.homeTodo}>
            {/* 搜索框 */}
            <Input.Search
                className={styles.input}
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onPressEnter={handleSearch}
                onSearch={handleSearch}
                placeholder='请输入搜索关键词'
            />
            {/* 内容 */}
            <div className={styles.todoBox}>
                <div className={`${styles.boxLeft} ScrollBar`}>
                    {loading && <Loading />}
                    {todoList?.map(item => {
                        return (
                            <TodoItemTitle
                                key={item.todo_id}
                                item={item}
                                keyword={keyword}
                                wrapperStyle={{
                                    marginBottom: '12px',
                                    cursor: 'pointer',
                                }}
                                onClick={(item) => {
                                    setActiveTodo(item);
                                    ref?.current?.scroll?.({
                                        top: 0,
                                        behavior: 'smooth',
                                    });
                                }}
                            />
                        )
                    })}
                    <Pagination
                        className={styles.pagination}
                        current={pageNo}
                        pageSize={pageSize}
                        total={total}
                        onChange={(page, pageSize) => {
                            setPageNo(page);
                            setPageSize(pageSize || 15);
                        }}
                        pageSizeOptions={["10", "15", "20"]}
                        showTotal={() => `共 ${total} 条 `}
                    />
                </div>
                <div className={`${styles.boxRight} ScrollBar`} ref={ref}>
                    {activeTodo && <>
                        <div style={{ textAlign: 'left' }}>
                            <TodoItemTitle item={activeTodo} keyword={keyword} />
                        </div>
                        <div>
                            <MarkdownShow blogcont={activeTodo.description.replaceAll(splitStr, splitMdStr)} keyword={keyword} />
                        </div>
                    </>}
                </div>
            </div>
        </div>
    )
}

export default HomeTodo;