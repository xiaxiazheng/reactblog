import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { IsLoginContext } from "@/context/IsLoginContext";
import {
    addTreeNode,
    getShowTreeList,
    getAllTreeList,
} from "@/client/TreeHelper";
import { Menu, message, Input } from "antd";
import {
    PlusCircleOutlined,
    PlusSquareOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import TreeListItem from "./tree-list-item";
import { ShuttleBox, ShuttleMsgType } from "./shuttle-box";
import Loading from "@/components/loading";
import classnames from "classnames";
import { ThemeContext } from "@/context/ThemeContext";
import { UserContext } from "@/context/UserContext";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { getNodeCont } from "@/client/TreeContHelper";

interface PropsType extends RouteComponentProps {
    first_id: string;
    second_id: string;
    closeDrawer?: Function;
}

const TreeMenu: React.FC<PropsType> = (props) => {
    const { history, match, first_id, second_id, closeDrawer } = props;
    const { theme } = useContext(ThemeContext);
    const { username } = useContext(UserContext);
    const { isLogin } = useContext(IsLoginContext);

    const { SubMenu } = Menu;

    // 仅在第一次进入的时候 loading
    const [loading, setLoading] = useState(true);

    // 初始化页面
    useEffect(() => {
        const init = async () => {
            let id = await getTreeData();
            /** 进入树首页时，默认展开第一个节点 */
            if (JSON.stringify(match.params) === "{}") {
                id !== false && setOpenKeys([id]);
            }
        };
        init();
    }, [username]);

    // 初始化数据
    const [originTreeList, setOriginTreeList] = useState<any[]>([]);
    const [treeList, setTreeList] = useState<any[]>([]);
    const getTreeData = async () => {
        let res: any = false;
        if (isLogin) {
            res = await getAllTreeList();
        } else {
            res = await getShowTreeList(username);
        }
        if (res) {
            // countDiaryData(res);

            setOriginTreeList(res);
            setTreeList(res);
            setLoading(false);
            /** 主要是为了返回给初始化的时候默认展开 */
            return res[0] ? res[0].id : false;
        }
        return false;
    };

    // 用来获取 diary 这个分类下的数据
    const countDiaryData = (res: any) => {
        const idList = res
            .find((item: any) => item.label === "Diary")
            .children.map((item: any) => item.id);

        // 确保这个函数只跑最多五个，其他的要等才行
        let count = 0;
        let list: any[] = [];
        const runFive = async (fn: any) => {
            const promise = new Promise((resolve) => {
                list.push(resolve);
            });

            if (count < 5) {
                count++;
                list.shift()();
            }

            await promise;
            await fn();

            count--;
            list.length !== 0 && list.shift()();
        };

        let dataList: any = [];
        const getTreeCont = async (id: string) => {
            const res = await getNodeCont(id);
            dataList = dataList.concat(res);
            // console.log(dataList);
        };

        idList.forEach((id: string) => {
            runFive(() => getTreeCont(id));
        });
    };

    // 根据当前路由匹配默认展开的树
    const [openKeys, setOpenKeys] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    useEffect(() => {
        if (JSON.stringify(match.params) !== "{}") {
            setOpenKeys([`${first_id}`]);
            setSelectedKeys([`${second_id}`]);
        }
    }, [match.params]);

    // 点击树节点
    const clickTreeNode = (
        level: string,
        first_id: string,
        second_id?: string
    ) => {
        if (level === "level1") {
            if (openKeys.indexOf(`${first_id}`) === -1) {
                setOpenKeys([`${first_id}`]);
            } else {
                setOpenKeys([]);
            }
        }
        if (level === "level2") {
            closeDrawer && closeDrawer();
            history.push(
                `${isLogin ? "/admin" : ""}/tree/${first_id}/${second_id}`
            );
        }
    };

    // 新增树节点
    const addNewTreeNode = async (
        addtype: "front" | "behind",
        level: "level1" | "level2",
        first_id?: any,
        first_label?: string,
        first_sort?: number,
        childSort?: number
    ) => {
        let params = {};
        // 新增一级节点
        if (level === "level1") {
            params = {
                level: 1,
                sort:
                    addtype === "front"
                        ? treeList[0].sort
                        : treeList[treeList.length - 1].sort,
                addtype: addtype,
            };
        }
        // 新增二级节点
        if (level === "level2") {
            params = {
                level: 2,
                f_id: first_id,
                f_label: first_label,
                f_sort: first_sort,
                c_sort: childSort,
                addtype: addtype,
            };
        }
        const res = await addTreeNode(params);
        if (res) {
            message.success(`新建${level}节点成功`);
            getTreeData();
        } else {
            message.error(`新建${level}节点失败`);
        }
    };

    const [isShuttle, setIsShuttle] = useState(false);
    /** 保存更换父节点需要的信息 */
    const [shuttleMsg, setShuttleMsg] = useState<ShuttleMsgType>({
        c_label: "",
        c_id: "",
        f_id: "",
        options: [],
    });

    // 打开穿梭框，并保存相关信息
    const openShuttle = (c_id: string, c_label: string, f_id: string) => {
        setShuttleMsg({
            c_label: c_label,
            c_id: c_id,
            f_id: f_id,
            options: originTreeList.map((item) => {
                return {
                    f_id: item.id,
                    f_label: item.label,
                    f_sort: item.sort,
                    last_child_sort:
                        item.children[item.children.length - 1].sort,
                };
            }),
        });
        setIsShuttle(true);
    };

    /** 删除节点成功后，判断一下是否删除的是当前路由 */
    const afterDelete = (
        level: "level1" | "level2",
        deletedId: number | string
    ) => {
        let id = String(deletedId); // 被成功删除的节点的 id
        if (level === "level1" && first_id === id) {
            history.push(`${isLogin ? "/admin" : ""}/tree`);
        } else if (level === "level2" && second_id === id) {
            history.push(`${isLogin ? "/admin" : ""}/tree`);
            setOpenKeys([first_id]);
        } else {
            return;
        }
        /** 删除的是当前路由，就要清空被选择项 */
        setSelectedKeys([]);
    };

    const [keyword, setKeyword] = useState("");
    // 搜索整棵树，如果上层匹配到就返回该层，如果没有匹配到就往下层找（用 new RegExp 是为了用 i 不区分大小写）
    const handleKeyword = (e: any) => {
        setKeyword(e.target.value);
        let keyword = e.target.value.toLowerCase();
        // console.log("originTreeList", originTreeList);

        // 搜第一层
        let list = originTreeList.map((item: any) => {
            // 如果第一层包含关键字，返回该层
            if (new RegExp(keyword, "gi").test(item.label)) {
                return item;
            } else {
                // 否则搜第二层
                let newItemChildren = item.children.filter((jtem: any) => {
                    // 如果第二层包含关键字，返回该层
                    return new RegExp(keyword, "gi").test(jtem.label);
                });
                // 如果有搜索结果，则返回该层，而且替换掉第一层的 children
                if (newItemChildren.length !== 0) {
                    return {
                        ...item,
                        children: newItemChildren,
                    };
                } else {
                    // 二层没有搜索结果，返回 false
                    return false;
                }
            }
        });
        // 去掉第一层没有搜到的项
        list = list.filter((item: any) => {
            return item !== false;
        });
        // 输入第一层
        setTreeList(list);
    };

    const treeMenuClass = classnames({
        [styles.treeMenu]: true,
        ScrollBar: true,
    });

    return (
        <>
            {/* 筛选关键字输入框 */}
            <div className={styles.treeFilter}>
                <Input
                    className={styles.treeFilterInput}
                    value={keyword}
                    onChange={handleKeyword}
                    allowClear
                    prefix={<SearchOutlined />}
                />
            </div>
            {/* 树 */}
            {loading && <Loading />}
            <Menu
                className={treeMenuClass}
                mode="inline"
                theme={theme}
                openKeys={openKeys}
                selectedKeys={selectedKeys}
            >
                {
                    /** 在上方添加一级节点 */
                    isLogin && (
                        <Menu.Item>
                            <PlusCircleOutlined
                                className={styles.addRootTreenode}
                                title="新增首位一级节点"
                                onClick={() =>
                                    addNewTreeNode("front", "level1")
                                }
                            />
                        </Menu.Item>
                    )
                }
                {
                    /** 第一层 */
                    treeList.map((item: any, index: number) => {
                        return (
                            <SubMenu
                                key={item.id}
                                onTitleClick={() =>
                                    clickTreeNode("level1", item.id)
                                }
                                title={
                                    <TreeListItem
                                        isOnly={treeList.length === 1}
                                        isFirst={index === 0}
                                        isLast={index === treeList.length - 1}
                                        level="level1"
                                        label={item.label}
                                        id={item.id}
                                        sort={item.sort}
                                        isShow={item.isShow}
                                        previousSort={
                                            index !== 0
                                                ? treeList[index - 1].sort
                                                : -1
                                        }
                                        previousId={
                                            index !== 0
                                                ? treeList[index - 1].id
                                                : ""
                                        }
                                        nextSort={
                                            index !== treeList.length - 1
                                                ? treeList[index + 1].sort
                                                : -1
                                        }
                                        nextId={
                                            index !== treeList.length - 1
                                                ? treeList[index + 1].id
                                                : ""
                                        }
                                        getTreeData={getTreeData}
                                        keyword={keyword}
                                        afterDelete={afterDelete}
                                    />
                                }
                            >
                                {
                                    /** 在上方添加二级节点 */
                                    isLogin && (
                                        <Menu.Item>
                                            <PlusCircleOutlined
                                                className={
                                                    styles.addRootTreenode
                                                }
                                                title="新增首位二级节点"
                                                onClick={() =>
                                                    addNewTreeNode(
                                                        "front",
                                                        "level2",
                                                        item.id,
                                                        item.label,
                                                        item.sort,
                                                        item.children[0].sort
                                                    )
                                                }
                                            />
                                        </Menu.Item>
                                    )
                                }
                                {
                                    /** 第二层 */
                                    item.children.map(
                                        (jtem: any, jndex: number) => {
                                            return (
                                                <Menu.Item
                                                    key={jtem.id}
                                                    onClick={() =>
                                                        clickTreeNode(
                                                            "level2",
                                                            item.id,
                                                            jtem.id
                                                        )
                                                    }
                                                >
                                                    <TreeListItem
                                                        second_id={second_id}
                                                        grandFatherChildren={item.children.map(
                                                            (i: any) => {
                                                                return {
                                                                    id: i.id,
                                                                    label: i.label,
                                                                };
                                                            }
                                                        )}
                                                        fatherId={item.id}
                                                        isOnly={
                                                            item.children
                                                                .length === 1
                                                        }
                                                        isFirst={jndex === 0}
                                                        isLast={
                                                            jndex ===
                                                            item.children
                                                                .length -
                                                                1
                                                        }
                                                        level="level2"
                                                        label={jtem.label}
                                                        id={jtem.id}
                                                        isShow={jtem.isShow}
                                                        sort={jtem.sort}
                                                        previousSort={
                                                            jndex !== 0
                                                                ? item.children[
                                                                      jndex - 1
                                                                  ].sort
                                                                : -1
                                                        }
                                                        previousId={
                                                            jndex !== 0
                                                                ? item.children[
                                                                      jndex - 1
                                                                  ].id
                                                                : ""
                                                        }
                                                        nextSort={
                                                            jndex !==
                                                            item.children
                                                                .length -
                                                                1
                                                                ? item.children[
                                                                      jndex + 1
                                                                  ].sort
                                                                : -1
                                                        }
                                                        nextId={
                                                            jndex !==
                                                            item.children
                                                                .length -
                                                                1
                                                                ? item.children[
                                                                      jndex + 1
                                                                  ].id
                                                                : ""
                                                        }
                                                        openShuttle={
                                                            openShuttle
                                                        }
                                                        getTreeData={
                                                            getTreeData
                                                        }
                                                        keyword={keyword}
                                                        afterDelete={
                                                            afterDelete
                                                        }
                                                    />
                                                </Menu.Item>
                                            );
                                        }
                                    )
                                }
                                {
                                    /** 在下方添加二级节点 */
                                    isLogin && (
                                        <Menu.Item>
                                            <PlusSquareOutlined
                                                className={
                                                    styles.addRootTreenode
                                                }
                                                title="新增末位二级节点"
                                                onClick={() =>
                                                    addNewTreeNode(
                                                        "behind",
                                                        "level2",
                                                        item.id,
                                                        item.label,
                                                        item.sort,
                                                        item.children[
                                                            item.children
                                                                .length - 1
                                                        ].sort
                                                    )
                                                }
                                            />
                                        </Menu.Item>
                                    )
                                }
                            </SubMenu>
                        );
                    })
                }
                {
                    /** 在下方添加一级节点 */
                    isLogin && (
                        <Menu.Item>
                            <PlusSquareOutlined
                                className={styles.addRootTreenode}
                                title="新增末位根节点"
                                onClick={() =>
                                    addNewTreeNode("behind", "level1")
                                }
                            />
                        </Menu.Item>
                    )
                }
            </Menu>
            {/* 穿梭提示框 */}
            <ShuttleBox
                isShuttle={isShuttle}
                treeList={treeList}
                shuttleMsg={shuttleMsg}
                confirmShuttle={async () => {
                    await getTreeData();
                    setIsShuttle(false);
                }}
                closeShuttle={() => setIsShuttle(false)}
            />
        </>
    );
};

export default withRouter(TreeMenu);
