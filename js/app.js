const App = {
  MAX_FILE_SIZE: 10 * 1024 * 1024,

  init() {
    PDFRenderer.init();
    CoordinateTracker.init();
    this.setupUploadHandlers();
    this.setupControlHandlers();
    this.setupKeyboardNavigation();
  },

  setupUploadHandlers() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const errorMessage = document.getElementById('error-message');

    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.handleFileUpload(files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.handleFileUpload(e.target.files[0]);
      }
    });
  },

  handleFileUpload(file) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.classList.add('hidden');
    errorMessage.textContent = '';

    if (file.type !== 'application/pdf') {
      errorMessage.textContent = 'Please upload a valid PDF file.';
      errorMessage.classList.remove('hidden');
      return;
    }

    if (file.size > this.MAX_FILE_SIZE) {
      errorMessage.textContent = 'File size exceeds 10 MB limit.';
      errorMessage.classList.remove('hidden');
      return;
    }

    this.loadPDF(file);
  },

  async loadPDF(file) {
    try {
      const pageCount = await PDFRenderer.loadPDF(file);
      this.showViewer();
      document.getElementById('page-count').textContent = pageCount;
      document.getElementById('page-input').value = 1;
      document.getElementById('page-input').max = pageCount;
      await this.renderCurrentPage();
    } catch (error) {
      document.getElementById('error-message').textContent = error.message;
      document.getElementById('error-message').classList.remove('hidden');
    }
  },

  async renderCurrentPage() {
    const pageNum = PDFRenderer.getCurrentPage();
    const scale = PDFRenderer.getScale();
    const pageInfo = await PDFRenderer.renderPage(pageNum, scale);
    
    this.updatePageInfo(pageInfo);
    this.updateZoomDisplay();
  },

  updatePageInfo(pageInfo) {
    document.getElementById('page-size').textContent = `${Math.round(pageInfo.width)} × ${Math.round(pageInfo.height)} px`;
    document.getElementById('page-rotation').textContent = `${pageInfo.rotation}°`;
  },

  updateZoomDisplay() {
    const zoom = Math.round(PDFRenderer.getScale() * 100);
    document.getElementById('zoom-level').textContent = `${zoom}%`;
  },

  setupControlHandlers() {
    document.getElementById('prev-page').addEventListener('click', () => this.changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => this.changePage(1));
    
    document.getElementById('page-input').addEventListener('change', (e) => {
      const pageNum = parseInt(e.target.value);
      if (pageNum >= 1 && pageNum <= PDFRenderer.getPageCount()) {
        PDFRenderer.setCurrentPage(pageNum);
        this.renderCurrentPage();
      } else {
        e.target.value = PDFRenderer.getCurrentPage();
      }
    });

    document.getElementById('zoom-in').addEventListener('click', () => this.changeZoom(0.25));
    document.getElementById('zoom-out').addEventListener('click', () => this.changeZoom(-0.25));
    document.getElementById('zoom-100').addEventListener('click', () => this.setZoom(1));
    document.getElementById('zoom-fit').addEventListener('click', () => this.fitToWidth());
    document.getElementById('reset-view').addEventListener('click', () => this.resetView());
  },

  async changePage(delta) {
    const newPage = PDFRenderer.getCurrentPage() + delta;
    if (newPage >= 1 && newPage <= PDFRenderer.getPageCount()) {
      PDFRenderer.setCurrentPage(newPage);
      document.getElementById('page-input').value = newPage;
      await this.renderCurrentPage();
    }
  },

  async changeZoom(delta) {
    const newScale = Math.max(0.25, Math.min(4, PDFRenderer.getScale() + delta));
    PDFRenderer.setScale(newScale);
    await this.renderCurrentPage();
  },

  async setZoom(scale) {
    PDFRenderer.setScale(scale);
    await this.renderCurrentPage();
  },

  async fitToWidth() {
    const container = document.getElementById('pdf-container');
    const containerWidth = container.clientWidth - 40;
    const pageWidth = PDFRenderer.getPageDimensions().width;
    const scale = Math.max(0.25, Math.min(4, containerWidth / pageWidth));
    PDFRenderer.setScale(scale);
    await this.renderCurrentPage();
  },

  async resetView() {
    PDFRenderer.setCurrentPage(1);
    PDFRenderer.setScale(1);
    document.getElementById('page-input').value = 1;
    await this.renderCurrentPage();
  },

  showViewer() {
    document.getElementById('upload-section').classList.add('hidden');
    document.getElementById('viewer-section').classList.remove('hidden');
  },

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (document.getElementById('viewer-section').classList.contains('hidden')) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.changePage(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.changePage(1);
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        this.changeZoom(0.25);
      } else if (e.key === '-') {
        e.preventDefault();
        this.changeZoom(-0.25);
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
