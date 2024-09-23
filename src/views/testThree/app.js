import { Signal } from '@/views/testThree/Editor/lib/signals';

// template div {{obj.name = 张三}}

export function loginSignal() {
  // const obj = {
  //   name: '张三',
  // };
  const login = new Signal();
  const loginOut = new Signal();
  // a.add(() => {
  //   console.log('a');
  //   // div.innerHTML = obj.name;
  // });
  // obj.name = '李四';
  // a.dispatch();
  // a.dispatch();
  // a.dispatch();
  return {
    login,
    loginOut,
  };
}

loginSignal().login.add(() => {});
loginSignal().loginOut.add(() => {});

//退出
loginSignal().loginOut.dispatch();

function useXX() {
  const list = [
    //
    { id: 1, name: '张三' },
  ];

  function delByName(name) {
    del((item) => item.name === name);
  }

  function delByIdAndName(id, name) {
    del((item) => item.id === id && item.name === name);
  }

  function delById(id) {
    del((item) => item.id === id);
  }

  function del(callback) {
    const i = list.findIndex(callback);
    if (i > -1) {
      list.splice(i, 1);
    }
  }

  return {
    delById,
    del,
  };
}

useXX().delById(1);
useXX().del((item) => item.id === 1 && item.name === '张三');
