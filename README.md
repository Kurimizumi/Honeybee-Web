# Honeybee-Hive

A node module to allow for volunteer computing in the browser, like BOINC.

## Install
See [usage](https://github.com/Kurimizumi/Honeybee-Web#usage)

## Notes
* Alpha stages, expect breaking changes between versions currently

## Usage
### Installing required prerequisites
Firstly, you should clone the project like this, and navigate into it
```bash
git clone https://github.com/Kurimizumi/Honeybee-Web.git
cd Honeybee-Web
```

You should then install all the required node modules by doing this:
```bash
npm install
```

### Creating the worker file
As you can see, there is a `build` directory in this git project. This is the directory that you will use most of the time.

Inside of that you should be able to see a file called `main.js`. This shows an example of how to write a worker file, but it's generally the same example as the main Honeybee-Hive example.

You should modify this to your needs following the [Honeybee-Hive documentation](https://github.com/Kurimizumi/Honeybee-Hive/tree/master#client-1).

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
