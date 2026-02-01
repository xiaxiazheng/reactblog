// ColorPickerModal.tsx
import { Button, Modal, message } from 'antd';
import React, { useState, useCallback } from 'react';
import ColorPickerCanvas from './color-picker';
import ModalWrapper from "@/components/modal-wrapper";
import styles from './index.module.scss';

const ColorPickerModal = () => {
    const [open, setOpen] = useState(false);
    const [img, setImg] = useState('');
    const [color, setColor] = useState('');
    const [imgSize, setImgSize] = useState({ width: 0, height: 0 });

    // 从粘贴板获取图片
    const getImgFromCopyBoard = useCallback(async () => {
        try {
            if (!navigator.clipboard?.read) {
                message.warning('您的浏览器不支持剪贴板读取功能');
                return;
            }

            const clipboardItems = await navigator.clipboard.read();

            if (!clipboardItems || clipboardItems.length === 0) {
                message.warning('剪贴板为空或无法读取内容');
                return;
            }

            let imageFound = false;

            for (const clipboardItem of clipboardItems) {
                for (const type of clipboardItem.types) {
                    if (type.startsWith('image/')) {
                        const blob = await clipboardItem.getType(type);
                        const imageUrl = URL.createObjectURL(blob);
                        setImg(imageUrl);
                        setImgSize({ width: 0, height: 0 });
                        setColor('');
                        imageFound = true;
                        message.success('图片获取成功，请点击图片选择颜色');
                        break;
                    }
                }
                if (imageFound) break;
            }

            if (!imageFound) {
                message.warning('未在剪贴板中找到图片');
            }

        } catch (error) {
            console.error('读取剪贴板失败:', error);
            message.error('读取剪贴板失败，请重试');
        }
    }, []);

    // 颜色选择回调
    const handleColorSelect = useCallback((selectedColor: string) => {
        setColor(selectedColor);
    }, []);

    // 图片加载回调
    const handleImageLoad = useCallback((size: { width: number; height: number }) => {
        setImgSize(size);
    }, []);

    // 清理操作
    const handleCancel = useCallback(() => {
        if (img) {
            URL.revokeObjectURL(img);
        }
        setOpen(false);
        setImg('');
        setColor('');
        setImgSize({ width: 0, height: 0 });
    }, [img]);

    const handleRemoveImage = useCallback(() => {
        if (img) {
            URL.revokeObjectURL(img);
            setImg('');
            setImgSize({ width: 0, height: 0 });
            setColor('');
        }
    }, [img]);

    return (
        <>
            <Button size='small' onClick={() => setOpen(true)}>color picker</Button>
            <ModalWrapper
                open={open}
                onCancel={handleCancel}
                footer={null}
                width={'auto'}
                style={{ top: 20 }}
                bodyStyle={{ overflow: 'visible' }}
                title="颜色选择器"
            >
                <div className={styles.wrapper}>
                    {/* 左侧图片区域 */}
                    <div className={styles.leftPart}>
                        {img ? (
                            <ColorPickerCanvas
                                img={img}
                                onColorSelect={handleColorSelect}
                                onImageLoad={handleImageLoad}
                            />
                        ) : (
                            // <div style={{
                            //     flex: 1,
                            //     border: '1px solid #d9d9d9',
                            //     borderRadius: 6,
                            //     padding: 20,
                            //     display: 'flex',
                            //     justifyContent: 'center',
                            //     alignItems: 'center',
                            //     height: 200
                            // }}>
                                <Button
                                    size="large"
                                    onClick={getImgFromCopyBoard}
                                    style={{ width: 160, height: 160 }}
                                >
                                    从粘贴板获取图片
                                </Button>
                            // </div>
                        )}
                    </div>

                    {/* 右侧信息区域 */}
                    <div className={styles.rightPart}>
                        <div className={styles.rightPartContent}>
                            <div>点击图片获取颜色</div>
                            <div className={styles.selectedColor}>
                                <span>当前颜色：</span>
                                <span
                                    className={styles.colorBox}
                                    style={{ backgroundColor: color }}
                                />
                                <span className={styles.colorName} style={{
                                    color: color ? '#000' : '#999'
                                }}>
                                    {color || '未选择'}
                                </span>
                            </div>

                            {color && (
                                <div className={styles.colorDetail}>
                                    <div>HEX: {color}</div>
                                    <div>RGB: {(() => {
                                        const r = parseInt(color.slice(1, 3), 16);
                                        const g = parseInt(color.slice(3, 5), 16);
                                        const b = parseInt(color.slice(5, 7), 16);
                                        return `rgb(${r}, ${g}, ${b})`;
                                    })()}</div>
                                </div>
                            )}

                            {imgSize.width > 0 && (
                                <div style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>
                                    显示尺寸: {(() => {
                                        const { width: naturalWidth, height: naturalHeight } = imgSize;
                                        if (naturalWidth >= 200 && naturalHeight >= 200) {
                                            return `${naturalWidth} × ${naturalHeight} 像素 (原始尺寸)`;
                                        } else {
                                            const scale = naturalWidth < naturalHeight ?
                                                200 / naturalWidth : 200 / naturalHeight;
                                            return `${Math.round(naturalWidth * scale)} × ${Math.round(naturalHeight * scale)} 像素 (已放大)`;
                                        }
                                    })()}
                                </div>
                            )}

                            {color && (
                                <Button type="primary" onClick={() => {
                                    navigator.clipboard.writeText(color).then(() => {
                                        message.success(`已复制: ${color}`);
                                    });
                                }}>
                                    复制颜色值
                                </Button>
                            )}
                        </div>
                        {img && (
                            <Button onClick={handleRemoveImage} danger>
                                移除图片
                            </Button>
                        )}
                    </div>
                </div>
            </ModalWrapper>
        </>
    );
};

export default ColorPickerModal;