# DraggableResizable - 纯JavaScript拖拽调整大小库

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES5+-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![No Dependencies](https://img.shields.io/badge/Dependencies-None-green.svg)](https://github.com/)

**语言:** [English](README.md) | [中文](README-zh.md)

一个**完全独立**的纯JavaScript库，用于实现DOM元素的拖拽和调整大小功能。**不依赖任何第三方库**，包括Vue、React、jQuery等框架。

Thanks to @mauricius for his work on [vue-draggable-resizable](https://github.com/mauricius/vue-draggable-resizable) component.

## 🎯 特性

### ✅ 完全独立
- **零依赖** - 不需要Vue、React、jQuery或任何其他库
- **纯JavaScript** - 使用原生ES5+语法，兼容性强
- **轻量级** - 单文件实现，压缩后约20KB
- **即插即用** - 引入即可使用，无需构建工具

### 🚀 核心功能
- ✅ **拖拽移动** - 支持元素自由拖拽
- ✅ **调整大小** - 8个方向的大小调整句柄
- ✅ **边界限制** - 可限制在父容器内
- ✅ **网格对齐** - 支持网格对齐功能
- ✅ **宽高比锁定** - 保持固定宽高比
- ✅ **最小/最大尺寸** - 设置尺寸约束
- ✅ **多轴限制** - 限制拖拽方向(x/y/both)
- ✅ **触摸支持** - 完美支持移动设备
- ✅ **事件系统** - 丰富的事件回调
- ✅ **批量操作** - 支持多选和批量拖拽

### 🎨 高度可定制
- ✅ **CSS样式** - 完全可定制的外观
- ✅ **主题支持** - 内置多套主题
- ✅ **响应式** - 支持移动端和桌面端
- ✅ **无障碍** - 支持键盘操作和屏幕阅读器

## 📦 快速开始

### 1. 引入文件

```html
<!DOCTYPE html>
<html>
<head>
    <!-- 引入CSS样式 -->
    <link rel="stylesheet" href="draggable-resizable.css">
</head>
<body>
    <div id="myElement">我是可拖拽的元素</div>
    
    <!-- 引入JavaScript库 -->
    <script src="draggable-resizable.js"></script>
</body>
</html>
```

### 2. 基础使用

```javascript
// 获取DOM元素
const element = document.getElementById('myElement');

// 创建实例
const draggable = new DraggableResizable(element, {
    x: 100,           // 初始X坐标
    y: 100,           // 初始Y坐标  
    w: 200,           // 初始宽度
    h: 150,           // 初始高度
    active: true      // 是否激活
});
```

### 3. 高级配置

```javascript
const draggable = new DraggableResizable(element, {
    // 位置和尺寸
    x: 100,
    y: 100,
    w: 200,
    h: 150,
    
    // 约束设置
    minWidth: 50,
    minHeight: 50,
    maxWidth: 500,
    maxHeight: 400,
    
    // 功能开关
    draggable: true,              // 是否可拖拽
    resizable: true,              // 是否可调整大小
    lockAspectRatio: false,       // 是否锁定宽高比
    parent: true,                 // 是否限制在父容器内
    
    // 对齐和限制
    grid: [10, 10],              // 网格对齐
    axis: 'both',                // 拖拽轴向: 'x', 'y', 'both'
    
    // 事件回调
    onDragStart: (e) => {
        console.log('开始拖拽');
        return true; // 返回false可取消拖拽
    },
    onDrag: (x, y) => {
        console.log(`拖拽到: ${x}, ${y}`);
    },
    onDragStop: (x, y) => {
        console.log(`拖拽结束: ${x}, ${y}`);
    },
    onResize: (handle, x, y, width, height) => {
        console.log(`调整大小: ${width}×${height}`);
    }
});
```

## 📚 完整API文档

### 构造函数

```javascript
new DraggableResizable(element, options)
```

#### 参数
- `element` {Element|String} - DOM元素或CSS选择器
- `options` {Object} - 配置选项

### 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `x` | Number | 0 | 初始X坐标 |
| `y` | Number | 0 | 初始Y坐标 |
| `w` | Number\|String | 200 | 初始宽度，支持'auto' |
| `h` | Number\|String | 200 | 初始高度，支持'auto' |
| `minWidth` | Number | 0 | 最小宽度 |
| `minHeight` | Number | 0 | 最小高度 |
| `maxWidth` | Number | null | 最大宽度 |
| `maxHeight` | Number | null | 最大高度 |
| `draggable` | Boolean | true | 是否可拖拽 |
| `resizable` | Boolean | true | 是否可调整大小 |
| `active` | Boolean | false | 是否默认激活 |
| `lockAspectRatio` | Boolean | false | 是否锁定宽高比 |
| `parent` | Boolean | false | 是否限制在父容器内 |
| `grid` | Array | [1, 1] | 网格对齐 [x, y] |
| `axis` | String | 'both' | 拖拽轴向: 'x', 'y', 'both' |
| `handles` | Array | ['tl','tm','tr','mr','br','bm','bl','ml'] | 调整大小句柄 |
| `dragHandle` | String | null | 拖拽句柄CSS选择器 |
| `dragCancel` | String | null | 取消拖拽区域CSS选择器 |
| `scale` | Number\|Array | 1 | 缩放比例 |

### 事件回调

| 事件 | 参数 | 描述 |
|------|------|------|
| `onDragStart` | (event) | 开始拖拽，返回false可取消 |
| `onDrag` | (x, y) | 拖拽过程中 |
| `onDragStop` | (x, y) | 拖拽结束 |
| `onResizeStart` | (handle, event) | 开始调整大小，返回false可取消 |
| `onResize` | (handle, x, y, width, height) | 调整大小过程中 |
| `onResizeStop` | (x, y, width, height) | 调整大小结束 |
| `onActivated` | () | 元素激活时 |
| `onDeactivated` | () | 元素取消激活时 |

### 公共方法

#### `activate()`
激活元素，显示调整大小句柄

```javascript
draggable.activate();
```

#### `deactivate()`
取消激活元素

```javascript
draggable.deactivate();
```

#### `setPosition(x, y)`
设置元素位置

```javascript
draggable.setPosition(150, 200);
```

#### `setSize(width, height)`
设置元素尺寸

```javascript
draggable.setSize(300, 250);
```

#### `getPosition()`
获取当前位置

```javascript
const pos = draggable.getPosition();
console.log(pos.x, pos.y); // 输出: 150 200
```

#### `getSize()`
获取当前尺寸

```javascript
const size = draggable.getSize();
console.log(size.width, size.height); // 输出: 300 250
```

#### `destroy()`
销毁实例，清理所有事件和DOM

```javascript
draggable.destroy();
```

## 🎨 样式定制

### 基础样式类

```css
.vdr               /* 基础容器 */
.vdr.active        /* 激活状态 */
.vdr.dragging      /* 拖拽状态 */
.vdr.resizing      /* 调整大小状态 */
.handle            /* 调整大小句柄 */
.handle-tl         /* 左上角句柄 */
.handle-tr         /* 右上角句柄 */
/* ... 其他方向句柄 */
```

### 自定义主题

```css
/* 深色主题 */
.vdr.dark-theme {
  --vdr-border-color: #4b5563;
  --vdr-border-color-active: #60a5fa;
  --vdr-handle-color: #60a5fa;
  --vdr-background-color: #1f2937;
}

/* 最小化主题 */
.vdr.minimal-theme {
  border: 1px dashed #9ca3af;
  background: transparent;
}
```

## 📖 使用示例

### 基础拖拽

```html
<div id="basic-element">基础拖拽</div>

<script>
const element = document.getElementById('basic-element');
const draggable = new DraggableResizable(element, {
    x: 50,
    y: 50,
    w: 150,
    h: 100,
    active: true
});
</script>
```

### 约束拖拽

```javascript
const constrainedDraggable = new DraggableResizable(element, {
    minWidth: 100,
    minHeight: 80,
    maxWidth: 400,
    maxHeight: 300,
    parent: true,              // 限制在父容器内
    lockAspectRatio: true      // 锁定宽高比
});
```

### 网格对齐

```javascript
const gridDraggable = new DraggableResizable(element, {
    grid: [20, 20],           // 20px网格
    parent: true
});
```

### 仅拖拽（禁用调整大小）

```javascript
const dragOnly = new DraggableResizable(element, {
    resizable: false,
    draggable: true
});
```

### 仅调整大小（禁用拖拽）

```javascript
const resizeOnly = new DraggableResizable(element, {
    draggable: false,
    resizable: true
});
```

### 限制拖拽方向

```javascript
// 仅水平拖拽
const horizontalDrag = new DraggableResizable(element, {
    axis: 'x'
});

// 仅垂直拖拽  
const verticalDrag = new DraggableResizable(element, {
    axis: 'y'
});
```

### 批量拖拽

```javascript
// 创建多个可拖拽元素
const elements = document.querySelectorAll('.draggable-item');
const instances = [];

elements.forEach(element => {
    const instance = new DraggableResizable(element, {
        parent: true,
        onDragStart: (e) => {
            // 实现多选逻辑
            if (e.ctrlKey) {
                selectMultiple(element);
            }
            return true;
        },
        onDrag: (x, y) => {
            // 批量移动其他选中的元素
            moveSelectedElements(x, y);
        }
    });
    instances.push(instance);
});
```

### 事件处理

```javascript
const eventDraggable = new DraggableResizable(element, {
    onDragStart: (e) => {
        console.log('开始拖拽');
        element.style.opacity = '0.8';
        return true; // 返回false可以取消拖拽
    },
    onDrag: (x, y) => {
        document.title = `位置: ${x}, ${y}`;
    },
    onDragStop: (x, y) => {
        console.log('拖拽结束');
        element.style.opacity = '1';
    },
    onResize: (handle, x, y, width, height) => {
        console.log(`调整大小: ${width}×${height}`);
    },
    onActivated: () => {
        element.style.boxShadow = '0 0 10px rgba(0,0,255,0.5)';
    },
    onDeactivated: () => {
        element.style.boxShadow = 'none';
    }
});
```

## 🌐 浏览器支持

- ✅ Chrome 60+
- ✅ Firefox 55+  
- ✅ Safari 10+
- ✅ Edge 79+
- ✅ IE 11+ (需要polyfill)
- ✅ 移动浏览器 (支持触摸)

### IE兼容性

对于IE11，需要添加以下polyfill：

```html
<!-- IE11 Polyfills -->
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
```

## ⚡ 性能优化

### 大量元素优化

```javascript
// 对于大量元素，建议延迟初始化
function createDraggables(elements) {
    const instances = [];
    
    elements.forEach((element, index) => {
        // 延迟初始化以避免阻塞UI
        setTimeout(() => {
            const instance = new DraggableResizable(element, {
                // 配置选项
            });
            instances.push(instance);
        }, index * 10);
    });
    
    return instances;
}
```

### 内存管理

```javascript
// 组件销毁时清理实例
function cleanup() {
    instances.forEach(instance => {
        instance.destroy();
    });
    instances.length = 0;
}

// 页面卸载时清理
window.addEventListener('beforeunload', cleanup);
```

## 🔄 从Vue组件迁移

如果你之前使用的是vue-draggable-resizable Vue组件，迁移到这个纯JavaScript版本非常简单：

### Vue组件写法：
```vue
<vue-draggable-resizable
  :x="100"
  :y="100" 
  :w="200"
  :h="150"
  :min-width="50"
  :min-height="50"
  :parent="true"
  @dragging="onDrag"
  @resizing="onResize"
>
  内容
</vue-draggable-resizable>
```

### 纯JavaScript写法：
```javascript
const element = document.createElement('div');
element.textContent = '内容';
document.body.appendChild(element);

const draggable = new DraggableResizable(element, {
  x: 100,
  y: 100,
  w: 200,
  h: 150,
  minWidth: 50,
  minHeight: 50,
  parent: true,
  onDrag: onDrag,
  onResize: onResize
});
```

## 🛠️ 开发和构建

### 项目结构

```
draggable-resizable/
├── draggable-resizable.js    # 核心库文件
├── draggable-resizable.css   # 默认样式
├── demo.html                 # 演示页面
├── multi-drag-test.html      # 批量拖拽演示
├── resize-test.html          # 调整大小测试
└── README-VANILLA.md         # 文档
```

### 本地开发

```bash
# 启动本地服务器
python -m http.server 8000
# 或者
npx serve .

# 访问演示页面
open http://localhost:8000/demo.html
```

## ❓ 常见问题

### Q: 为什么选择纯JavaScript而不是框架？
A: 这个库专门设计为框架无关，可以在任何环境中使用：原生HTML、Vue、React、Angular等，无需担心依赖冲突。

### Q: 如何处理大量元素的性能问题？
A: 建议使用延迟初始化、虚拟滚动，以及在不需要时调用`destroy()`方法清理实例。

### Q: 支持服务器端渲染(SSR)吗？
A: 这是一个纯客户端库，需要DOM环境。在SSR场景下，请确保在客户端渲染后再初始化。

### Q: 如何实现自定义拖拽句柄？
A: 使用`dragHandle`选项指定CSS选择器，只有匹配的元素才能触发拖拽。

```javascript
const draggable = new DraggableResizable(element, {
    dragHandle: '.drag-handle'  // 只有.drag-handle元素可以拖拽
});
```

### Q: 如何禁用某些调整大小句柄？
A: 使用`handles`选项自定义句柄列表：

```javascript
const draggable = new DraggableResizable(element, {
    handles: ['br', 'mr', 'bm']  // 只显示右下、右中、下中句柄
});
```

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交问题和功能请求！请遵循以下步骤：

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 🎉 致谢

感谢所有为这个项目做出贡献的开发者！

---

**DraggableResizable** - 让拖拽变得简单，无需框架束缚！ 🚀