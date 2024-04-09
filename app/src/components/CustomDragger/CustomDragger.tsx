import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Upload, message } from 'antd';
// import { api } from '../../api';

const { Dragger } = Upload;

type Props = {
  isActive: boolean;
  isImage: boolean | null;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  sendFormData: (formData: FormData) => void;
};

// const requestUploadFile = async (file: File) => {
//   console.log('requestUploadFile');
//   const response = await api.recognizer.mixedCreate({ image: file });
//   console.log(response);
// };

const CustomDragger: React.FC<Props> = ({
  isActive,
  isImage,
  setIsActive,
  sendFormData,
}) => {
  const props: UploadProps = {
    name: 'images',
    multiple: false,
    accept: isImage ? 'image/*' : '.mk,.docx,.pdf',
    maxCount: 1,
    customRequest: async (info) => {
      const formData = new FormData();
      formData.append('images', info.file);
      try {
        await sendFormData(formData);
        if (info.onSuccess) {
          info.onSuccess(info.file);
        }
      } catch (error) {
        if (info.onError) {
          // @ts-ignore
          info.onError(error, info.file);
        }
      }
    },
    onChange(info) {
      const { status } = info.file;
      if (status === 'uploading') {
        setIsActive(false);
      }
      if (status === 'done') {
        setIsActive(true);
        message.success(`Файл ${info.file.name} успешно загружен`);
      } else if (status === 'error') {
        message.error(`Файл ${info.file.name} не удалось загрузить`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <Dragger {...props} disabled={!isActive}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibited from uploading
        company data or other banned files.
      </p>
    </Dragger>
  );
};

export default CustomDragger;
