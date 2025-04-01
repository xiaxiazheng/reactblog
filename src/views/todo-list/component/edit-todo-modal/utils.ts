import dayjs from 'dayjs';

export const titleMap = {
    add: "新增",
    edit: "编辑",
    copy: "复制",
    add_child: "添加子任务",
    add_progress: "新增进度",
};

export const handleFormData = (formData: any) => {
    return {
        name: formData.name,
        time: dayjs(formData.time).format("YYYY-MM-DD"),
        status: formData.status,
        description: formData.description || "",
        color: formData.color,
        category: formData.category,
        other_id: formData.other_id || "",
        doing: formData.doing || "0",
        isNote: formData.isNote || "0",
        isTarget: formData.isTarget || "0",
        isWork: formData.isWork || "0",
        isBookMark: formData.isBookMark || "0",
        isHabit: formData.isHabit || "0",
        isKeyNode: formData.isKeyNode || "0",
        isFollowUp: formData.isFollowUp || "0",
    };
};