// 2D plotting library for elliptic curves
(function() {
  'use strict';

  function Plot2D(canvas, opts) {
    opts = opts || {};
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.w = canvas.width;
    this.h = canvas.height;
    this.xMin = opts.xMin !== undefined ? opts.xMin : -4;
    this.xMax = opts.xMax !== undefined ? opts.xMax : 4;
    this.yMin = opts.yMin !== undefined ? opts.yMin : -4;
    this.yMax = opts.yMax !== undefined ? opts.yMax : 4;
    this.bg = opts.bg || '#0d1117';
    this.gridColor = opts.gridColor || 'rgba(255,255,255,0.06)';
    this.axisColor = opts.axisColor || 'rgba(255,255,255,0.2)';
  }

  Plot2D.prototype.toScreen = function(x, y) {
    return {
      x: (x - this.xMin) / (this.xMax - this.xMin) * this.w,
      y: this.h - (y - this.yMin) / (this.yMax - this.yMin) * this.h
    };
  };

  Plot2D.prototype.fromScreen = function(sx, sy) {
    return {
      x: this.xMin + sx / this.w * (this.xMax - this.xMin),
      y: this.yMax - sy / this.h * (this.yMax - this.yMin)
    };
  };

  Plot2D.prototype.clear = function() {
    this.ctx.fillStyle = this.bg;
    this.ctx.fillRect(0, 0, this.w, this.h);
  };

  Plot2D.prototype.drawGrid = function() {
    var ctx = this.ctx;
    ctx.strokeStyle = this.gridColor;
    ctx.lineWidth = 1;
    for (var x = Math.ceil(this.xMin); x <= this.xMax; x++) {
      var p = this.toScreen(x, 0);
      ctx.beginPath(); ctx.moveTo(p.x, 0); ctx.lineTo(p.x, this.h); ctx.stroke();
    }
    for (var y = Math.ceil(this.yMin); y <= this.yMax; y++) {
      var p = this.toScreen(0, y);
      ctx.beginPath(); ctx.moveTo(0, p.y); ctx.lineTo(this.w, p.y); ctx.stroke();
    }
    // Axes
    ctx.strokeStyle = this.axisColor;
    ctx.lineWidth = 1.5;
    var o = this.toScreen(0, 0);
    ctx.beginPath(); ctx.moveTo(0, o.y); ctx.lineTo(this.w, o.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(o.x, 0); ctx.lineTo(o.x, this.h); ctx.stroke();
  };

  // Plot implicit curve f(x,y)=0 using marching squares
  Plot2D.prototype.plotImplicit = function(f, color, width) {
    var ctx = this.ctx;
    var res = 200;
    var dx = (this.xMax - this.xMin) / res;
    var dy = (this.yMax - this.yMin) / res;

    ctx.strokeStyle = color || '#e94560';
    ctx.lineWidth = width || 2;

    // Evaluate grid
    var vals = [];
    for (var i = 0; i <= res; i++) {
      vals[i] = [];
      var x = this.xMin + i * dx;
      for (var j = 0; j <= res; j++) {
        var y = this.yMin + j * dy;
        vals[i][j] = f(x, y);
      }
    }

    // March squares
    for (var i = 0; i < res; i++) {
      for (var j = 0; j < res; j++) {
        var x = this.xMin + i * dx;
        var y = this.yMin + j * dy;
        var v00 = vals[i][j], v10 = vals[i+1][j], v01 = vals[i][j+1], v11 = vals[i+1][j+1];

        // Simple contour: if sign change across any edge, draw segment
        var edges = [];
        if (v00 * v10 < 0) edges.push(this._lerp(x, y, x+dx, y, v00, v10));
        if (v10 * v11 < 0) edges.push(this._lerp(x+dx, y, x+dx, y+dy, v10, v11));
        if (v01 * v11 < 0) edges.push(this._lerp(x, y+dy, x+dx, y+dy, v01, v11));
        if (v00 * v01 < 0) edges.push(this._lerp(x, y, x, y+dy, v00, v01));

        if (edges.length >= 2) {
          var p1 = this.toScreen(edges[0][0], edges[0][1]);
          var p2 = this.toScreen(edges[1][0], edges[1][1]);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          if (edges.length === 4) {
            var p3 = this.toScreen(edges[2][0], edges[2][1]);
            var p4 = this.toScreen(edges[3][0], edges[3][1]);
            ctx.beginPath();
            ctx.moveTo(p3.x, p3.y);
            ctx.lineTo(p4.x, p4.y);
            ctx.stroke();
          }
        }
      }
    }
  };

  Plot2D.prototype._lerp = function(x1, y1, x2, y2, v1, v2) {
    var t = v1 / (v1 - v2);
    return [x1 + t * (x2 - x1), y1 + t * (y2 - y1)];
  };

  // Draw a line segment
  Plot2D.prototype.drawLine = function(x1, y1, x2, y2, color, width) {
    var p1 = this.toScreen(x1, y1);
    var p2 = this.toScreen(x2, y2);
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.strokeStyle = color || '#64b5f6';
    this.ctx.lineWidth = width || 1.5;
    this.ctx.stroke();
  };

  // Draw extended line through two points
  Plot2D.prototype.drawLineThrough = function(x1, y1, x2, y2, color, width) {
    var dx = x2 - x1, dy = y2 - y1;
    if (Math.abs(dx) < 1e-10 && Math.abs(dy) < 1e-10) return;
    var t1, t2;
    if (Math.abs(dx) > Math.abs(dy)) {
      t1 = (this.xMin - x1) / dx;
      t2 = (this.xMax - x1) / dx;
    } else {
      t1 = (this.yMin - y1) / dy;
      t2 = (this.yMax - y1) / dy;
    }
    this.drawLine(x1 + t1*dx, y1 + t1*dy, x1 + t2*dx, y1 + t2*dy, color, width);
  };

  // Draw a point
  Plot2D.prototype.drawPoint = function(x, y, color, radius, label) {
    var p = this.toScreen(x, y);
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, radius || 5, 0, Math.PI * 2);
    this.ctx.fillStyle = color || '#e94560';
    this.ctx.fill();
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 1.5;
    this.ctx.stroke();

    if (label) {
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '13px sans-serif';
      this.ctx.fillText(label, p.x + 8, p.y - 8);
    }
  };

  // Plot parametric curve
  Plot2D.prototype.plotParametric = function(fx, fy, tMin, tMax, steps, color, width) {
    var ctx = this.ctx;
    steps = steps || 200;
    ctx.strokeStyle = color || '#4caf50';
    ctx.lineWidth = width || 1.5;
    ctx.beginPath();
    var started = false;
    for (var i = 0; i <= steps; i++) {
      var t = tMin + (tMax - tMin) * i / steps;
      var x = fx(t), y = fy(t);
      var p = this.toScreen(x, y);
      if (!started) { ctx.moveTo(p.x, p.y); started = true; }
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  };

  // Find y on elliptic curve y^2 = x^3 + ax + b for a given x (positive branch)
  Plot2D.ellipticY = function(x, a, b) {
    var val = x*x*x + a*x + b;
    return val >= 0 ? Math.sqrt(val) : NaN;
  };

  // Elliptic curve point addition on y^2 = x^3 + ax + b
  Plot2D.ecAdd = function(P, Q, a) {
    if (!P || !Q) return null;
    var x1 = P[0], y1 = P[1], x2 = Q[0], y2 = Q[1];
    var m;
    if (Math.abs(x1 - x2) < 1e-10) {
      if (Math.abs(y1 - y2) < 1e-10) {
        // Doubling
        if (Math.abs(y1) < 1e-10) return null; // point at infinity
        m = (3*x1*x1 + a) / (2*y1);
      } else {
        return null; // P + (-P) = O
      }
    } else {
      m = (y2 - y1) / (x2 - x1);
    }
    var x3 = m*m - x1 - x2;
    var y3 = m*(x1 - x3) - y1;
    return [x3, -y3]; // Reflect over x-axis for the "third point"
  };

  window.Plot2D = Plot2D;
})();
