import { getHomeList, TodoItem, TodoItemType, TodoDescription } from '@xiaxiazheng/blog-libs';
import { Input, Pagination } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import Loading from '@/components/loading';

interface IProps {
    flag?: number;
    onClick?: (item: TodoItemType) => void;
}

const HomeTodo: React.FC<IProps> = (params) => {
    const { flag, onClick } = params;

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
                if (activeTodo) {
                    const todo = res.data.list.find(item => item.todo_id === activeTodo.todo_id);
                    if (todo) {
                        setActiveTodo(todo);
                    }
                }
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
    }, [pageNo, pageSize, flag]);

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
                            <TodoItem
                                key={item.todo_id}
                                item={item}
                                keyword={keyword}
                                showDoneStrinkLine={false}
                                showFootPrint={false}
                                showCanShowInHomeTodoIcon={false}
                                wrapperStyle={{
                                    marginBottom: '12px',
                                    cursor: 'pointer',
                                }}
                                onClick={(item) => {
                                    setActiveTodo(item);
                                    onClick?.(item);
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
                            <TodoItem
                                item={activeTodo}
                                keyword={keyword}
                                showDoneStrinkLine={false} />
                        </div>
                        <div>
                            <TodoDescription todoDescription={activeTodo.description} keyword={keyword} />
                        </div>
                    </>}
                </div>
            </div>
        </div>
    )
}

export default HomeTodo;