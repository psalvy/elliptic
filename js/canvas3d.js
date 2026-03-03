// Minimal 3D wireframe engine using Canvas 2D
(function() {
  'use strict';

  function Canvas3D(canvas, opts) {
    opts = opts || {};
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.w = canvas.width;
    this.h = canvas.height;
    this.cx = this.w / 2;
    this.cy = this.h / 2;
    this.scale = opts.scale || Math.min(this.w, this.h) * 0.35;
    this.rotX = opts.rotX || -0.4;
    this.rotY = opts.rotY || 0.6;
    this.rotZ = opts.rotZ || 0;
    this.perspective = opts.perspective || 4;
    this.meshes = [];
    this.dragging = false;
    this.lastPos = null;
    this._animId = null;
    this._autoRotate = opts.autoRotate || false;
    this._setupInput();
  }

  Canvas3D.prototype._setupInput = function() {
    var self = this;
    var getPos = function(e) {
      if (e.touches) e = e.touches[0];
      var r = self.canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    var onDown = function(e) {
      e.preventDefault();
      self.dragging = true;
      self.lastPos = getPos(e);
    };
    var onMove = function(e) {
      if (!self.dragging) return;
      e.preventDefault();
      var p = getPos(e);
      var dx = p.x - self.lastPos.x;
      var dy = p.y - self.lastPos.y;
      self.rotY += dx * 0.008;
      self.rotX += dy * 0.008;
      self.lastPos = p;
      if (!self._animId) self.render();
    };
    var onUp = function() { self.dragging = false; };

    this.canvas.addEventListener('mousedown', onDown);
    this.canvas.addEventListener('mousemove', onMove);
    this.canvas.addEventListener('mouseup', onUp);
    this.canvas.addEventListener('mouseleave', onUp);
    this.canvas.addEventListener('touchstart', onDown, { passive: false });
    this.canvas.addEventListener('touchmove', onMove, { passive: false });
    this.canvas.addEventListener('touchend', onUp);
  };

  Canvas3D.prototype.project = function(x, y, z) {
    // Rotate around X
    var cosX = Math.cos(this.rotX), sinX = Math.sin(this.rotX);
    var y1 = y * cosX - z * sinX;
    var z1 = y * sinX + z * cosX;
    // Rotate around Y
    var cosY = Math.cos(this.rotY), sinY = Math.sin(this.rotY);
    var x1 = x * cosY + z1 * sinY;
    var z2 = -x * sinY + z1 * cosY;
    // Rotate around Z
    var cosZ = Math.cos(this.rotZ), sinZ = Math.sin(this.rotZ);
    var x2 = x1 * cosZ - y1 * sinZ;
    var y2 = x1 * sinZ + y1 * cosZ;
    // Perspective
    var d = this.perspective / (this.perspective + z2);
    return {
      x: this.cx + x2 * this.scale * d,
      y: this.cy + y2 * this.scale * d,
      z: z2,
      d: d
    };
  };

  Canvas3D.prototype.clear = function() {
    this.ctx.fillStyle = '#0d1117';
    this.ctx.fillRect(0, 0, this.w, this.h);
  };

  Canvas3D.prototype.drawLine = function(p1, p2, color, width) {
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.strokeStyle = color || '#4a9eff';
    this.ctx.lineWidth = width || 1;
    this.ctx.stroke();
  };

  Canvas3D.prototype.drawPoint = function(p, color, radius) {
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, (radius || 4) * p.d, 0, Math.PI * 2);
    this.ctx.fillStyle = color || '#e94560';
    this.ctx.fill();
  };

  // Generate torus vertices
  Canvas3D.torusPoints = function(R, r, nu, nv) {
    var pts = [];
    for (var i = 0; i <= nu; i++) {
      var row = [];
      var u = (i / nu) * Math.PI * 2;
      for (var j = 0; j <= nv; j++) {
        var v = (j / nv) * Math.PI * 2;
        row.push([
          (R + r * Math.cos(v)) * Math.cos(u),
          (R + r * Math.cos(v)) * Math.sin(u),
          r * Math.sin(v)
        ]);
      }
      pts.push(row);
    }
    return pts;
  };

  // Draw wireframe from grid of points
  Canvas3D.prototype.drawWireframe = function(grid, color, skipU, skipV) {
    color = color || 'rgba(74,158,255,0.4)';
    skipU = skipU || 1;
    skipV = skipV || 1;
    for (var i = 0; i < grid.length; i += skipU) {
      for (var j = 0; j < grid[i].length - 1; j++) {
        var p1 = this.project(grid[i][j][0], grid[i][j][1], grid[i][j][2]);
        var p2 = this.project(grid[i][j+1][0], grid[i][j+1][1], grid[i][j+1][2]);
        this.drawLine(p1, p2, color, 0.7);
      }
    }
    for (var j = 0; j < grid[0].length; j += skipV) {
      for (var i = 0; i < grid.length - 1; i++) {
        var p1 = this.project(grid[i][j][0], grid[i][j][1], grid[i][j][2]);
        var p2 = this.project(grid[i+1][j][0], grid[i+1][j][1], grid[i+1][j][2]);
        this.drawLine(p1, p2, color, 0.7);
      }
    }
  };

  // Map (u,v) in [0,1]x[0,1] to torus surface point
  Canvas3D.torusPoint = function(R, r, u, v) {
    var theta = u * Math.PI * 2;
    var phi = v * Math.PI * 2;
    return [
      (R + r * Math.cos(phi)) * Math.cos(theta),
      (R + r * Math.cos(phi)) * Math.sin(theta),
      r * Math.sin(phi)
    ];
  };

  Canvas3D.prototype.render = function() {
    this.clear();
    for (var i = 0; i < this.meshes.length; i++) {
      this.meshes[i](this);
    }
  };

  Canvas3D.prototype.animate = function(fn) {
    var self = this;
    function loop() {
      if (self._autoRotate && !self.dragging) {
        self.rotY += 0.003;
      }
      // If a custom draw function is provided, it's responsible for clearing
      // and drawing (via scene.clear(), scene.drawWireframe(), etc.).
      // Otherwise fall back to the mesh list.
      if (fn) {
        fn(self);
      } else {
        self.render();
      }
      self._animId = requestAnimationFrame(loop);
    }
    loop();
  };

  Canvas3D.prototype.stop = function() {
    if (this._animId) cancelAnimationFrame(this._animId);
    this._animId = null;
  };

  // Generate cylinder vertices (for gluing animation)
  Canvas3D.cylinderPoints = function(r, h, nu, nv) {
    var pts = [];
    for (var i = 0; i <= nu; i++) {
      var row = [];
      var u = (i / nu) * Math.PI * 2;
      for (var j = 0; j <= nv; j++) {
        var t = j / nv;
        row.push([
          r * Math.cos(u),
          r * Math.sin(u),
          (t - 0.5) * h
        ]);
      }
      pts.push(row);
    }
    return pts;
  };

  window.Canvas3D = Canvas3D;
})();
