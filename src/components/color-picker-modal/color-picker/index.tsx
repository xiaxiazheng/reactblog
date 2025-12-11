// ColorPickerCanvas.tsx
import React, { useRef, useCallback, useState } from 'react';
import { message } from 'antd';
import styles from './index.module.scss';

interface ColorPickerCanvasProps {
    img: string;
    onColorSelect: (color: string) => void;
    onImageLoad: (size: { width: number; height: number }) => void;
}

const ColorPickerCanvas: React.FC<ColorPickerCanvasProps> = ({
    img,
    onColorSelect,
    onImageLoad
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [imgSize, setImgSize] = useState({ width: 0, height: 0 });

    // 图片加载完成处理
    const handleImageLoad = useCallback(() => {
        if (imgRef.current) {
            const naturalWidth = imgRef.current.naturalWidth;
            const naturalHeight = imgRef.current.naturalHeight;
            const newSize = { width: naturalWidth, height: naturalHeight };
            setImgSize(newSize);
            onImageLoad(newSize);
        }
    }, [onImageLoad]);

    // 计算图片显示尺寸
    const getImageDisplaySize = useCallback(() => {
        const { width: naturalWidth, height: naturalHeight } = imgSize;

        if (naturalWidth === 0 || naturalHeight === 0) {
            return { width: 'auto', height: 'auto' };
        }

        // 严格按需求处理：大于200px不处理，小于200px的等比例放大
        if (naturalWidth >= 200 && naturalHeight >= 200) {
            return {
                width: naturalWidth,
                height: naturalHeight
            };
        } else {
            // 小图片：短边设置为200px，长边按比例计算
            const scale = naturalWidth < naturalHeight ?
                200 / naturalWidth :
                200 / naturalHeight;

            return {
                width: Math.round(naturalWidth * scale),
                height: Math.round(naturalHeight * scale)
            };
        }
    }, [imgSize]);

    // 图片点击事件 - 获取颜色
    const handleImageClick = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
        if (!imgRef.current || !canvasRef.current) {
            message.warning('图片未加载完成');
            return;
        }

        const image = imgRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            message.error('Canvas上下文获取失败');
            return;
        }

        // 设置Canvas尺寸与图片原始尺寸一致
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // 获取图片布局信息
        const rect = image.getBoundingClientRect();

        // 计算缩放比例
        const scaleX = image.naturalWidth / rect.width;
        const scaleY = image.naturalHeight / rect.height;

        // 计算点击位置在原始图片上的准确坐标
        const x = Math.floor((e.clientX - rect.left) * scaleX);
        const y = Math.floor((e.clientY - rect.top) * scaleY);

        // 边界检查
        if (x < 0 || x >= image.naturalWidth || y < 0 || y >= image.naturalHeight) {
            message.warning('点击位置超出图片范围');
            return;
        }

        try {
            // 获取像素数据
            const pixelData = ctx.getImageData(x, y, 1, 1).data;

            // 将RGB转换为十六进制
            const rgbToHex = (r: number, g: number, b: number) => {
                return '#' + [r, g, b].map(c => {
                    const hex = c.toString(16).padStart(2, '0');
                    return hex;
                }).join('').toUpperCase();
            };

            const hexColor = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
            onColorSelect(hexColor);
            message.success(`颜色获取成功: ${hexColor}`);
        } catch (error) {
            message.error('获取颜色失败');
        }
    }, [onColorSelect]);

    const displaySize = getImageDisplaySize();

    return (
        <div className={`ScrollBarLight ${styles.imgBox}`}>
            <img
                ref={imgRef}
                src={img}
                alt="粘贴的图片"
                style={{
                    ...displaySize,
                    cursor: 'crosshair',
                    display: 'block',
                    maxWidth: 'none',
                    maxHeight: 'none'
                }}
                onClick={handleImageClick}
                onLoad={handleImageLoad}
            />

            {/* 隐藏的Canvas用于颜色提取 */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
};

export default ColorPickerCanvas;