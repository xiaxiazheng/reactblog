import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";

const Transform = () => {
    const [file, setFile] = useState<any>();
    const [blob, setBlob] = useState<any>();
    const [base64, setBase64] = useState<string>();
    const [url, setUrl] = useState<string>();

    useEffect(() => {
        console.log("______________________");
        console.log("file", file);
        console.log("blob", blob);
        console.log("base64", base64);
        console.log("url", url);
    }, [file, blob, base64, url]);

    const fileToBlob = () => {
        if (file) {
            const blob = new Blob([file], {
                type: file.type || "image/png",
            });
            setBlob(blob);            
        }
    };

    const blobToFile = () => {
        if (blob) {
            const file = new File([blob], "一个文件", {
                type: blob.type || "image/png",
            });
            setFile(file);            
        }
    };

    const fileToBase64 = () => {
        if (file) {
            const reader = new FileReader();
            // 传入一个参数对象即可得到基于该参数对象的文本内容
            reader.readAsDataURL(file);
            reader.onload = function (e: any) {
                // target.result 该属性表示目标对象的 DataURL
                setBase64(e.target.result);
            };            
        }
    };

    const blobToBase64 = () => {
        if (blob) {
            var reader = new FileReader();
            reader.onload = function (e: any) {
                setBase64(e.target.result);
            };
            reader.readAsDataURL(blob);            
        }
    };

    const base64ToBlob = () => {
        if (base64) {
            let arr = base64.split(","),
                mime = arr[0].match(/:(.*?);/)?.[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            console.log(new Blob([u8arr], { type: mime }));
            setBlob(new Blob([u8arr], { type: mime }));
        }
    };

    const fileToUrl = () => {
        if (file) {
            const url = window.URL.createObjectURL(file);
            setUrl(url);            
        }
    };

    const blobToUrl = () => {
        if (blob) {
            const url = window.URL.createObjectURL(blob);
            setUrl(url);            
        }
    };

    const urlToBlob = () => {
        if (url) {
            fetch(url)
                .then((res) => res.blob())
                .then((blob) => setBlob(blob));
        }
    };

    return (
        <div className={styles.transform}>
            <input
                type="file"
                onChange={(e) => {
                    setFile(e.target.files?.[0] || undefined);
                }}
            />
            <span>先上传一张 png 图片，打开控制台查看结果</span>
            <button onClick={fileToBlob}>fileToBlob</button>
            <button onClick={blobToFile}>blobToFile</button>
            <button onClick={fileToBase64}>fileToBase64</button>
            <button onClick={fileToUrl}>fileToUrl</button>
            <button onClick={blobToBase64}>blobToBase64</button>
            <button onClick={base64ToBlob}>base64ToBlob</button>
            <button onClick={blobToUrl}>blobToUrl</button>
            <button onClick={urlToBlob}>urlToBlob</button>
        </div>
    );
};

export default Transform;
