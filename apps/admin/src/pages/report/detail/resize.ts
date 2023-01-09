import { debounce } from '@vben/utils';
// 性能指标看版和通用指标看版优化

let $_sidebarElm:any = {};
let __resizeHandler;

function $_sidebarResizeHandler(e) {
  if (e.propertyName === 'width') {
    __resizeHandler();
  }
}

export function bindResize(chart:any = {}, echartInstance:any = {}) {
  __resizeHandler = debounce(() => {
    if (chart && Object.keys(chart).length !== 0) {
      if (chart._disposed) return;
      chart.resize();
    } else if (Object.keys(echartInstance).length !== 0) {
      if (echartInstance._disposed) return;
      echartInstance.resize();
    }
  }, 100);
  window.addEventListener('resize', __resizeHandler);

  $_sidebarElm = document.getElementsByClassName('sidebar-container')[0];
  $_sidebarElm && $_sidebarElm.addEventListener('transitionend', $_sidebarResizeHandler);
}

export function unBindResize() {
  window?.removeEventListener('resize', __resizeHandler);
  $_sidebarElm &&
    $_sidebarElm.removeEventListener &&
    $_sidebarElm.removeEventListener('transitionend', $_sidebarResizeHandler);
}
