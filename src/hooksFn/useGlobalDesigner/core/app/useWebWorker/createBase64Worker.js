import { useWebWorker, useWebWorkerFn } from '@vueuse/core';
import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';

export function CreateBase64Worker() {
  function send(image) {
    return new Promise((fulfill, reject) => {
      const { data, post, terminate, worker } = useWebWorker('/jpeg-web-worker.js');
      // console.log('data:', data);
      // console.log('post:', post);
      // console.log('terminate:', terminate);
      // console.log('worker:', worker);

      // 发送
      post({
        image: image,
        quality: 50,
      });

      worker.value.onmessage = (e) => {
        // console.log('e worker.onmessage:', e);
        // e.data is the imageData of the jpeg. {data: U8IntArray, height: int, width: int}
        // you can still convert the jpeg imageData into a blog like this:
        const blob = new Blob([e.data.data], { type: 'image/png' });
        blobToDataURL(blob).then((imageURL) => {
          // console.log('imageUrl:', imageURL);
          data.value = imageURL;
          fulfill(imageURL);
        });

        // 停止
        terminate();
      };
    });
  }

  return {
    send,
  };
}

function blobToDataURL(blob) {
  return new Promise((fulfill, reject) => {
    let reader = new FileReader();
    // console.log('blob:', blob);
    reader.onerror = reject;
    reader.onload = (e) => {
      // console.log('e:', e);
      // console.log('reader.result:', reader.result);
      fulfill(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}
