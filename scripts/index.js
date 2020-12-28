'use strict';

const lensSelectorId = 'cursor-zoom-lens';
const resultSelectorId = 'cursor-zoom-result';
let currentResult = null;
let currentLens = null;
let currentSource = null;
let isInLens = false;
let isInImage = false;
let hasRegisterEvents = false;
const allSources = [];

// source: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_image_zoom
function imageZoom() {
    let cx, cy;
    // à faire dans les params
    currentResult.setAttribute('id', resultSelectorId);
    /*create lens:*/
    if (currentLens instanceof Element || currentLens instanceof HTMLDocument) {
        currentLens.remove();
    }
    currentLens = document.createElement('DIV');
    currentLens.setAttribute('id', lensSelectorId);
    let small = null;
    (currentSource.source.offsetWidth < currentSource.source.offsetHeight) ? small = currentSource.source.offsetWidth : small = currentSource.source.offsetHeight;
    small = Math.trunc(small * (currentSource.param.widthLens / 100));
    currentLens.style.width = small + 'px';
    currentLens.style.height = small + 'px';
    /*insert lens:*/
    currentSource.source.parentElement.insertBefore(currentLens, currentSource.source);
    if (currentResult.offsetWidth < 10) {
        currentResult.style.width = '300px';
    }
    currentResult.style.height = currentResult.offsetWidth + 'px';
    /*calculate the ratio between currentResult DIV and lens:*/
    cx = currentResult.offsetWidth / currentLens.offsetWidth;
    cy = currentResult.offsetHeight / currentLens.offsetHeight;
    /*set background properties for the currentResult DIV:*/
    currentResult.style.backgroundImage = 'url("' + currentSource.source.src + '")';
    currentResult.style.backgroundSize = (currentSource.source.width * cx) + 'px ' + (currentSource.source.height * cy) + 'px';
    /*execute a function when someone moves the cursor over the image, or the lens:*/
    currentLens.addEventListener('mousemove', moveLens);
    currentSource.source.addEventListener('mousemove', moveLens);
    /*and also for touch screens:*/
    currentLens.addEventListener('touchmove', moveLens);
    currentSource.source.addEventListener('touchmove', moveLens);

    function moveLens(e) {
        let pos, x, y;
        /*prevent any other actions that may occur when moving over the image:*/
        e.preventDefault();
        /*get the cursor's x and y positions:*/
        pos = getCursorPos(e);
        /*calculate the position of the lens:*/
        x = pos.x - (currentLens.offsetWidth / 2);
        y = pos.y - (currentLens.offsetHeight / 2);
        /*prevent the lens from being positioned outside the image:*/
        if (x > currentSource.source.width - currentLens.offsetWidth) {
            x = currentSource.source.width - currentLens.offsetWidth;
        }
        if (x < 0) {
            x = 0;
        }
        if (y > currentSource.source.height - currentLens.offsetHeight) {
            y = currentSource.source.height - currentLens.offsetHeight;
        }
        if (y < 0) {
            y = 0;
        }
        /*set the position of the lens:*/
        currentLens.style.left = x + 'px';
        currentLens.style.top = y + 'px';
        /*display what the lens 'sees':*/
        currentResult.style.backgroundPosition = '-' + (x * cx) + 'px -' + (y * cy) + 'px';
    }

    function getCursorPos(e) {
        let a, x, y;
        /*get the x and y positions of the image:*/
        a = currentSource.source.getBoundingClientRect();
        /*calculate the cursor's x and y coordinates, relative to the image:*/
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        /*consider any page scrolling:*/
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return {x: x, y: y};
    }
}

function removeResultIfNotOnImage() {
    if (currentResult instanceof Element || currentResult instanceof HTMLDocument) {
        setTimeout(() => {
            if (isInLens === false && isInImage === false) {
                currentResult.remove();
                if (currentLens instanceof Element || currentLens instanceof HTMLDocument) {
                    currentLens.remove();
                }
            }
        }, 1);
    }
}

