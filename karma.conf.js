// karma.conf.js
module.exports = function(config) {
    config.set({
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-coverage'),
        require('@angular-devkit/build-angular/plugins/karma')
      ],
      client: { clearContext: false },
      coverageReporter: {
        // carpeta donde sólo esta lcov.info
        dir: require('path').join(__dirname, 'coverage', 'bookroom-front'),
        reporters: [
          { type: 'lcovonly' }
        ],
        // evita la creación de subdirectorios
        subdir: '.'
      },
      reporters: ['progress', 'coverage'],
      browsers: ['ChromeHeadless'],
      singleRun: true,
      autoWatch: false,
      restartOnFileChange: false
    });
  };
  