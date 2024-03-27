import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import { api } from '../../api';

const { Dragger } = Upload;

type Props = {
  isActive: boolean;
  isImage: boolean | null;
};

const requestUploadFile = async (file: File) => {
  console.log('requestUploadFile');
  const response = await api.recognizer.mixedCreate({ image: file });
  console.log(response);
};

const props: UploadProps = {
  name: 'file',
  multiple: true,
  action: '',
  // action: 'https://smartlectures.ru/recognizer/mixed',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      requestUploadFile(info.file.originFileObj);
      console.log('uploading', info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`done ${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`error ${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

const CustomDragger: React.FC<Props> = ({ isActive, isImage }) => {
  console.log('isImage', isImage);
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
