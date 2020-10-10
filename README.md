# cursor-zoom
![Demo GIF](examples/cursor-zoom.gif "Demo GIF")

A simple module to zoom on an image with the cursor.

Most of the code comes from: [https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_image_zoom](https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_image_zoom)

## Warning
The `<img>` must be placed inside a container with relative positioning.

## Installation
```bash
$ npm install cursor-zoom
```

## Usage
```html
<div class="position-relative">
    <img class="cursor-zoom" src="img-source.jpg">
</div>
```
```javascript
cursorZoom('.cursor-zoom', {// all parameters are optionals

        // 'auto' will place the zooming image on the right or left, depending of the position of the image on the window
        position: 'auto', // 'top', 'left', 'right', 'left', 'auto' | default: 'auto'

        // if you use bootstrap you can use class like 'col-4'
        // /!\ the class must define the width of the zoom container, which means that the class you
        // pass here in parameter must have the property width defined
        classResult: 'col-4', // class of the zooming image | default: 'cursor-zoom-result'
        
        // the lens is the small square when the cursor is hover the image
        widthLens: 40, // width of the lens in % of the smallest width or height of the image | default 40

        margin: 15, // margin between image and zooming image in px
    });
```
If you want to pass different parameters for images, you can do this:
```javascript
cursorZoom('.image-class-1',{margin: 20});
cursorZoom('.image-class-2',{margin: 40});
```

If you want to override a previous configuration, you can do this:
```javascript
cursorZoom('.image-class-1',{position: 'auto'});
cursorZoom('.image-class-1',{position: 'top'});
```

You can also pass DOM element:
```javascript
cursorZoom(document.querySelector('.image-class-1'));// 1 element
cursorZoom(document.querySelectorAll('.image-class-1'));// multiple elements
```

Jquery also works:
```javascript
cursorZoom($('.image-class-1'));
```

## Customizing
You can override these css class:
```css
#cursor-zoom-lens {
    position: absolute;
    border: 1px solid #d4d4d4;
    background-color: rgba(0, 0, 0, 0.5);
}

#cursor-zoom-result {
    position: absolute;
    border: 1px solid #d4d4d4;
    z-index: 100000;
}

.cursor-zoom-result {
    width: 300px;
}
```
    
## Contributing
Pull requests are welcome.

If you detect a bug, please open an issue.

To build the project:
```bash
$ npm run build
```

## License
[MIT](https://choosealicense.com/licenses/mit/)