// 前端生成水印并且检测DOM的修改
// https://juejin.im/entry/6844903645155164174
// 修改点：
// 1.文字的旋转方式为绕中心旋转，避免文字超出边界的问题；
// 2.允许多次调用该函数，以便动态修改水印内容
// Tips: 仍有可能通过添加 class/id 等方式，使水印被隐藏

let mo: MutationObserver | null = null;

/**
 * 绘制水印
 * @param {object} param0 水印配置
 * @param {boolean} protect 是否保证水印存在
 */
export function useWatermark(
  {
    container = document.body,
    width = "200px",
    height = "150px",
    textAlign = "center",
    textBaseline = "middle",
    font = "16px Microsoft Yahei",
    fillStyle = "rgba(166, 166, 166, 0.56)",
    content = "请勿外传",
    rotate = 30,
    zIndex = 1000,
  } = {},
  protect = true
) {
  const options = arguments[0];

  const __wm = document.querySelector(".__wm");
  // 已存在水印，本次是更新水印。暂时关闭MutationObserver
  if (__wm && mo) {
    mo.disconnect();
    mo = null;
  }

  const canvas = document.createElement("canvas");
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);

  const ctx: any = canvas.getContext("2d");
  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;
  ctx.font = font;
  ctx.fillStyle = fillStyle;
  // 中心放大、绕画布中心旋转
  ctx.translate(parseFloat(width) / 2, parseFloat(height) / 2);
  ctx.scale(2, 2);
  ctx.rotate((Math.PI / 180) * rotate);
  ctx.translate(-parseFloat(width) / 2, -parseFloat(height) / 2);
  ctx.fillText(content, parseFloat(width) / 2, parseFloat(height) / 2);

  const base64Url = canvas.toDataURL();
  const styleStr = `
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    opacity: 0.6;
    z-index:${zIndex};
    pointer-events:none;
    background-repeat:repeat;
    background-image:url('${base64Url}')`; // pointer-events属性使鼠标事件在水印层不触发

  const watermarkDiv = __wm || document.createElement("div");
  watermarkDiv.setAttribute("style", styleStr);
  watermarkDiv.classList.add("__wm");

  if (!__wm) {
    // 首次添加水印
    container.style.position = "relative";
    container.insertBefore(watermarkDiv, container.firstChild);
  }

  // 检测水印DOM是否发生变动，如果变动则重新生成
  const MutationObserver = window.MutationObserver;
  if (MutationObserver && protect) {
    mo = new MutationObserver(function () {
      const __wm = document.querySelector(".__wm");
      // 只在__wm元素变动才重新调用 drawWatermark，避免一直触发
      if ((__wm && __wm.getAttribute("style") !== styleStr) || !__wm) {
        if (!mo) return;
        mo.disconnect();
        mo = null;
        useWatermark({ ...options });
      }
    });

    mo.observe(container, {
      attributes: true,
      subtree: true,
      childList: true,
    });
  }
}
