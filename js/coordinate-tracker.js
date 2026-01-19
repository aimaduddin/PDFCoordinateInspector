const CoordinateTracker = {
  canvas: null,
  tooltip: null,
  origin: 'top-left',
  activeUnits: { px: false, pt: true, in: false, cm: false, mm: false, pc: false },

  init() {
    this.canvas = document.getElementById('pdf-canvas');
    this.tooltip = document.getElementById('coordinate-tooltip');
    this.setupEventListeners();
  },

  setupEventListeners() {
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseleave', () => this.hideTooltip());

    document.querySelectorAll('input[name="origin"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.origin = e.target.value;
      });
    });

    const units = ['px', 'pt', 'in', 'cm', 'mm', 'pc'];
    units.forEach(unit => {
      document.getElementById(`unit-${unit}`).addEventListener('change', (e) => {
        this.activeUnits[unit] = e.target.checked;
      });
    });
  },

  handleMouseMove(e) {
    const coords = this.calculateCoordinates(e);
    this.updateTooltip(coords, e.clientX, e.clientY);
  },

  calculateCoordinates(e) {
    const canvasRect = this.canvas.getBoundingClientRect();
    const scale = PDFRenderer.getScale();
    const devicePixelRatio = PDFRenderer.devicePixelRatio || 1;

    let rawX = e.clientX - canvasRect.left;
    let rawY = e.clientY - canvasRect.top;

    const pageDimensions = PDFRenderer.getPageDimensions();
    
    let pdfX = rawX / scale;
    let pdfY = rawY / scale;

    const pageWidth = pageDimensions.width;
    const pageHeight = pageDimensions.height;

    pdfX = pdfX / devicePixelRatio;
    pdfY = pdfY / devicePixelRatio;

    let finalX = pdfX;
    let finalY = pdfY;

    if (this.origin === 'bottom-left') {
      finalY = pageHeight - pdfY;
    }

    return {
      x: finalX,
      y: finalY,
      pixels: pdfX,
      pixelsY: pdfY
    };
  },

  updateTooltip(coords, mouseX, mouseY) {
    const scale = PDFRenderer.getScale();
    const convertedX = UnitConverter.convertAll(coords.x, 1);
    const convertedY = UnitConverter.convertAll(coords.y, 1);

    let html = '';
    
    if (this.activeUnits.px) {
      html += `<div class="flex justify-between gap-4"><span class="text-gray-400">X:</span><span class="font-mono">${convertedX.px} px</span></div>`;
      html += `<div class="flex justify-between gap-4"><span class="text-gray-400">Y:</span><span class="font-mono">${convertedY.px} px</span></div>`;
    }
    
    if (this.activeUnits.pt) {
      html += `<div class="flex justify-between gap-4"><span class="text-gray-400">X:</span><span class="font-mono">${convertedX.pt} pt</span></div>`;
      html += `<div class="flex justify-between gap-4"><span class="text-gray-400">Y:</span><span class="font-mono">${convertedY.pt} pt</span></div>`;
    }
    
    if (this.activeUnits.in) {
      html += `<div class="flex justify-between gap-4"><span class="text-gray-400">X:</span><span class="font-mono">${convertedX.in} in</span></div>`;
      html += `<div class="flex justify-between gap-4"><span class="text-gray-400">Y:</span><span class="font-mono">${convertedY.in} in</span></div>`;
    }
    
    if (this.activeUnits.cm) {
      html += `<div class="flex justify-between gap-4"><span class="text-gray-400">X:</span><span class="font-mono">${convertedX.cm} cm</span></div>`;
      html += `<div class="flex justify-between gap-4"><span class="text-gray-400">Y:</span><span class="font-mono">${convertedY.cm} cm</span></div>`;
    }

    if (this.activeUnits.mm) {
      html += `<div class="flex justify-between gap-4"><span class="text-gray-400">X:</span><span class="font-mono">${convertedX.mm} mm</span></div>`;
      html += `<div class="flex justify-between gap-4"><span class="text-gray-400">Y:</span><span class="font-mono">${convertedY.mm} mm</span></div>`;
    }

    if (this.activeUnits.pc) {
      html += `<div class="flex justify-between gap-4"><span class="text-gray-400">X:</span><span class="font-mono">${convertedX.pc} pc</span></div>`;
      html += `<div class="flex justify-between gap-4"><span class="text-gray-400">Y:</span><span class="font-mono">${convertedY.pc} pc</span></div>`;
    }

    document.getElementById('tooltip-content').innerHTML = html;
    this.showTooltip(mouseX, mouseY);
  },

  showTooltip(x, y) {
    const offset = 15;
    const tooltip = this.tooltip;
    
    tooltip.classList.remove('hidden');
    
    const tooltipRect = tooltip.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    let posX = x + offset;
    let posY = y + offset;

    if (posX + tooltipRect.width > windowWidth) {
      posX = x - tooltipRect.width - offset;
    }

    if (posY + tooltipRect.height > windowHeight) {
      posY = y - tooltipRect.height - offset;
    }

    tooltip.style.left = `${posX}px`;
    tooltip.style.top = `${posY}px`;
  },

  hideTooltip() {
    this.tooltip.classList.add('hidden');
  }
};
