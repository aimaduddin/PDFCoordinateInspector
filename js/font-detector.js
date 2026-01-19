const FontDetector = {
  textContent: null,
  textItems: [],

  init() {
    this.textItems = [];
  },

  async loadPageText(page) {
    try {
      const content = await page.getTextContent();
      this.textContent = content;
      this.textItems = content.items || [];
      return this.textItems;
    } catch (error) {
      console.error('Error loading page text:', error);
      return [];
    }
  },

  getFontSize(x, y, scale) {
    for (const item of this.textItems) {
      if (!item.transform) continue;

      const transform = item.transform;
      
      const tx = transform[4];
      const ty = transform[5];
      
      const fontSize = Math.abs(transform[0]);
      
      const textWidth = item.width * fontSize;
      const textHeight = fontSize;
      
      const distance = Math.sqrt(
        Math.pow(x - tx, 2) + Math.pow(y - ty, 2)
      );

      const threshold = Math.max(textWidth, textHeight) * 0.5;

      if (distance <= threshold) {
        return {
          fontSize: fontSize,
          fontName: item.fontName || 'Unknown',
          fontFamily: item.fontName ? this.getFontFamily(item.fontName) : 'Unknown'
        };
      }
    }

    return null;
  },

  getFontFamily(fontName) {
    if (!fontName) return 'Unknown';
    
    const cleanName = fontName.replace(/[+-]\w+$/, '');
    return cleanName;
  },

  getAllFonts() {
    const fonts = new Set();
    
    for (const item of this.textItems) {
      if (item.fontName) {
        fonts.add(this.getFontFamily(item.fontName));
      }
    }

    return Array.from(fonts).sort();
  },

  reset() {
    this.textContent = null;
    this.textItems = [];
  }
};
