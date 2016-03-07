// jshint varstmt: false

var gulp = require('gulp');
var exec = require('child_process').exec;
var prompt = require('gulp-prompt');

// Gulp task to generate development documentation;
gulp.task('doc', function(done) {

  console.log('Generating documentation...');
  exec('node_modules/.bin/jsdoc -d api src/*', function(err) {
    if (err) return done(err);
    console.log('Documentation generated in "docs" directory');
    done();
  });

});

// Task and dependencies to distribute for all environments;
var babel = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var replace = require('gulp-replace');
var insert = require('gulp-insert');
var uglify = require('gulp-uglify');
var bump = require('gulp-bump');
var argv = require('yargs').argv;

var gulpif = require('gulp-if');
var path = require('path');

var pkg = require('./package.json');

<<<<<<< HEAD
gulp.task('license', function() {

  var clean = argv.clean;
  if (!clean) clean = false;

  return gulp.src(['src/**/*.js'])
  .pipe(prependLicense(clean));

});

function prependLicense(clean) {

  var license = `/**
* Copyright 2016 PT Inovação e Sistemas SA
* Copyright 2016 INESC-ID
* Copyright 2016 QUOBIS NETWORKS SL
* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
* Copyright 2016 ORANGE SA
* Copyright 2016 Deutsche Telekom AG
* Copyright 2016 Apizee
* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/

`;
=======
var license = '/**\n' +
'* Copyright 2016 PT Inovação e Sistemas SA\n' +
'* Copyright 2016 INESC-ID\n' +
'* Copyright 2016 QUOBIS NETWORKS SL\n' +
'* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V\n' +
'* Copyright 2016 ORANGE SA\n' +
'* Copyright 2016 Deutsche Telekom AG\n' +
'* Copyright 2016 Apizee\n' +
'* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN\n' +
'*\n' +
'* Licensed under the Apache License, Version 2.0 (the "License");\n' +
'* you may not use this file except in compliance with the License.\n' +
'* You may obtain a copy of the License at\n' +
'*\n' +
'*   http://www.apache.org/licenses/LICENSE-2.0\n' +
'*\n' +
'* Unless required by applicable law or agreed to in writing, software\n' +
'* distributed under the License is distributed on an "AS IS" BASIS,\n' +
'* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n' +
'* See the License for the specific language governing permissions and\n' +
'* limitations under the License.\n' +
'**/\n\n';
>>>>>>> remotes/origin/develop

gulp.task('license', function() {

  var clean = argv.clean;
  if (!clean) clean = false;

  return gulp.src(['src/**/*.js'])
  .pipe(prependLicense(clean));

});

function prependLicense(clean) {

  return through.obj(function(file, enc, cb) {

    if (file.isNull()) {
      return cb(new Error('Fil is null'));
    }

    if (file.isStream()) {
      return cb(new Error('Streaming not supported'));
    }

    var dest = path.dirname(file.path);

    return gulp.src(file.path)
    .pipe(replace(license, ''))
    .pipe(gulpif(!clean, insert.prepend(license)))
    .pipe(gulp.dest(dest))
    .on('end', function() {
      cb();
    });

  });

}

function dist(debug) {

  if (!debug) debug = false;

  return through.obj(function(file, enc, cb) {

    if (file.isNull()) {
      return cb(new Error('Fil is null'));
    }

    if (file.isStream()) {
      return cb(new Error('Streaming not supported'));
    }

    var filename = path.basename(file.path, '.js');

    console.log('Make a distribution file from', filename + '.js');

    return browserify({
      entries: [file.path],
      standalone: filename,
      debug: debug
    }).transform(babel, {compact: debug, optional: 'runtime'})
    .bundle()
    .on('error', function(err) {
      console.error(err);
      this.emit('end');
    })
    .pipe(source(filename + '.js'))
    .pipe(buffer())
    .pipe(gulpif(!debug, uglify()))
    .pipe(gulpif(!debug, insert.prepend(license + '// Distribution file for {{package}} \n// version: {{version}}\n\n')))
    .pipe(gulpif(!debug, replace('{{version}}', pkg.version)))
    .pipe(gulpif(!debug, replace('{{package}}', filename + '.js')))
    .pipe(gulp.dest(__dirname + '/dist'))
    .on('end', function() {
      console.log('Distribution done;\n');
      cb();
    });
  });

}

gulp.task('dist', function() {

  return gulp.src(['src/*.js'])
  .pipe(dist());

});

gulp.task('build', function() {

  return gulp.src(['src/*.js'])
  .pipe(dist(true));

});

/**
* Compile on specific file from ES6 to ES5
* @param  {string} 'compile' task name
*
* How to use: gulp compile --file 'path/to/file';
*/
function compile(file, destination, cb) {

  if (!file) {
    cb(new Error('No such file or directory'));
  }

  var fileObject = path.parse(file);

  console.log('Converting ' + fileObject.base + ' on ' + fileObject.dir + ' to ES5');

  return browserify({
    entries: [file],
    standalone: 'activate',
    debug: false
  }).transform(babel, {compact: false, optional: 'runtime'})
  .bundle()
  .on('error', function(err) {
    console.error(err);
  })
  .pipe(source(fileObject.base))
  .pipe(gulp.dest(destination))
  .pipe(buffer())
  .pipe(encode(fileObject.name, 'Hyperties'))
  .pipe(source('Hyperties.json'))
  .pipe(gulp.dest('resources/descriptors/'))
  .on('end', function() {
    console.log('File converted');
  });

}

gulp.task('watch-hyperty', function(cb) {

  var destination = argv.dest;

<<<<<<< HEAD
  gulp.watch(['src/hyperty-connector/*.js', 'src/hello-world/*.js', 'src/hyperty-chat/*.js', 'example/hyperties/**/*.js'], function(event) {
    var pathSplit = event.path.split(path.sep);
=======
  gulp.watch(['src/hyperty-connector/*.js', 'src/hyperty-chat/*.js'], function(event) {

    var pathSplit = event.path.split(path.sep); // on windows is backslash;
>>>>>>> remotes/origin/develop
    var dir = pathSplit[pathSplit.length - 2];
    var file = pathSplit[pathSplit.length - 1];

    console.log(file);

    switch (dir) {
      case 'hyperty-chat':
        return compile(__dirname + '/src/' + dir + '/HypertyChat.js', destination, cb);


      case 'hyperty-connector':
<<<<<<< HEAD
        return compile('src/' + dir + '/HypertyConnector.js', destination, cb);

      default:
        compile('example/hyperties/' + dir + '/' + file, destination, cb);
=======
        return compile(__dirname + '/src/' + dir + '/HypertyConnector.js', destination, cb);
>>>>>>> remotes/origin/develop
    }

  });

});

gulp.task('watch', function(cb) {
  gulp.watch(['src/**/*.js'], ['dist'], cb);
});

var through = require('through2');
var Base64 = require('js-base64').Base64;
var fs = require('fs');

function encode(filename, descriptorName, configuration, isDefault) {

  var descriptor = fs.readFileSync('resources/descriptors/' + descriptorName + '.json', 'utf8');
  var json = JSON.parse(descriptor);

  return through.obj(function(file, enc, cb) {

    if (file.isNull()) {
      return cb(null, file);
    }

    if (file.isStream()) {
      return cb(new Error('Streaming not supported'));
    }

    var encoded = Base64.encode(file.contents);
    var value = 'default';

    if (isDefault) {
      value = 'default';
    } else {
      value = filename;
    }

    if (!json.hasOwnProperty(value)) {
      var newObject = {};
      json[value] = newObject;
      json[value].sourcePackage = {};
    }

    var language = 'javascript';
    if (descriptorName === 'DataSchemas') {
      language = 'JSON-Schema';
    }

    json[value].cguid = Math.floor(Math.random() + 1);
    json[value].type = descriptorName;
    json[value].version = '0.1';
    json[value].description = 'Description of ' + filename;
    json[value].objectName = filename;
    json[value].configuration = configuration;
    json[value].sourcePackageURL = '/sourcePackage';
    json[value].sourcePackage.sourceCode = encoded;
    json[value].sourcePackage.sourceCodeClassname = filename;
    json[value].sourcePackage.encoding = 'base64';
    json[value].sourcePackage.signature = '';
    json[value].language = language;
    json[value].signature = '';
    json[value].messageSchemas = '';
    json[value].dataObjects = [];
    json[value].accessControlPolicy = 'somePolicy';

    var newDescriptor = new Buffer(JSON.stringify(json, null, 2));
    console.log(value);
    cb(null, newDescriptor);

  });

}

function resource(file, configuration, isDefault) {

  var fileObject = path.parse(file);
  var filename = fileObject.name;
  var extension = fileObject.ext;
  var descriptorName;
  if (filename.indexOf('Hyperty') !== -1) {
    descriptorName = 'Hyperties';
  } else if (filename.indexOf('ProtoStub') !== -1) {
    descriptorName = 'ProtoStubs';
  } else if (filename.indexOf('DataSchema')) {
    descriptorName = 'DataSchemas';
  }

<<<<<<< HEAD
  console.log('DATA:', descriptorName);

  if (extension === 'js') {
    return browserify({
      entries: ['resources/' + filename + '.js'],
      standalone: 'activate',
      debug: false
    })
    .transform(babel)
    .bundle()
    .pipe(source('bundle.js'))
=======
  console.log('DATA:', descriptorName, filename, extension);

  if (extension === '.js') {
    return gulp.src(['resources/' + filename + '.js'])
>>>>>>> remotes/origin/develop
    .pipe(gulp.dest('resources/'))
    .pipe(buffer())
    .pipe(encode(filename, descriptorName, configuration, isDefault))
    .pipe(source(descriptorName + '.json'))
    .pipe(gulp.dest('resources/descriptors/'));
  } else if (extension === '.json') {

    return gulp.src(['resources/' + filename + '.json'])
    .pipe(gulp.dest('resources/'))
    .pipe(buffer())
    .pipe(encode(filename, descriptorName, configuration, isDefault))
    .pipe(source(descriptorName + '.json'))
    .pipe(gulp.dest('resources/descriptors/'));

  }

}

gulp.task('encode', function(done) {

  var files = [];
  var dirFiles = fs.readdirSync('resources');
  files = dirFiles.filter(isFile);
  files = files.map(function(file) {
    return 'resources/' + file;
  });

  function isFile(file) {
    if (file.indexOf('Hyperty') !== -1 || file.indexOf('ProtoStub') !== -1 || file.indexOf('DataSchema') !== -1){
      return fs.statSync('resources/' + file).isFile();
    }
  }

  gulp.src('./', {buffer:false})
    .pipe(prompt.prompt([{
      type: 'list',
      name: 'file',
      message: 'File to be converted:',
      choices: files
    },
    {
      type: 'input',
      name: 'configuration',
      message: 'ProtoStub Configuration, use something like:\n{"url": "wss://msg-node.localhost:9090/ws"}\nConfiguration:',
      validate: function(value) {
        try {
          JSON.parse(value);
          return true;
        } catch (e) {
          console.error('Check your configuration JSON\nShould be something like:\n{"url": "wss://msg-node.localhost:9090/ws"}');
          return false;
        }
      }
    },
    {
      type: 'list',
      name: 'defaultFile',
      message: 'This will be a default file to be loaded?',
      choices: ['yes', 'no']
    }], function(res) {

      fs.access(res.file, fs.R_OK | fs.W_OK, function(err) {
        if (err) done(new Error('No such file or directory'));
        return;
      });

      var configuration = JSON.parse(res.configuration);

      var isDefault = true;
      if (res.defaultFile === 'no' || res.defaultFile === 'n') {
        isDefault = false;
      }

      if (res.file) {
        resource(res.file, configuration, isDefault);
      }
    })
  );

});

/**
* Bumping version number and tagging the repository with it.
* Please read http://semver.org/
*
* You can use the commands
*
*     gulp patch     # makes v0.1.0 → v0.1.1
*     gulp feature   # makes v0.1.1 → v0.2.0
*     gulp release   # makes v0.2.1 → v1.0.0
*
* To bump the version numbers accordingly after you did a patch,
* introduced a feature or made a backwards-incompatible release.
*/
function inc(importance) {
  // get all the files to bump version in
  return gulp.src(['./package.json'])

  // bump the version number in those files
  .pipe(bump({type: importance}))

  // save it back to filesystem
  .pipe(gulp.dest('./'));
}

gulp.task('patch', ['test'], function() { return inc('patch'); });

gulp.task('feature', ['test'], function() {  return inc('minor'); });

gulp.task('release', ['test'], function() {  return inc('major'); });

var Server = require('karma').Server;

/**
* Run test once and exit
*/
gulp.task('test', function(done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});
