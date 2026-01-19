const UnitConverter = {
  DPI: 72,
  POINTS_PER_INCH: 72,
  CM_PER_INCH: 2.54,
  MM_PER_INCH: 25.4,
  PICAS_PER_INCH: 6,

  pixelsToPoints(pixels, scale) {
    return pixels * (this.DPI / this.DPI) / scale;
  },

  pixelsToInches(pixels, scale) {
    return (pixels / scale) / this.DPI;
  },

  pixelsToCentimeters(pixels, scale) {
    return this.pixelsToInches(pixels, scale) * this.CM_PER_INCH;
  },

  pixelsToMillimeters(pixels, scale) {
    return this.pixelsToInches(pixels, scale) * this.MM_PER_INCH;
  },

  pixelsToPicas(pixels, scale) {
    return this.pixelsToInches(pixels, scale) * this.PICAS_PER_INCH;
  },

  convertAll(pixels, scale) {
    const result = {
      px: pixels,
      pt: this.pixelsToPoints(pixels, scale),
      in: this.pixelsToInches(pixels, scale),
      cm: this.pixelsToCentimeters(pixels, scale),
      mm: this.pixelsToMillimeters(pixels, scale),
      pc: this.pixelsToPicas(pixels, scale)
    };

    return {
      px: result.px.toFixed(1),
      pt: result.pt.toFixed(2),
      in: result.in.toFixed(2),
      cm: result.cm.toFixed(2),
      mm: result.mm.toFixed(2),
      pc: result.pc.toFixed(2)
    };
  }
};
