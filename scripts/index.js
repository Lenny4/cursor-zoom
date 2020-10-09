'use strict';
const defaultResultSelector = '#cursor-zoom-result';
let currentResult = null;
let currentLens = null;

// source: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_image_zoom
function imageZoom(img, param, result) {
    let lens, cx, cy;
    // à faire dans les params
    result.setAttribute("style", `border: 1px solid #d4d4d4;
            /*set the size of the result div:*/
            width: 300px;
            height: 300px;width: 500px; height:500px;`);
    /*create lens:*/
    if (currentLens instanceof Element || currentLens instanceof HTMLDocument) {
        currentLens.remove();
    }
    currentResult = result;
    lens = document.createElement("DIV");
    lens.setAttribute("style", `position: absolute;
            border: 1px solid #d4d4d4;
            width: 40px;
            height: 40px;`);
    /*insert lens:*/
    img.parentElement.insertBefore(lens, img);
    /*calculate the ratio between result DIV and lens:*/
    cx = result.offsetWidth / lens.offsetWidth;
    cy = result.offsetHeight / lens.offsetHeight;
    /*set background properties for the result DIV:*/
    result.style.backgroundImage = "url('" + img.src + "')";
    result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
    /*execute a function when someone moves the cursor over the image, or the lens:*/
    lens.addEventListener("mousemove", moveLens);
    img.addEventListener("mousemove", moveLens);
    /*and also for touch screens:*/
    lens.addEventListener("touchmove", moveLens);
    img.addEventListener("touchmove", moveLens);
    currentLens = lens;

    function moveLens(e) {
        let pos, x, y;
        /*prevent any other actions that may occur when moving over the image:*/
        e.preventDefault();
        /*get the cursor's x and y positions:*/
        pos = getCursorPos(e);
        /*calculate the position of the lens:*/
        x = pos.x - (lens.offsetWidth / 2);
        y = pos.y - (lens.offsetHeight / 2);
        /*prevent the lens from being positioned outside the image:*/
        if (x > img.width - lens.offsetWidth) {
            x = img.width - lens.offsetWidth;
        }
        if (x < 0) {
            x = 0;
        }
        if (y > img.height - lens.offsetHeight) {
            y = img.height - lens.offsetHeight;
        }
        if (y < 0) {
            y = 0;
        }
        /*set the position of the lens:*/
        lens.style.left = x + "px";
        lens.style.top = y + "px";
        /*display what the lens "sees":*/
        result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
    }

    function getCursorPos(e) {
        let a, x, y;
        /*get the x and y positions of the image:*/
        a = img.getBoundingClientRect();
        /*calculate the cursor's x and y coordinates, relative to the image:*/
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        /*consider any page scrolling:*/
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return {x: x, y: y};
    }
}

const cursorZoom = function (source, param = null, result = null) {
    if (typeof source === 'string') {
        source = document.querySelector(source);
    }
    if (result === null) {
        result = document.querySelector(defaultResultSelector);
        if (result === null || typeof result === 'undefined') {
            result = document.createElement("DIV");
            result.setAttribute("id", defaultResultSelector);
            document.body.appendChild(result);
        }
    } else if (typeof result === 'string') {
        result = document.querySelector(result);
    }
    if (currentResult instanceof Element || currentResult instanceof HTMLDocument) {
        currentResult.remove();
    }
    currentResult = result;
    imageZoom(source, param, result);
};

module.exports = cursorZoom;
