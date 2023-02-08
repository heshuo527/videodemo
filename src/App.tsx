import React, { useEffect, useState, FC, useRef } from 'react';
import axios from 'axios';
import { Table, Layout, Space, QRCode, FloatButton, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CameraOutlined, QuestionCircleOutlined, VideoCameraAddOutlined, VideoCameraOutlined } from '@ant-design/icons';

interface DataType {
  key?: string;
  url: string;
  img: string;
  title: string;
}

const { Header } = Layout;

const App: FC = () => {

  const [data, setData] = useState<Array<DataType>>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const cameraVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    axios.get("/durl").then(res => {
      let resArray = [];
      for (const i in res.data) {
        resArray.push(res.data[i]);
      }
      setData([...resArray]);
    });
  }, [])

  const columns: ColumnsType<DataType> = [
    {
      title: '视频ID',
      dataIndex: 'title',
      key: 'title',
      render: (_, data) => {
        return (
          <h3>
            {data.title}
          </h3>
        )
      }
    },
    {
      title: '图片查看',
      dataIndex: 'img',
      key: 'img',
      render: (_, data) => {
        return (
          <img style={{ width: '230px' }} src={data.img} alt={data.title} />
        )
      }
    },
    {
      title: '二维码查看',
      dataIndex: 'url',
      key: 'url',
      render: (_, data) => {
        return (
          <QRCode
            value={data.url} //value参数为生成二维码的链接
            size={110} //二维码的宽高尺寸
          />
        )
      }
    },
    {
      title: '视频预览',
      dataIndex: 'img',
      key: 'img',
      render: (_, data) => {
        return (
          <video width="240" height="180" controls>
            <source src={data.url} type="video/mp4" />
          </video>
        )
      }
    }
  ];

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 50,
    lineHeight: '64px',
    backgroundColor: '#7dbcea',
  };

  function successFunc(mediaStream: MediaStream) {
    const video = cameraVideoRef.current;
    // 旧的浏览器可能没有srcObject
    if (video && 'srcObject' in video) {
      video.srcObject = mediaStream;
    }
    video!.onloadedmetadata = () => {
      video!.play();
    };
  }

  function errorFunc(err: { name: string; message: string; }) {
    console.log(`${err.name}: ${err.message}`);
  }

  const startCamera = () => {
    const opt = {
      audio: false,
      video: {
        width: 1280,
        height: 720
      }
    };
    navigator.mediaDevices.getUserMedia(opt).then(successFunc).catch(errorFunc);
  }

  const closeMedia = () => {
    const video = cameraVideoRef.current;
    const stream = video?.srcObject;
    if (stream && 'getTracks' in stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track: { stop: () => void; }) => {
        track.stop();
      });
    }
  };

  const showModel = () => {
    setIsModalOpen(true);
  }

  const handleOk = () => {
    startCamera()
  };

  const handleCancel = () => {
    closeMedia()
    setIsModalOpen(false)
  };

  return (
    <>
      <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
        <Layout>
          <Header style={headerStyle}><span style={{ fontSize: '30px' }}>元数边界</span></Header>
          <Table size='small' columns={columns} dataSource={data} />
        </Layout>
      </Space>
      <FloatButton.Group
        trigger="click"
        type="primary"
        style={{ right: 28, bottom: 80 }}
        icon={<VideoCameraOutlined />}
      >
        <FloatButton icon={<CameraOutlined />} />
        <FloatButton icon={<VideoCameraAddOutlined />} onClick={showModel} />
        <FloatButton icon={<QuestionCircleOutlined />} target='www.baidu.com' />
      </FloatButton.Group>
      <Modal mask={false} width={800} title="拨打视频" cancelText='挂断' okText='拨打' open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <video
          ref={cameraVideoRef}
          style={{
            width: '750px', height: '540px'
          }}
        />
      </Modal>
    </>
  );
}

export default App;
