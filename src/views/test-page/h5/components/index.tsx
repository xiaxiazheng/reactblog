import Image from "./image";
import Header from "./header";

export const componentsList = [
    {
        type: "image",
        Component: Image,
        formItems: [
            {
                key: "image_url",
                label: "图片链接",
                type: "Input",
            },
        ],
        formData: {
            image_url: '默认图片'
        }
    },
    {
        type: "header",
        Component: Header,
        formItems: [
            {
                key: "title",
                label: "标题",
                type: "Input",
            },
        ],
        formData: {
            title: '默认标题'
        }
    },
];

export interface ComponentsType {
    type: "image" | "header";
    Component: React.FC<any>;
    formItems: any[];
    formData: any;
}
