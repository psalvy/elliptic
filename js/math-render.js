// Thin wrapper around KaTeX for rendering math in the page
(function() {
  'use strict';

  function renderAll() {
    // Render block math: <span class="math-tex"> or elements with data-math
    document.querySelectorAll('.math-tex').forEach(function(el) {
      if (el.dataset.rendered) return;
      try {
        katex.render(el.textContent, el, { displayMode: el.classList.contains('block'), throwOnError: false });
        el.dataset.rendered = '1';
      } catch(e) { console.warn('KaTeX error:', e); }
    });

    // Render inline: $...$ and display: $$...$$
    // Walk text nodes in .container
    var container = document.querySelector('.container');
    if (!container) return;
    renderMathInElement(container);
  }

  function renderMathInElement(root) {
    // Simple scan for $$...$$ and $...$
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach(function(node) {
      var text = node.textContent;
      if (text.indexOf('$') === -1) return;
      // Skip if inside <code>, <pre>, <script>, <style>, or already rendered
      var parent = node.parentElement;
      if (!parent) return;
      var tag = parent.tagName.toLowerCase();
      if (tag === 'code' || tag === 'pre' || tag === 'script' || tag === 'style') return;
      if (parent.classList.contains('katex') || parent.closest('.katex')) return;

      // Match $$...$$ first, then $...$
      var regex = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
      var parts = [];
      var lastIndex = 0;
      var match;

      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push({ type: 'text', value: text.slice(lastIndex, match.index) });
        }
        if (match[1] !== undefined) {
          parts.push({ type: 'display', value: match[1] });
        } else {
          parts.push({ type: 'inline', value: match[2] });
        }
        lastIndex = regex.lastIndex;
      }

      if (parts.length === 0) return;
      if (lastIndex < text.length) {
        parts.push({ type: 'text', value: text.slice(lastIndex) });
      }

      var frag = document.createDocumentFragment();
      parts.forEach(function(p) {
        if (p.type === 'text') {
          frag.appendChild(document.createTextNode(p.value));
        } else {
          var span = document.createElement('span');
          try {
            katex.render(p.value, span, { displayMode: p.type === 'display', throwOnError: false });
          } catch(e) {
            span.textContent = p.value;
          }
          frag.appendChild(span);
        }
      });
      parent.replaceChild(frag, node);
    });
  }

  // Run on DOMContentLoaded and expose for manual use
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAll);
  } else {
    setTimeout(renderAll, 0);
  }

  window.MathRender = { renderAll: renderAll, renderIn: renderMathInElement };
})();
