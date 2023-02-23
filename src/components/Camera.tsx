import React, { FC, useRef, useState } from 'react'
import { VideoCameraAddOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { FloatButton, Modal } from 'antd'

const Camera: FC = () => {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const cameraVideoRef = useRef<HTMLVideoElement>(null)

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
            <FloatButton.Group
                trigger="hover"
                type='primary'
                shape="square"
                description="摄影"
                style={{ right: 28, bottom: 80 }}
                icon={<VideoCameraOutlined />}
            >
                <FloatButton icon={<VideoCameraAddOutlined />} onClick={showModel} />
            </FloatButton.Group>
            <Modal mask={false} width={800} title="打开摄像头" cancelText='关闭' okText='打开' open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <video
                    ref={cameraVideoRef}
                    style={{
                        width: '750px', height: '540px'
                    }}
                />
            </Modal>
        </>
    )
}

export default Camera