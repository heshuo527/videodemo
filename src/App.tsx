import React, { useEffect, useState, FC, Suspense } from 'react';
import QRCode from "qrcode.react"; // 引入二维码组件
import axios from 'axios';
import './app.css'
import Camera from './components/Camera';
import { Popconfirm, Tooltip } from 'antd';

interface DataType {
  url: string;
  img: string;
  title: string;
}

const App: FC = () => {

  const [data, setData] = useState<Array<DataType>>([])

  useEffect(() => {
    axios.get("/durl").then(res => {
      let resArray = [];
      for (const i in res.data) {
        resArray.push(res.data[i]);
      }
      setData([...resArray]);
    });
  }, [])

  function handleMouseOver(event: any) {
    event.currentTarget.controls = true;
  }

  function handleMouseOut(event: any) {
    event.currentTarget.controls = false;
  }

  return (
    <>
      <div className='header'>
        <img src="//cdn.img-sys.com/comdata/92649/202205/20220507150140cb05b7.png" alt="" />
        <h1>MetaBorder元数边界</h1>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <div className='container'>
          {
            data.map((item) => {
              return (
                <Tooltip
                  key={item.title}
                  mouseEnterDelay={0.5}
                  placement="right"
                  title={<Popconfirm
                    placement="bottom"
                    showCancel={false}
                    title="扫我在移动端预览"
                    description={<QRCode value={item.url} size={80} />}
                    okText="关闭"
                  >
                    <a href="#">二维码查看</a>
                  </Popconfirm>}>
                  <div className='row' key={item.title}>
                    <div className='data-items'>
                      <div className='video-wrapper'>
                        <video width="240" height="180" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                          <source src={item.url} type="video/mp4" />
                        </video>
                        <span>{item.title.slice(5)}</span>
                      </div>
                    </div>
                  </div>
                </Tooltip>
              )
            })
          }
        </div>
      </Suspense>
      <div className='footer'>粤ICP备2022050302号</div>
      <Camera />
    </>
  );
}

export default App;