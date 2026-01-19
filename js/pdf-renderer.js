const PDFRenderer = {
  pdfDoc: null,
  currentPage: 1,
  currentScale: 1,
  pageViewport: null,
  devicePixelRatio: window.devicePixelRatio || 1,

  canvas: null,
  ctx: null,

  init() {
    this.canvas = document.getElementById('pdf-canvas');
    this.ctx = this.canvas.getContext('2d');
  },

  async loadPDF(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      this.pdfDoc = await pdfjsLib.getDocument(arrayBuffer).promise;
      this.currentPage = 1;
      return this.pdfDoc.numPages;
    } catch (error) {
      console.error('Error loading PDF:', error);
      throw new Error('Failed to load PDF file. Please ensure the file is valid.');
    }
  },

  async renderPage(pageNum, scale) {
    if (!this.pdfDoc) return;

    try {
      const page = await this.pdfDoc.getPage(pageNum);
      this.pageViewport = page.getViewport({ scale: scale * this.devicePixelRatio });

      const width = this.pageViewport.width / this.devicePixelRatio;
      const height = this.pageViewport.height / this.devicePixelRatio;

      this.canvas.width = this.pageViewport.width;
      this.canvas.height = this.pageViewport.height;
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;

      const renderContext = {
        canvasContext: this.ctx,
        viewport: this.pageViewport
      };

      await page.render(renderContext).promise;

      return {
        width: this.pageViewport.width / this.devicePixelRatio,
        height: this.pageViewport.height / this.devicePixelRatio,
        rotation: page.rotate
      };
    } catch (error) {
      console.error('Error rendering page:', error);
      throw error;
    }
  },

  setScale(scale) {
    this.currentScale = scale;
  },

  getScale() {
    return this.currentScale;
  },

  getPageCount() {
    return this.pdfDoc ? this.pdfDoc.numPages : 0;
  },

  getCurrentPage() {
    return this.currentPage;
  },

  setCurrentPage(pageNum) {
    if (pageNum >= 1 && pageNum <= this.getPageCount()) {
      this.currentPage = pageNum;
    }
  },

  getPageDimensions() {
    if (!this.pageViewport) return { width: 0, height: 0 };
    return {
      width: this.pageViewport.width / this.devicePixelRatio,
      height: this.pageViewport.height / this.devicePixelRatio
    };
  },

  getPageRotation() {
    if (!this.pdfDoc) return 0;
    return this.pageViewport ? this.pageViewport.rotation : 0;
  },

  reset() {
    this.pdfDoc = null;
    this.currentPage = 1;
    this.currentScale = 1;
    this.pageViewport = null;
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
};
