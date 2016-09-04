# Honeybee-Hive
[![CircleCI][circleci-image]][circleci-link]
[![NPM Version][version-image]][npm-link]
[![NPM Download][download-image]][npm-link]

A node module to allow for volunteer computing, like BOINC.

## Install
```bash
npm install honeybee-hive --save
```

## Notes
* Alpha stages, expect breaking changes between versions currently

## Usage
### Installing required node modules
You should first install all the required node modules by doing this:
```bash
npm install
```

You should also install browserify like this:
```bash
sudo npm install -g browserify
```

### Directory structure
As you can see, there is a `build` directory in this git project. This is the directory that you will use most of the time.

### Creating the worker file
Inside of that you should be able to see a file called `main.js`. This shows an example of how to write a worker file, but it's generally the same example as the main Honeybee-Hive example.

You should modify this to your needs following the Honeybee-Hive documentation.

### Building the bundle
Once finished, navigate to the root directory, and then run this command:
```bash
npm run build
```

This will create two files in the `build/out` directory. One is called `forge.bundle.js` and the other `main.js`.

### Assembling the website
You should then create your website. Move the two javascript files to your website's script directory.

You should include the script in your website like this:
```html
<html>
<head>
  ...
</head>
<body>
  ...
  <script src="path/to/forge.bundle.js"></script>
  <script src="path/to/main.js"></script>
</body>
</html>
```

## License
[ISC][license-link]

[license-link]: https://github.com/Kurimizumi/Honeybee-Hive/blob/master/LICENSE.md
[circleci-image]: https://circleci.com/gh/Kurimizumi/Honeybee-Hive.svg?&style=shield
[circleci-link]: https://circleci.com/gh/Kurimizumi/Honeybee-Hive
[npm-link]: https://npmjs.org/package/honeybee-hive
[version-image]: https://img.shields.io/npm/v/honeybee-hive.svg
[download-image]: https://img.shields.io/npm/dm/honeybee-hive.svg
