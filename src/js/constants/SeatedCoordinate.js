const CAMERA_PIXEL = () => [2592, 1944] // camera 解析度，目前為 2592 * 1944
const CAMERA_X_MAX = () => 49 // 把畫面橫切成49等分
const CAMERA_Y_MAX = () => 20 // 把畫面直切成20等分
export const cameraProportion = () => ({ x: CAMERA_PIXEL[0] / CAMERA_X_MAX, y: CAMERA_PIXEL[1] / CAMERA_Y_MAX }) // 算出每一等分為多少 pixel

// 每個位子的好球帶
export const seatedCoordinate = () => ({
  A: {
    3: { leftTop: [3, 8], rightBottom: [16, 20] },
    4: { leftTop: [16, 8], rightBottom: [27, 20] },
    5: { leftTop: [27, 8], rightBottom: [37, 20] },
    6: { leftTop: [37, 8], rightBottom: [49, 20] },
  },
  B: {
    0: { leftTop: [0, 9], rightBottom: [13, 20] },
    1: { leftTop: [13, 9], rightBottom: [26, 20] },
    2: { leftTop: [26, 9], rightBottom: [35, 20] },
    3: { leftTop: [35, 9], rightBottom: [49, 20] },
  },
})
