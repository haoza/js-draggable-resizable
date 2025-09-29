/**
 * DraggableResizable - 纯JavaScript实现的拖拽和调整大小库
 */

class DraggableResizable {
  constructor(element, options = {}) {
    // 基础元素
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.element) {
      throw new Error('Element not found');
    }

    // 默认配置
    this.defaultOptions = {
      // 基础配置
      className: 'vdr',
      classNameDraggable: 'draggable',
      classNameResizable: 'resizable',
      classNameDragging: 'dragging',
      classNameResizing: 'resizing',
      classNameActive: 'active',
      classNameHandle: 'handle',
      
      // 行为配置
      draggable: true,
      resizable: true,
      active: false,
      preventDeactivation: false,
      disableUserSelect: true,
      enableNativeDrag: false,
      lockAspectRatio: false,
      
      // 位置和尺寸
      x: 0,
      y: 0,
      w: 200,
      h: 200,
      minWidth: 0,
      minHeight: 0,
      maxWidth: null,
      maxHeight: null,
      
      // 限制和对齐
      axis: 'both', // 'x', 'y', 'both'
      grid: [1, 1],
      parent: false,
      scale: 1,
      
      // 拖拽句柄
      handles: ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'],
      dragHandle: null,
      dragCancel: null,
      
      // 事件回调
      onDragStart: () => true,
      onDrag: () => true,
      onDragStop: () => {},
      onResizeStart: () => true,
      onResize: () => true,
      onResizeStop: () => {},
      onActivated: () => {},
      onDeactivated: () => {}
    };

    // 合并配置
    this.options = { ...this.defaultOptions, ...options };

    // 内部状态
    this.state = {
      left: this.options.x,
      top: this.options.y,
      width: this.options.w,
      height: this.options.h,
      right: null,
      bottom: null,
      
      enabled: this.options.active,
      dragging: false,
      resizing: false,
      dragEnable: false,
      resizeEnable: false,
      
      handle: null,
      aspectFactor: null,
      parentWidth: null,
      parentHeight: null,
      widthTouched: false,
      heightTouched: false,
      
      mouseClickPosition: { mouseX: 0, mouseY: 0, left: 0, top: 0, right: 0, bottom: 0 },
      bounds: {
        minLeft: null, maxLeft: null,
        minRight: null, maxRight: null,
        minTop: null, maxTop: null,
        minBottom: null, maxBottom: null
      }
    };

    // 事件相关
    this.events = {
      mouse: { start: 'mousedown', move: 'mousemove', stop: 'mouseup' },
      touch: { start: 'touchstart', move: 'touchmove', stop: 'touchend' }
    };
    this.eventsFor = this.events.mouse;

    // 样式常量
    this.userSelectNone = {
      userSelect: 'none',
      MozUserSelect: 'none',
      WebkitUserSelect: 'none',
      MsUserSelect: 'none'
    };

    this.userSelectAuto = {
      userSelect: 'auto',
      MozUserSelect: 'auto',
      WebkitUserSelect: 'auto',
      MsUserSelect: 'auto'
    };

    // 绑定方法上下文
    this.bindMethods();
    
