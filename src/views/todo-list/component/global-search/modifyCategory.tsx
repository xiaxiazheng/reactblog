import { Button, Input, message, Modal, Radio, Select } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '../../rematch';
import { modifyTodoCategory } from '@xiaxiazheng/blog-libs';

/** 批量修改 todo 的 category */
const ModifyCategory = () => {
    const dispatch = useDispatch<Dispatch>();
    const { refreshData } = dispatch.data;

    const [open, setOpen] = useState(false);
    const onCancel = () => {
        setOpen(false);
        setActiveCategory('');
    }

    const onOk = async () => {
        if (!activeCategory) {
            message.warning('请选择旧类别', 1);
            return;
        }
        if (!newCategory.trim()) {
            message.warning('请输入新类别名称, 不能只有空格', 1);
            return;
        }
        const res = await modifyTodoCategory({
            category: activeCategory,
            newCategory: newCategory
        });
        if (res?.resultsCode === 'success') {
            refreshData();
            message.success('修改成功', 1);
            setOpen(false);
            setActiveCategory('');
        }
    }

    const category = useSelector((state: RootState) => state.data.category);

    const [activeCategory, setActiveCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');

    return (
        <div>
            批量修改类别：<Button onClick={() => setOpen(true)}>修改类别</Button>
            <Modal open={open} onCancel={onCancel} onOk={onOk} destroyOnClose>
                <div>
                    <div>
                        <span>旧类别：</span>
                        <Radio.Group
                            value={activeCategory}
                            onChange={e => setActiveCategory(e.target.value)}
                            options={category.map(item => ({
                                label: item.category,
                                value: item.category
                            }))}
                        />
                    </div>
                    <div>
                        <span>新类别名称：</span>
                        <Input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ModifyCategory;