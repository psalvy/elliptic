// Shared UI helpers: slider binding, canvas sizing, touch
(function() {
  'use strict';

  // Set canvas resolution to match CSS size, with DPR awareness
  function sizeCanvas(canvas, w, h) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    return dpr;
  }

  // Auto-size canvas to container width
  function fitCanvas(canvas, aspectRatio) {
    aspectRatio = aspectRatio || 0.75;
    var parent = canvas.parentElement;
    var w = parent.clientWidth;
    var h = Math.round(w * aspectRatio);
    return sizeCanvas(canvas, w, h);
  }

  // Bind slider to a display element and callback
  function bindSlider(sliderId, displayId, callback, transform) {
    var slider = document.getElementById(sliderId);
    var display = document.getElementById(displayId);
    if (!slider) return;
    transform = transform || function(v) { return parseFloat(v).toFixed(2); };

    function update() {
      var v = parseFloat(slider.value);
      if (display) display.textContent = transform(v);
      if (callback) callback(v);
    }

    slider.addEventListener('input', update);
    update();
    return slider;
  }

  // Get click/touch position relative to canvas
  function canvasPos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    var clientX, clientY;
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  // Simple debounce
  function debounce(fn, ms) {
    var timer;
    return function() {
      var args = arguments, ctx = this;
      clearTimeout(timer);
      timer = setTimeout(function() { fn.apply(ctx, args); }, ms);
    };
  }

  // Resize handler for all canvases
  function onResize(callback) {
    window.addEventListener('resize', debounce(callback, 200));
  }

  window.UI = {
    sizeCanvas: sizeCanvas,
    fitCanvas: fitCanvas,
    bindSlider: bindSlider,
    canvasPos: canvasPos,
    debounce: debounce,
    onResize: onResize
  };
})();
