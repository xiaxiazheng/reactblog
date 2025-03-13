import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../rematch";
import styles from "./index.module.scss";
import Loading from "@/components/loading";
import TodoTypeIcon from "../../component/todo-type-icon";
import TodoTree from "../../component/todo-tree";

const TodoHabit = () => {
    const habitLoading = useSelector(
        (state: RootState) => state.data.habitLoading
    );
    const habitList = useSelector((state: RootState) => state.data.habitList);
    const habitListOrigin = useSelector(
        (state: RootState) => state.data.habitListOrigin
    );
    const dispatch = useDispatch<Dispatch>();
    const { setHabitList, getFilterList } = dispatch.data;
    useEffect(() => {
        setHabitList(getFilterList({ list: habitListOrigin, type: "habit" }));
    }, [habitListOrigin]);

    const [isHide, setIsHide] = useState<boolean>(false);

    return (
        <>
            <div className={styles.list}>
                {habitLoading && <Loading />}
                <div className={styles.header}>
                    <span
                        style={{ color: "#1890ffcc" }}
                        onClick={() => setIsHide(!isHide)}
                    >
                        <TodoTypeIcon type="habit" /> 目录
                    </span>
                </div>
                <div style={{ padding: "0 0 10px 20px" }}>
                    <TodoTree todoList={habitList} dataMode="flat" />
                </div>
            </div>
        </>
    );
};

export default TodoHabit;
