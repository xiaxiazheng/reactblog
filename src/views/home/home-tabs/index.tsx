import React from "react";
import { Tabs, TabsProps } from "antd";
import HomeTodoCategory from "../home-todo-category";
import HomeTodo from "../home-todo";
import { TodoItemType } from "@xiaxiazheng/blog-libs";

interface IProps {
    type?: 'home' | 'all';
    flag?: number;
    onClick?: (item?: TodoItemType) => void;
}

const HomeTabs: React.FC<IProps> = props => {
    const { type, flag, onClick } = props;

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'category',
            children: <HomeTodoCategory
                type={type}
                flag={flag}
                onClick={onClick}
            />,
        },
        {
            key: '2',
            label: 'list',
            children: <HomeTodo
                flag={flag}
                onClick={onClick}
            />,
        },
    ];

    return (
        <Tabs style={{ color: 'unset' }} items={items} defaultActiveKey="1" />
    )
}

export default HomeTabs;