function positionResult() {
    let position = currentSource.param.position;
    const offsets = currentSource.source.getBoundingClientRect();
    const top = offsets.top + window.scrollY;
    const left = offsets.left;
    currentResult.setAttribute('class', currentSource.param.classResult);
    if (currentSource.param.position === 'auto') {
        const right = window.outerWidth - (left + currentSource.source.offsetWidth);
        (left + currentSource.source.offsetWidth > right) ? position = 'left' : position = 'right';
    }
    if (position === 'right') {
        currentResult.setAttribute('style', 'left:' + (left + currentSource.source.offsetWidth + currentSource.param.margin) + 'px;top:' + top + 'px');
    } else if (position === 'left') {
        currentResult.setAttribute('style', 'left:' + (left - currentResult.offsetWidth - currentSource.param.margin) + 'px;top:' + top + 'px');
    } else if (position === 'top') {
        currentResult.setAttribute('style', 'left:' + left + 'px;top:' + (top - currentResult.offsetWidth - currentSource.param.margin) + 'px');
    } else if (position === 'bottom') {
        currentResult.setAttribute('style', 'left:' + left + 'px;top:' + (top + currentSource.source.offsetHeight + currentSource.param.margin) + 'px');
    }
}

function toNodeList(elements) {
    let list;
    for (let elm of elements) {
        elm.setAttribute('wrapNodeList', '');
        list = document.querySelectorAll('[wrapNodeList]');
        elm.removeAttribute('wrapNodeList');
    }
    return list;
}

function init(selector, param) {
    if (typeof param !== 'object') {
        param = {};
    }
    if (typeof param.position !== 'string') {
        param.position = 'auto';
    }
    if (typeof param.classResult !== 'string') {
        param.classResult = 'cursor-zoom-result';
    }
    if (typeof param.widthLens !== 'number') {
        param.widthLens = 40;
    } else if (param.widthLens > 100) {
        param.widthLens = 100;
    }
    if (typeof param.margin !== 'number') {
        param.margin = 15;
    }
    let sources;
    if (typeof selector === 'string') {
        sources = document.querySelectorAll(selector);
    } else {
        if (typeof selector.length === 'number') {
            const arr = [];
            for (let elm of selector) {
                arr.push(elm);
            }
            sources = toNodeList(arr);
        } else {
            sources = toNodeList([selector]);
        }
    }
    sources.forEach((source) => {
        if (typeof allSources.find(x => x.source === source) === 'object') {
            for (let i = allSources.length - 1; i >= 0; i--) {
                if (allSources[i].source === source) {
                    allSources.splice(i, 1);
                }
            }
        }
        allSources.push({
            param: param,
            source: source,
        });
    });
}

function registerEvents() {
    document.body.addEventListener('mouseenter', (e) => {
        const source = allSources.find(x => x.source === e.target);
        if (typeof source !== 'undefined') {
            isInImage = true;
            currentSource = source;
            if (currentResult instanceof Element || currentResult instanceof HTMLDocument) {
                currentResult.remove();
            }
            currentResult = document.createElement('DIV');
            document.body.appendChild(currentResult);
            positionResult();
            imageZoom();
        }
    }, true);
    document.body.addEventListener('mouseout', (e) => {
        const source = allSources.find(x => x.source === e.target);
        if (typeof source !== 'undefined') {
            isInImage = false;
            removeResultIfNotOnImage();
        }
    }, true);
    document.body.addEventListener('mouseenter', (e) => {
        if (e.target.id === lensSelectorId) {
            isInLens = true;
        }
    }, true);
    document.body.addEventListener('mouseout', (e) => {
        if (e.target.id === lensSelectorId) {
            isInLens = false;
            removeResultIfNotOnImage();
        }
    }, true);
}

const cursorZoom = function (selector, param) {
    init(selector, param);
    if (hasRegisterEvents === false) {
        registerEvents();
        hasRegisterEvents = true;
    }
};

module.exports = cursorZoom;
