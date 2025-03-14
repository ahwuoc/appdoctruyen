import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Form, Input, Button, Checkbox, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { AlbumInput, albumSchema } from "../../../../schema/schema-album";
import { PostAlbum, UpdateAlbum } from "../../../../(action)/album";
import { getCategories } from "../../../../(action)/category";
import { AlbumType, CategoryType } from "../../../../../lib/type";
import type { RcFile, UploadFile } from "antd/es/upload/interface";
interface Props
{
    album?: AlbumType;
    onSuccess: () => void;
}
const FromAlbum: React.FC<Props> = ({ album, onSuccess }) => 
{
    const [categories, setCategories] = React.useState<CategoryType[]>([]);

    const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm<AlbumInput>({
        resolver: zodResolver(albumSchema),
        defaultValues: { title: "", content: "", categoryIds: [], imageFile: undefined },
    });

    useEffect(() =>
    {
        const fetchCategories = async () =>
        {
            const data = await getCategories();
            setCategories(data);
        };
        fetchCategories();
    }, []);

    useEffect(() =>
    {
        if (album) {
            setValue("title", album.title);
            setValue("content", album.content);
            setValue("categoryIds", album.categories.map(c => c.id));
            setValue("imageFile", undefined);
        } else {
            reset();
        }
    }, [album, setValue, reset]);

    const onFinish = async (data: AlbumInput) =>
    {
        try {
            if (album) {
                await UpdateAlbum(album.id, data);
                message.success("Cập nhật album thành công!");
            } else {
                await PostAlbum(data);
                message.success("Thêm album thành công!");
            }
            onSuccess(); // Reload danh sách
        } catch (error) {
            console.error("Lỗi:", error);
            message.error("Lưu album thất bại!");
        }
    };

    return (
        <Form onFinish={handleSubmit(onFinish)}>
            <Form.Item label="Tên Album">
                <Controller name="title" control={control} render={({ field }) => <Input {...field} />} />
                {errors.title && <p className="text-red-500">{errors.title.message}</p>}
            </Form.Item>

            <Form.Item label="Nội dung">
                <Controller name="content" control={control} render={({ field }) => <Input.TextArea {...field} />} />
                {errors.content && <p className="text-red-500">{errors.content.message}</p>}
            </Form.Item>

            <Form.Item label="Danh mục">
                <Controller
                    name="categoryIds"
                    control={control}
                    render={({ field }) => (
                        <Checkbox.Group
                            options={categories.map(c => ({ label: c.title, value: c.id }))}
                            {...field}
                        />
                    )}
                />
                {errors.categoryIds && <p className="text-red-500">{errors.categoryIds.message}</p>}
            </Form.Item>

            <Form.Item label="Chọn ảnh bìa">
                <Controller
                    name="imageFile"
                    control={control}
                    render={({ field }) => (
                        <Upload
                            beforeUpload={() => false}
                            listType="picture"
                            maxCount={1}
                            fileList={field.value ? [{
                                uid: "-1",
                                name: field.value.name,
                                status: "done",
                                url: URL.createObjectURL(field.value),
                                originFileObj: field.value as RcFile,
                            }] as UploadFile<RcFile>[] : []}
                            onChange={({ fileList }) =>
                            {
                                setValue("imageFile", fileList[0]?.originFileObj || undefined);
                            }}
                        >
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>

                    )}
                />
                {errors.imageFile && <p className="text-red-500">{errors.imageFile.message}</p>}
            </Form.Item>

            <Button type="primary" htmlType="submit">{album ? "Cập nhật" : "Thêm"} Album</Button>
        </Form>

    );
};

export default FromAlbum;