    // 初始化
    this.init();
  }

  bindMethods() {
    // 绑定事件处理方法的this上下文
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleUp = this.handleUp.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.deselect = this.deselect.bind(this);
    this.checkParentSize = this.checkParentSize.bind(this);
  }

  init() {
    this.setupElement();
    this.setupHandles();
    this.calculateInitialState();
    this.addEventListeners();
    
    if (this.state.enabled) {
      this.activate();
    }
  }

  setupElement() {
    // 设置元素基础样式和类名
    this.element.style.position = 'absolute';
    this.addClass(this.element, this.options.className);
    
    if (this.options.draggable) {
      this.addClass(this.element, this.options.classNameDraggable);
    }
    
    if (this.options.resizable) {
      this.addClass(this.element, this.options.classNameResizable);
    }
    
    if (!this.options.enableNativeDrag) {
      this.element.ondragstart = () => false;
    }
    
    this.updateElementStyle();
  }

  setupHandles() {
    if (!this.options.resizable) return;
    
    // 创建调整大小句柄
    this.handles = {};
    this.options.handles.forEach(handle => {
      const handleElement = document.createElement('div');
      handleElement.className = `${this.options.classNameHandle} ${this.options.classNameHandle}-${handle}`;
      handleElement.style.display = this.state.enabled ? 'block' : 'none';
      
      // 添加事件监听
      handleElement.addEventListener('mousedown', (e) => this.handleDown(handle, e));
      handleElement.addEventListener('touchstart', (e) => this.handleTouchDown(handle, e));
      
      this.element.appendChild(handleElement);
      this.handles[handle] = handleElement;
    });
  }

  calculateInitialState() {
    // 计算父容器尺寸
    if (this.options.parent) {
      const [parentWidth, parentHeight] = this.getParentSize();
      this.state.parentWidth = parentWidth;
      this.state.parentHeight = parentHeight;
    }

    // 计算元素尺寸
    const computedSize = this.getComputedSize(this.element);
    
    this.state.width = this.options.w === 'auto' ? computedSize[0] : this.options.w;
    this.state.height = this.options.h === 'auto' ? computedSize[1] : this.options.h;
    
    // 计算宽高比
    this.state.aspectFactor = this.state.width / this.state.height;
    
    // 计算边距
    if (this.options.parent) {
      this.state.right = this.state.parentWidth - this.state.width - this.state.left;
      this.state.bottom = this.state.parentHeight - this.state.height - this.state.top;
    }
  }

  addEventListeners() {
    // 添加全局事件监听
    this.element.addEventListener('mousedown', this.handleMouseDown);
    this.element.addEventListener('touchstart', this.handleTouchStart);
    
    document.addEventListener('mousedown', this.deselect);
    document.addEventListener('touchend', this.deselect);
    document.addEventListener('touchcancel', this.deselect);
    
    if (this.options.parent) {
      window.addEventListener('resize', this.checkParentSize);
    }
  }

  removeEventListeners() {
    // 移除事件监听
    this.element.removeEventListener('mousedown', this.handleMouseDown);
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    
    document.removeEventListener('mousedown', this.deselect);
    document.removeEventListener('touchend', this.deselect);
    document.removeEventListener('touchcancel', this.deselect);
    document.removeEventListener('mousemove', this.handleMove);
    document.removeEventListener('touchmove', this.handleMove);
    document.removeEventListener('mouseup', this.handleUp);
    
    if (this.options.parent) {
      window.removeEventListener('resize', this.checkParentSize);
    }
  }

  // 事件处理方法
  handleMouseDown(e) {
    this.eventsFor = this.events.mouse;
    this.elementDown(e);
  }

  handleTouchStart(e) {
    this.eventsFor = this.events.touch;
    this.elementDown(e);
  }

  elementDown(e) {
    if (e instanceof MouseEvent && e.button !== 0) return;

    const target = e.target || e.srcElement;
    
    if (!this.element.contains(target)) return;
    
    // 如果点击的是句柄，不处理拖拽
    if (target.classList.contains(this.options.classNameHandle)) {
      return;
    }
    
    if (this.options.onDragStart(e) === false) return;

    // 检查拖拽句柄和取消区域
    if (this.options.dragHandle && !this.matchesSelectorToParentElements(target, this.options.dragHandle, this.element)) {
      this.state.dragging = false;
      return;
    }
    
    if (this.options.dragCancel && this.matchesSelectorToParentElements(target, this.options.dragCancel, this.element)) {
      this.state.dragging = false;
      return;
    }

    // 阻止默认行为
    e.preventDefault();
    e.stopPropagation();

    // 激活元素
    if (!this.state.enabled) {
      this.activate();
    }

    if (this.options.draggable) {
      this.state.dragEnable = true;
    }

    // 记录鼠标点击位置
    this.state.mouseClickPosition = {
      mouseX: e.touches ? e.touches[0].pageX : e.pageX,
      mouseY: e.touches ? e.touches[0].pageY : e.pageY,
      left: this.state.left,
      top: this.state.top,
      right: this.state.right,
      bottom: this.state.bottom,
      width: this.state.width,
      height: this.state.height
    };

    if (this.options.parent) {
      this.state.bounds = this.calcDragLimits();
    }

    document.addEventListener(this.eventsFor.move, this.handleMove, { passive: false });
    document.addEventListener(this.eventsFor.stop, this.handleUp);
  }

  handleDown(handle, e) {
    if (e instanceof MouseEvent && e.which !== 1) return;
    
    if (this.options.onResizeStart(handle, e) === false) return;

    e.stopPropagation();
    e.preventDefault();

    // 处理锁定宽高比的角落句柄
    if (this.options.lockAspectRatio && !handle.includes('m')) {
      this.state.handle = 'm' + handle.substring(1);
    } else {
      this.state.handle = handle;
    }

    this.state.resizeEnable = true;

    this.state.mouseClickPosition = {
      mouseX: e.touches ? e.touches[0].pageX : e.pageX,
      mouseY: e.touches ? e.touches[0].pageY : e.pageY,
      left: this.state.left,
      top: this.state.top,
      right: this.state.right,
      bottom: this.state.bottom,
      width: this.state.width,
      height: this.state.height
    };

    this.state.bounds = this.calcResizeLimits();

    document.addEventListener(this.eventsFor.move, this.handleMove, { passive: false });
    document.addEventListener(this.eventsFor.stop, this.handleUp);
  }

  handleTouchDown(handle, e) {
    this.eventsFor = this.events.touch;
    this.handleDown(handle, e);
  }

  handleMove(e) {
    e.preventDefault();
    
    if (this.state.resizeEnable) {
      this.handleResize(e);
    } else if (this.state.dragEnable) {
      this.handleDrag(e);
    }
  }

  handleDrag(e) {
    const axis = this.options.axis;
    const grid = this.options.grid;
    const bounds = this.state.bounds;
    const mouseClickPosition = this.state.mouseClickPosition;

    const tmpDeltaX = axis !== 'y' ? mouseClickPosition.mouseX - (e.touches ? e.touches[0].pageX : e.pageX) : 0;
    const tmpDeltaY = axis !== 'x' ? mouseClickPosition.mouseY - (e.touches ? e.touches[0].pageY : e.pageY) : 0;

    const [deltaX, deltaY] = this.snapToGrid(grid, tmpDeltaX, tmpDeltaY, this.options.scale);

    let left = mouseClickPosition.left - deltaX;
    let top = mouseClickPosition.top - deltaY;

    // 应用边界限制
    if (this.options.parent && bounds) {
      left = this.restrictToBounds(left, bounds.minLeft, bounds.maxLeft);
      top = this.restrictToBounds(top, bounds.minTop, bounds.maxTop);
    }

    if (this.options.onDrag(left, top) === false) return;

    this.state.left = left;
    this.state.top = top;

    if (this.options.parent) {
      this.state.right = this.state.parentWidth - this.state.width - this.state.left;
      this.state.bottom = this.state.parentHeight - this.state.height - this.state.top;
    }

    this.updateElementStyle();
    
    if (!this.state.dragging) {
      this.state.dragging = true;
      this.updateClasses();
    }
  }

  handleResize(e) {
    const mouseClickPosition = this.state.mouseClickPosition;
    const aspectFactor = this.state.aspectFactor;

    const currentX = e.touches ? e.touches[0].pageX : e.pageX;
    const currentY = e.touches ? e.touches[0].pageY : e.pageY;
    
    const tmpDeltaX = currentX - mouseClickPosition.mouseX;
    const tmpDeltaY = currentY - mouseClickPosition.mouseY;

    if (!this.state.widthTouched && tmpDeltaX) {
      this.state.widthTouched = true;
    }

    if (!this.state.heightTouched && tmpDeltaY) {
      this.state.heightTouched = true;
    }

    const [deltaX, deltaY] = this.snapToGrid(this.options.grid, tmpDeltaX, tmpDeltaY, this.options.scale);
    
    let newLeft = this.state.left;
    let newTop = this.state.top;
    let newWidth = this.state.width;
    let newHeight = this.state.height;

    // 处理不同方向的调整大小
    if (this.state.handle.includes('r')) {
      newWidth = Math.max(this.options.minWidth || 0, mouseClickPosition.width + deltaX);
      if (this.options.maxWidth) {
        newWidth = Math.min(this.options.maxWidth, newWidth);
      }
    }
    
    if (this.state.handle.includes('l')) {
      const proposedWidth = mouseClickPosition.width - deltaX;
      newWidth = Math.max(this.options.minWidth || 0, proposedWidth);
      if (this.options.maxWidth) {
        newWidth = Math.min(this.options.maxWidth, newWidth);
      }
      newLeft = mouseClickPosition.left + (mouseClickPosition.width - newWidth);
    }
    
    if (this.state.handle.includes('b')) {
      newHeight = Math.max(this.options.minHeight || 0, mouseClickPosition.height + deltaY);
      if (this.options.maxHeight) {
        newHeight = Math.min(this.options.maxHeight, newHeight);
      }
    }
    
    if (this.state.handle.includes('t')) {
      const proposedHeight = mouseClickPosition.height - deltaY;
      newHeight = Math.max(this.options.minHeight || 0, proposedHeight);
      if (this.options.maxHeight) {
        newHeight = Math.min(this.options.maxHeight, newHeight);
      }
      newTop = mouseClickPosition.top + (mouseClickPosition.height - newHeight);
    }

    // 处理宽高比锁定
    if (this.options.lockAspectRatio && aspectFactor) {
      if (this.resizingOnX()) {
        newHeight = newWidth / aspectFactor;
        if (this.state.handle.includes('t')) {
          newTop = mouseClickPosition.top + (mouseClickPosition.height - newHeight);
        }
      } else if (this.resizingOnY()) {
        newWidth = newHeight * aspectFactor;
        if (this.state.handle.includes('l')) {
          newLeft = mouseClickPosition.left + (mouseClickPosition.width - newWidth);
        }
      }
    }

    // 应用父容器限制
    if (this.options.parent && this.state.parentWidth && this.state.parentHeight) {
      if (newLeft < 0) {
        newWidth += newLeft;
        newLeft = 0;
      }
      if (newTop < 0) {
        newHeight += newTop;
        newTop = 0;
      }
      if (newLeft + newWidth > this.state.parentWidth) {
        newWidth = this.state.parentWidth - newLeft;
      }
      if (newTop + newHeight > this.state.parentHeight) {
        newHeight = this.state.parentHeight - newTop;
      }
    }

    if (this.options.onResize(this.state.handle, newLeft, newTop, newWidth, newHeight) === false) return;

    this.state.left = newLeft;
    this.state.top = newTop;
    this.state.width = newWidth;
    this.state.height = newHeight;
    
    if (this.options.parent) {
      this.state.right = this.state.parentWidth - this.state.width - this.state.left;
      this.state.bottom = this.state.parentHeight - this.state.height - this.state.top;
    }

    this.updateElementStyle();
    
    if (!this.state.resizing) {
      this.state.resizing = true;
      this.updateClasses();
    }
  }

  handleUp(e) {
    this.state.handle = null;
    this.resetBoundsAndMouseState();

    this.state.dragEnable = false;
    this.state.resizeEnable = false;

    if (this.state.resizing) {
      this.state.resizing = false;
      this.options.onResizeStop(this.state.left, this.state.top, this.state.width, this.state.height);
    }

    if (this.state.dragging) {
      this.state.dragging = false;
      this.options.onDragStop(this.state.left, this.state.top);
    }

    this.updateClasses();

    document.removeEventListener(this.eventsFor.move, this.handleMove);
    document.removeEventListener(this.eventsFor.stop, this.handleUp);
  }

  deselect(e) {
    const target = e.target || e.srcElement;
    const regex = new RegExp(this.options.className + '-([trmbl]{2})', '');

    if (!this.element.contains(target) && !regex.test(target.className)) {
      if (this.state.enabled && !this.options.preventDeactivation) {
        this.deactivate();
      }
    }

    this.resetBoundsAndMouseState();
  }

  checkParentSize() {
    if (this.options.parent) {
      const [newParentWidth, newParentHeight] = this.getParentSize();
      this.state.parentWidth = newParentWidth;
      this.state.parentHeight = newParentHeight;
      this.state.right = this.state.parentWidth - this.state.width - this.state.left;
      this.state.bottom = this.state.parentHeight - this.state.height - this.state.top;
    }
  }

  // 公共API方法
  activate() {
    this.state.enabled = true;
    this.updateClasses();
    this.updateHandlesVisibility();
    this.options.onActivated();
  }

  deactivate() {
    this.state.enabled = false;
    this.updateClasses();
    this.updateHandlesVisibility();
    this.options.onDeactivated();
  }

  setPosition(x, y) {
    this.state.left = x;
    this.state.top = y;
    if (this.options.parent && this.state.parentWidth && this.state.parentHeight) {
      this.state.right = this.state.parentWidth - this.state.width - this.state.left;
      this.state.bottom = this.state.parentHeight - this.state.height - this.state.top;
    }
    this.updateElementStyle();
  }

  setSize(width, height) {
    this.state.width = width;
    this.state.height = height;
    if (this.options.parent && this.state.parentWidth && this.state.parentHeight) {
      this.state.right = this.state.parentWidth - this.state.width - this.state.left;
      this.state.bottom = this.state.parentHeight - this.state.height - this.state.top;
    }
    this.updateElementStyle();
  }

  getPosition() {
    return { x: this.state.left, y: this.state.top };
  }

  getSize() {
    return { width: this.state.width, height: this.state.height };
  }

  destroy() {
    // 移除句柄
    Object.values(this.handles || {}).forEach(handle => {
      if (handle.parentNode) {
        handle.parentNode.removeChild(handle);
      }
    });

    // 移除事件监听
    this.removeEventListeners();

    // 清理样式和类名
    this.element.className = this.element.className
      .split(' ')
      .filter(cls => !cls.startsWith(this.options.className))
      .join(' ');

    // 重置样式
    this.element.style.transform = '';
    this.element.style.width = '';
    this.element.style.height = '';
    this.element.style.position = '';
  }

  // 工具方法
  updateElementStyle() {
    const computedWidth = this.options.w === 'auto' && !this.state.widthTouched ? 'auto' : this.state.width + 'px';
    const computedHeight = this.options.h === 'auto' && !this.state.heightTouched ? 'auto' : this.state.height + 'px';
    
    this.element.style.transform = `translate(${this.state.left}px, ${this.state.top}px)`;
    this.element.style.width = computedWidth;
    this.element.style.height = computedHeight;
    
    if (this.state.dragging && this.options.disableUserSelect) {
      Object.assign(this.element.style, this.userSelectNone);
    } else {
      Object.assign(this.element.style, this.userSelectAuto);
    }
  }

  updateClasses() {
    this.toggleClass(this.element, this.options.classNameActive, this.state.enabled);
    this.toggleClass(this.element, this.options.classNameDragging, this.state.dragging);
    this.toggleClass(this.element, this.options.classNameResizing, this.state.resizing);
  }

  updateHandlesVisibility() {
    if (!this.handles) return;
    
    Object.values(this.handles).forEach(handle => {
      handle.style.display = this.state.enabled ? 'block' : 'none';
    });
  }

  addClass(element, className) {
    if (!element.classList.contains(className)) {
      element.classList.add(className);
    }
  }

  removeClass(element, className) {
    element.classList.remove(className);
  }

  toggleClass(element, className, condition) {
    if (condition) {
      this.addClass(element, className);
    } else {
      this.removeClass(element, className);
    }
  }

  // 从utils/fns.js移植的工具函数
  snapToGrid(grid, pendingX, pendingY, scale = 1) {
    const [scaleX, scaleY] = typeof scale === 'number' ? [scale, scale] : scale;
    const x = Math.round((pendingX / scaleX) / grid[0]) * grid[0];
    const y = Math.round((pendingY / scaleY) / grid[1]) * grid[1];
    return [x, y];
  }

  restrictToBounds(value, min, max) {
    if (min !== null && value < min) return min;
    if (max !== null && max < value) return max;
    return value;
  }

  computeWidth(parentWidth, left, right) {
    if (parentWidth) {
      return parentWidth - left - right;
    }
    return this.state.width;
  }

  computeHeight(parentHeight, top, bottom) {
    if (parentHeight) {
      return parentHeight - top - bottom;
    }
    return this.state.height;
  }

  // 从utils/dom.js移植的工具函数
  getComputedSize(el) {
    const style = window.getComputedStyle(el);
    return [
      parseFloat(style.getPropertyValue('width'), 10) || 0,
      parseFloat(style.getPropertyValue('height'), 10) || 0
    ];
  }

  matchesSelectorToParentElements(el, selector, baseNode) {
    let node = el;
    const matchesSelectorFunc = [
      'matches',
      'webkitMatchesSelector',
      'mozMatchesSelector',
      'msMatchesSelector',
      'oMatchesSelector'
    ].find(func => typeof node[func] === 'function');

    if (typeof node[matchesSelectorFunc] !== 'function') return false;

    do {
      if (node[matchesSelectorFunc](selector)) return true;
      if (node === baseNode) return false;
      node = node.parentNode;
    } while (node);

    return false;
  }

  getParentSize() {
    if (this.options.parent && this.element.parentNode) {
      const style = window.getComputedStyle(this.element.parentNode, null);
      return [
        parseInt(style.getPropertyValue('width'), 10) || 0,
        parseInt(style.getPropertyValue('height'), 10) || 0
      ];
    }
    return [null, null];
  }

  resetBoundsAndMouseState() {
    this.state.mouseClickPosition = { mouseX: 0, mouseY: 0, x: 0, y: 0, w: 0, h: 0 };
    this.state.bounds = {
      minLeft: null, maxLeft: null,
      minRight: null, maxRight: null,
      minTop: null, maxTop: null,
      minBottom: null, maxBottom: null
    };
  }

  calcDragLimits() {
    if (!this.options.parent || !this.state.parentWidth || !this.state.parentHeight) {
      return {
        minLeft: null, maxLeft: null,
        minRight: null, maxRight: null,
        minTop: null, maxTop: null,
        minBottom: null, maxBottom: null
      };
    }

    return {
      minLeft: 0,
      maxLeft: this.state.parentWidth - this.state.width,
      minRight: 0,
      maxRight: this.state.parentWidth - this.state.width,
      minTop: 0,
      maxTop: this.state.parentHeight - this.state.height,
      minBottom: 0,
      maxBottom: this.state.parentHeight - this.state.height
    };
  }

  calcResizeLimits() {
    let minW = this.options.minWidth || 0;
    let minH = this.options.minHeight || 0;
    let maxW = this.options.maxWidth;
    let maxH = this.options.maxHeight;

    const aspectFactor = this.state.aspectFactor;
    const [gridX, gridY] = this.options.grid;
    const width = this.state.width;
    const height = this.state.height;
    const left = this.state.left;
    const top = this.state.top;
    const right = this.state.right || 0;
    const bottom = this.state.bottom || 0;

    if (this.options.lockAspectRatio) {
      if (minW / minH > aspectFactor) {
        minH = minW / aspectFactor;
      } else {
        minW = aspectFactor * minH;
      }

      if (maxW && maxH) {
        maxW = Math.min(maxW, aspectFactor * maxH);
        maxH = Math.min(maxH, maxW / aspectFactor);
      } else if (maxW) {
        maxH = maxW / aspectFactor;
      } else if (maxH) {
        maxW = aspectFactor * maxH;
      }
    }

    if (maxW) maxW = maxW - (maxW % gridX);
    if (maxH) maxH = maxH - (maxH % gridY);

    const limits = {
      minLeft: null, maxLeft: null,
      minTop: null, maxTop: null,
      minRight: null, maxRight: null,
      minBottom: null, maxBottom: null
    };

    if (this.options.parent && this.state.parentWidth && this.state.parentHeight) {
      limits.minLeft = 0;
      limits.maxLeft = left + Math.floor((width - minW) / gridX) * gridX;
      limits.minTop = 0;
      limits.maxTop = top + Math.floor((height - minH) / gridY) * gridY;
      limits.minRight = 0;
      limits.maxRight = right + Math.floor((width - minW) / gridX) * gridX;
      limits.minBottom = 0;
      limits.maxBottom = bottom + Math.floor((height - minH) / gridY) * gridY;

      if (maxW) {
        limits.minLeft = Math.max(limits.minLeft, this.state.parentWidth - right - maxW);
        limits.minRight = Math.max(limits.minRight, this.state.parentWidth - left - maxW);
      }

      if (maxH) {
        limits.minTop = Math.max(limits.minTop, this.state.parentHeight - bottom - maxH);
        limits.minBottom = Math.max(limits.minBottom, this.state.parentHeight - top - maxH);
      }
    } else {
      limits.minLeft = null;
      limits.maxLeft = left + Math.floor((width - minW) / gridX) * gridX;
      limits.minTop = null;
      limits.maxTop = top + Math.floor((height - minH) / gridY) * gridY;
      limits.minRight = null;
      limits.maxRight = right + Math.floor((width - minW) / gridX) * gridX;
      limits.minBottom = null;
      limits.maxBottom = bottom + Math.floor((height - minH) / gridY) * gridY;

      if (maxW) {
        limits.minLeft = -(right + maxW);
        limits.minRight = -(left + maxW);
      }

      if (maxH) {
        limits.minTop = -(bottom + maxH);
        limits.minBottom = -(top + maxH);
      }
    }

    return limits;
  }

  resizingOnX() {
    return Boolean(this.state.handle) && (this.state.handle.includes('l') || this.state.handle.includes('r'));
  }

  resizingOnY() {
    return Boolean(this.state.handle) && (this.state.handle.includes('t') || this.state.handle.includes('b'));
  }

  isCornerHandle() {
    return Boolean(this.state.handle) && ['tl', 'tr', 'br', 'bl'].includes(this.state.handle);
  }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DraggableResizable;
} else if (typeof window !== 'undefined') {
  window.DraggableResizable = DraggableResizable;
}