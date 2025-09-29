# DraggableResizable - Pure JavaScript Drag & Resize Library

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES5+-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![No Dependencies](https://img.shields.io/badge/Dependencies-None-green.svg)](https://github.com/)

**Language:** [English](README.md) | [中文](README-zh.md)

A **completely independent** pure JavaScript library for implementing drag and resize functionality for DOM elements. **No dependencies** on any third-party libraries, including Vue, React, jQuery, or other frameworks.

Thanks to @mauricius for his work on [vue-draggable-resizable](https://github.com/mauricius/vue-draggable-resizable) component.

## 🎯 Features

### ✅ Completely Independent
- **Zero Dependencies** - No need for Vue, React, jQuery, or any other libraries
- **Pure JavaScript** - Uses native ES5+ syntax for excellent compatibility
- **Lightweight** - Single file implementation, ~20KB minified
- **Plug & Play** - Ready to use immediately, no build tools required

### 🚀 Core Functionality
- ✅ **Drag Movement** - Support for free element dragging
- ✅ **Resize** - 8-directional resize handles
- ✅ **Boundary Constraints** - Can be constrained within parent container
- ✅ **Grid Alignment** - Support for grid snapping
- ✅ **Aspect Ratio Lock** - Maintain fixed aspect ratios
- ✅ **Min/Max Size** - Set size constraints
- ✅ **Multi-axis Constraints** - Restrict drag directions (x/y/both)
- ✅ **Touch Support** - Perfect mobile device support
- ✅ **Event System** - Rich event callbacks
- ✅ **Batch Operations** - Support for multi-select and batch dragging

### 🎨 Highly Customizable
- ✅ **CSS Styling** - Fully customizable appearance
- ✅ **Theme Support** - Built-in multiple themes
- ✅ **Responsive** - Support for mobile and desktop
- ✅ **Accessibility** - Support for keyboard operation and screen readers

## 📦 Quick Start

### 1. Include Files

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Include CSS styles -->
    <link rel="stylesheet" href="draggable-resizable.css">
</head>
<body>
    <div id="myElement">I am a draggable element</div>
    
    <!-- Include JavaScript library -->
    <script src="draggable-resizable.js"></script>
</body>
</html>
```

### 2. Basic Usage

```javascript
// Get DOM element
const element = document.getElementById('myElement');

// Create instance
const draggable = new DraggableResizable(element, {
    x: 100,           // Initial X coordinate
    y: 100,           // Initial Y coordinate  
    w: 200,           // Initial width
    h: 150,           // Initial height
    active: true      // Whether to activate
});
```

### 3. Advanced Configuration

```javascript
const draggable = new DraggableResizable(element, {
    // Position and size
    x: 100,
    y: 100,
    w: 200,
    h: 150,
    
    // Constraint settings
    minWidth: 50,
    minHeight: 50,
    maxWidth: 500,
    maxHeight: 400,
    
    // Feature toggles
    draggable: true,              // Whether draggable
    resizable: true,              // Whether resizable
    lockAspectRatio: false,       // Whether to lock aspect ratio
    parent: true,                 // Whether to constrain within parent
    
    // Alignment and constraints
    grid: [10, 10],              // Grid alignment
    axis: 'both',                // Drag axis: 'x', 'y', 'both'
    
    // Event callbacks
    onDragStart: (e) => {
        console.log('Drag started');
        return true; // Return false to cancel drag
    },
    onDrag: (x, y) => {
        console.log(`Dragged to: ${x}, ${y}`);
    },
    onDragStop: (x, y) => {
        console.log(`Drag ended: ${x}, ${y}`);
    },
    onResize: (handle, x, y, width, height) => {
        console.log(`Resized: ${width}×${height}`);
    }
});
```

## 📚 Complete API Documentation

### Constructor

```javascript
new DraggableResizable(element, options)
```

#### Parameters
- `element` {Element|String} - DOM element or CSS selector
- `options` {Object} - Configuration options

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `x` | Number | 0 | Initial X coordinate |
| `y` | Number | 0 | Initial Y coordinate |
| `w` | Number\|String | 200 | Initial width, supports 'auto' |
| `h` | Number\|String | 200 | Initial height, supports 'auto' |
| `minWidth` | Number | 0 | Minimum width |
| `minHeight` | Number | 0 | Minimum height |
| `maxWidth` | Number | null | Maximum width |
| `maxHeight` | Number | null | Maximum height |
| `draggable` | Boolean | true | Whether draggable |
| `resizable` | Boolean | true | Whether resizable |
| `active` | Boolean | false | Whether activated by default |
| `lockAspectRatio` | Boolean | false | Whether to lock aspect ratio |
| `parent` | Boolean | false | Whether to constrain within parent |
| `grid` | Array | [1, 1] | Grid alignment [x, y] |
| `axis` | String | 'both' | Drag axis: 'x', 'y', 'both' |
| `handles` | Array | ['tl','tm','tr','mr','br','bm','bl','ml'] | Resize handles |
| `dragHandle` | String | null | Drag handle CSS selector |
| `dragCancel` | String | null | Cancel drag area CSS selector |
| `scale` | Number\|Array | 1 | Scale factor |

### Event Callbacks

| Event | Parameters | Description |
|-------|------------|-------------|
| `onDragStart` | (event) | Drag started, return false to cancel |
| `onDrag` | (x, y) | During drag |
| `onDragStop` | (x, y) | Drag ended |
| `onResizeStart` | (handle, event) | Resize started, return false to cancel |
| `onResize` | (handle, x, y, width, height) | During resize |
| `onResizeStop` | (x, y, width, height) | Resize ended |
| `onActivated` | () | When element is activated |
| `onDeactivated` | () | When element is deactivated |

### Public Methods

#### `activate()`
Activate element, show resize handles

```javascript
draggable.activate();
```

#### `deactivate()`
Deactivate element

```javascript
draggable.deactivate();
```

#### `setPosition(x, y)`
Set element position

```javascript
draggable.setPosition(150, 200);
```

#### `setSize(width, height)`
Set element size

```javascript
draggable.setSize(300, 250);
```

#### `getPosition()`
Get current position

```javascript
const pos = draggable.getPosition();
console.log(pos.x, pos.y); // Output: 150 200
```

#### `getSize()`
Get current size

```javascript
const size = draggable.getSize();
console.log(size.width, size.height); // Output: 300 250
```

#### `destroy()`
Destroy instance, clean up all events and DOM

```javascript
draggable.destroy();
```

## 🎨 Style Customization

### Basic Style Classes

```css
.vdr               /* Base container */
.vdr.active        /* Active state */
.vdr.dragging      /* Dragging state */
.vdr.resizing      /* Resizing state */
.handle            /* Resize handle */
.handle-tl         /* Top-left handle */
.handle-tr         /* Top-right handle */
/* ... other directional handles */
```

### Custom Themes

```css
/* Dark theme */
.vdr.dark-theme {
  --vdr-border-color: #4b5563;
  --vdr-border-color-active: #60a5fa;
  --vdr-handle-color: #60a5fa;
  --vdr-background-color: #1f2937;
}

/* Minimal theme */
.vdr.minimal-theme {
  border: 1px dashed #9ca3af;
  background: transparent;
}
```

## 📖 Usage Examples

### Basic Dragging

```html
<div id="basic-element">Basic Drag</div>

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

### Constrained Dragging

```javascript
const constrainedDraggable = new DraggableResizable(element, {
    minWidth: 100,
    minHeight: 80,
    maxWidth: 400,
    maxHeight: 300,
    parent: true,              // Constrain within parent
    lockAspectRatio: true      // Lock aspect ratio
});
```

### Grid Alignment

```javascript
const gridDraggable = new DraggableResizable(element, {
    grid: [20, 20],           // 20px grid
    parent: true
});
```

### Drag Only (Disable Resize)

```javascript
const dragOnly = new DraggableResizable(element, {
    resizable: false,
    draggable: true
});
```

### Resize Only (Disable Drag)

```javascript
const resizeOnly = new DraggableResizable(element, {
    draggable: false,
    resizable: true
});
```

### Restrict Drag Direction

```javascript
// Horizontal drag only
const horizontalDrag = new DraggableResizable(element, {
    axis: 'x'
});

// Vertical drag only  
const verticalDrag = new DraggableResizable(element, {
    axis: 'y'
});
```

### Batch Dragging

```javascript
// Create multiple draggable elements
const elements = document.querySelectorAll('.draggable-item');
const instances = [];

elements.forEach(element => {
    const instance = new DraggableResizable(element, {
        parent: true,
        onDragStart: (e) => {
            // Implement multi-select logic
            if (e.ctrlKey) {
                selectMultiple(element);
            }
            return true;
        },
        onDrag: (x, y) => {
            // Batch move other selected elements
            moveSelectedElements(x, y);
        }
    });
    instances.push(instance);
});
```

### Event Handling

```javascript
const eventDraggable = new DraggableResizable(element, {
    onDragStart: (e) => {
        console.log('Drag started');
        element.style.opacity = '0.8';
        return true; // Return false to cancel drag
    },
    onDrag: (x, y) => {
        document.title = `Position: ${x}, ${y}`;
    },
    onDragStop: (x, y) => {
        console.log('Drag ended');
        element.style.opacity = '1';
    },
    onResize: (handle, x, y, width, height) => {
        console.log(`Resized: ${width}×${height}`);
    },
    onActivated: () => {
        element.style.boxShadow = '0 0 10px rgba(0,0,255,0.5)';
    },
    onDeactivated: () => {
        element.style.boxShadow = 'none';
    }
});
```

## 🌐 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+  
- ✅ Safari 10+
- ✅ Edge 79+
- ✅ IE 11+ (requires polyfill)
- ✅ Mobile browsers (touch support)

### IE Compatibility

For IE11, add the following polyfill:

```html
<!-- IE11 Polyfills -->
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
```

## ⚡ Performance Optimization

### Large Number of Elements

```javascript
// For large numbers of elements, recommend lazy initialization
function createDraggables(elements) {
    const instances = [];
    
    elements.forEach((element, index) => {
        // Lazy initialization to avoid blocking UI
        setTimeout(() => {
            const instance = new DraggableResizable(element, {
                // Configuration options
            });
            instances.push(instance);
        }, index * 10);
    });
    
    return instances;
}
```

### Memory Management

```javascript
// Clean up instances when component is destroyed
function cleanup() {
    instances.forEach(instance => {
        instance.destroy();
    });
    instances.length = 0;
}

// Clean up on page unload
window.addEventListener('beforeunload', cleanup);
```

## 🔄 Migration from Vue Component

If you were previously using the vue-draggable-resizable Vue component, migrating to this pure JavaScript version is very simple:

### Vue Component Usage:
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
  Content
</vue-draggable-resizable>
```

### Pure JavaScript Usage:
```javascript
const element = document.createElement('div');
element.textContent = 'Content';
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

## 🛠️ Development and Build

### Project Structure

```
draggable-resizable/
├── draggable-resizable.js    # Core library file
├── draggable-resizable.css   # Default styles
├── demo.html                 # Demo page
├── multi-drag-test.html      # Batch drag demo
├── resize-test.html          # Resize test
└── README.md                 # Documentation
```

### Local Development

```bash
# Start local server
python -m http.server 8000
# or
npx serve .

# Access demo page
open http://localhost:8000/demo.html
```

## ❓ FAQ

### Q: Why choose pure JavaScript over frameworks?
A: This library is specifically designed to be framework-agnostic, usable in any environment: native HTML, Vue, React, Angular, etc., without dependency conflicts.

### Q: How to handle performance issues with large numbers of elements?
A: Recommend using lazy initialization, virtual scrolling, and calling the `destroy()` method to clean up instances when not needed.

### Q: Does it support Server-Side Rendering (SSR)?
A: This is a pure client-side library that requires a DOM environment. In SSR scenarios, ensure initialization after client-side rendering.

### Q: How to implement custom drag handles?
A: Use the `dragHandle` option to specify a CSS selector - only matching elements can trigger dragging.

```javascript
const draggable = new DraggableResizable(element, {
    dragHandle: '.drag-handle'  // Only .drag-handle elements can drag
});
```

### Q: How to disable certain resize handles?
A: Use the `handles` option to customize the handle list:

```javascript
const draggable = new DraggableResizable(element, {
    handles: ['br', 'mr', 'bm']  // Only show bottom-right, middle-right, bottom-middle handles
});
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🤝 Contributing

Issues and feature requests are welcome! Please follow these steps:

1. Fork this project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🎉 Acknowledgments

Thanks to all developers who have contributed to this project!

---

**DraggableResizable** - Making drag & drop simple, without framework constraints! 🚀