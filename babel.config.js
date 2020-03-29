/** @prettier */

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: [
            'last 1 chrome versions',
            'last 1 firefox versions',
            'last 1 safari versions',
          ],
        },
      },
    ],
    'solid',
  ],
  plugins: [
    [
      'emotion',
      {
        autoLabel: true,
      },
    ],
    'macros', // Using 'babel-plugin-macros' for Emotion + Tailwind.
  ],
};
