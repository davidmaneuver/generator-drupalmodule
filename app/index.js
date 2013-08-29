'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var DrupalmoduleGenerator = module.exports = function DrupalmoduleGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
  this.moduleName = path.basename(process.cwd());

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  //this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(DrupalmoduleGenerator, yeoman.generators.Base);

DrupalmoduleGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  var prompts = [{
    name: 'moduleDesc',
    message: 'Describe your module:'
  },{
    name: 'modulePackage',
    message: 'Provide a module package:',
    default: 'Custom'
  },{
    name: 'moduleDepend',
    message: 'What are your module\'s dependenies? (space seperated)'
  },{
    name: 'addCss',
    message: 'Add stylesheet?',
    default: 'Y/n'
  },{
    name: 'addJs',
    message: 'Add javascript file?',
    default: 'Y/n'
  }];

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    this.moduleDesc = props.moduleDesc;
    this.modulePackage = props.modulePackage;
    this.dependencies = props.moduleDepend.length !== 0 ? 'dependencies[] = ' + props.moduleDepend.split(' ').join('\r\ndependencies[] = ') : '';
    this.stylesheets = (/y/i).test(props.addCss) ? 'stylesheets[all][] = ' + this.moduleName + '.css' : '';
    this.javascripts = (/y/i).test(props.addJs)? 'scripts[] = ' + this.moduleName + '.js' : '';

    cb();
  }.bind(this));
};

DrupalmoduleGenerator.prototype.app = function app() {
  var mn = this.moduleName;
  // this.mkdir(mn);

  this.template('_package.json', 'package.json');
  // this.copy('_bower.json', 'bower.json');

  this.template('_template.info', mn + '.info');
  this.template('_template.module', mn + '.module');

  if (this.stylesheets) {
    this.copy('template.css', mn + '.css');
  }
  if (this.javascripts) {
    this.copy('template.js', mn + '.js');
  }
};
