const serverAddr = "https://mindmirror.leckrapi.xyz";
const localAddr = "http://192.168.2.57:4006";
const devLocal = false;

const Constants = {
  SERVER_ADDR: __DEV__ && devLocal ? localAddr : serverAddr,
  VERSION: "1",
};
export default Constants;
