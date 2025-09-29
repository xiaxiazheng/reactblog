import React from "react";
import { Tabs, TabsProps } from "antd";
import HomeTodoCategory from "../home-todo-category";
import HomeTodo from "../home-todo";
import { TodoItemType } from "@xiaxiazheng/blog-libs";

interface IProps {
    type?: 'home' | 'all';
    flag?: number;
    getActiveTodo?: (item?: TodoItemType) => void;
}

const HomeTabs: React.FC<IProps> = props => {
    const { type, flag, getActiveTodo } = props;

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'category',
            children: <HomeTodoCategory
                type={type}
                flag={flag}
                getActiveTodo={getActiveTodo}
            />,
        },
        {
            key: '2',
            label: 'list',
            children: <HomeTodo
                flag={flag}
                onClick={getActiveTodo}
            />,
        },
    ];

    return (
        <Tabs style={{ color: 'unset' }} items={items} defaultActiveKey="1" />
    )
}

export default HomeTabs;