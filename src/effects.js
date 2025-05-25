const Effects = () => ({
  getDispersedMatrix: (size) => {
    if (size === 4) {
      return [
        [0, 8, 2, 10],
        [12, 4, 14, 6],
        [3, 11, 1, 9],
        [15, 7, 13, 5]
      ];
    } else if (size === 8) {
      return [
        [0, 32, 8, 40, 2, 34, 10, 42],
        [48, 16, 56, 24, 50, 18, 58, 26],
        [12, 44, 4, 36, 14, 46, 6, 38],
        [60, 28, 52, 20, 62, 30, 54, 22],
        [3, 35, 11, 43, 1, 33, 9, 41],
        [51, 19, 59, 27, 49, 17, 57, 25],
        [15, 47, 7, 39, 13, 45, 5, 37],
        [63, 31, 55, 23, 61, 29, 53, 21]
      ];
    }
  },

  // Clustered ordered dithering (good for newspaper-style halftones)
  getClusteredMatrix: (size) => {
    if (size === 4) {
      return [
        [12, 5, 6, 13],
        [4, 0, 1, 7],
        [11, 3, 2, 8],
        [15, 10, 9, 14]
      ];
    } else if (size === 6) {
      return [
        [24, 10, 12, 26, 35, 32],
        [8, 0, 2, 14, 23, 33],
        [22, 6, 4, 16, 25, 31],
        [30, 18, 20, 28, 19, 29],
        [34, 21, 17, 27, 9, 11],
        [36, 15, 13, 1, 3, 5]
      ];
    }
  },

  // Spiral pattern
  getSpiralMatrix: () => [
    [6, 12, 13, 7],
    [11, 0, 1, 14],
    [10, 3, 2, 15],
    [5, 9, 8, 4]
  ],

  // Diagonal pattern
  getDiagonalMatrix: () => [
    [0, 8, 4, 12],
    [2, 10, 6, 14],
    [1, 9, 5, 13],
    [3, 11, 7, 15],
  ],

  // Cross pattern
  getCrossMatrix: () => [
    [7, 1, 6, 14],
    [2, 8, 15, 9],
    [5, 13, 0, 10],
    [12, 4, 11, 3]
  ],

  // Halftone dot pattern
  getHalftoneMatrix: () => [
    [7, 13, 11, 4],
    [12, 16, 14, 8],
    [10, 15, 6, 2],
    [5, 9, 3, 1]
  ],
  generateBayerMatrix: (n) => {
    if (n === 2) {
      return [
        [0, 2],
        [3, 1]
      ];
    }

    const smaller = Effects().generateBayerMatrix(n / 2);
    const matrix = [];

    for (let i = 0; i < n; i++) {
      matrix[i] = [];
      for (let j = 0; j < n; j++) {
        const si = Math.floor(i / 2);
        const sj = Math.floor(j / 2);
        const quadrant = (i % 4) * 4 + (j % 4);

        matrix[i][j] = 4 * smaller[si][sj] + [0, 2, 3, 1][quadrant];
      }
    }

    return matrix;
  },
  normalizeBayerMatrix: (matrix) => {
    const size = matrix.length;
    const maxVal = size * size - 1;
    const normalized = [];

    for (let i = 0; i < size; i++) {
      normalized[i] = [];

      for (let j = 0; j < size; j++) {
        normalized[i][j] = Math.floor((matrix[i][j] / maxVal) * 256);
      }
    }

    return normalized;
  },
  hexToRgb: (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },
  getDitherMatrix: (pattern) => {
    switch (pattern) {
      case 'bayer2':
        return Effects().generateBayerMatrix(2);
      case 'bayer4':
        return Effects().generateBayerMatrix(4);
      case 'bayer8':
        return Effects().generateBayerMatrix(8);
      case 'dispersed4':
        return Effects().getDispersedMatrix(4);
      case 'dispersed8':
        return Effects().getDispersedMatrix(8);
      case 'clustered4':
        return Effects().getClusteredMatrix(4);
      case 'clustered6':
        return Effects().getClusteredMatrix(6);
      case 'spiral4':
        return Effects().getSpiralMatrix();
      case 'diagonal4':
        return Effects().getDiagonalMatrix();
      case 'cross4':
        return Effects().getCrossMatrix();
      case 'halftone':
        return Effects().getHalftoneMatrix();
      default:
        return Effects().generateBayerMatrix(4);
    }
  }
});

export default Effects;
