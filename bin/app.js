#!/usr/bin/env node
"use strict";

// resources
var async = require('async');
var ProgressBar = require('progress');
var clc = require('cli-color');
var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var crypto = require('crypto');

// some feed back colors
var cliError = clc.redBright.bold.bgBlack;
var cliWarn = clc.redBright.bgBlack;
var cliNotice = clc.yellowBright.bgBlack;
var cliGood = clc.greenBright.bgBlack;
var cliNeutral = clc.blueBright.bgBlack;

// a convenient top-level object for holding persistent data
var main = {};

// give a warning if the file and regex aren't supplied
if ( !argv.r || !argv.f ) {
  console.log(cliError('\n\nProper syntax is') + cliGood(' node find.js -r ".*something here.*" -l "gi" -f ~/filepath.txt -s "string replacement text" -n ~/newFilePath.txt'));
  console.log('Order of the options does not matter, and -s and -n are optional.\n');
  
  if ( argv.r || argv.f || argv.l || argv.s ) {
    console.log('Options provided were:');
    console.log(argv);
    console.log('\n');
  }

  process.exit(0);
}

async.waterfall([function(callback) {
    console.log(cliNeutral('Reading file - this may take a while depending on file size...'));

    fs.exists(argv.f, function(exists) {

      if (exists) {
        callback();
      } else {
        console.log(cliError('\nThe file can\'t be found, check your filepath.\n'));

        process.exit(0);
      }
    });

}, function(callback) {

    fs.readFile(argv.f, 'utf8', function(err, data) {
      if (err) console.log(err);

      main.fileData = data;
      console.log(cliNeutral('File loaded into to memory, finding matches...'));
      callback();

    });

}, function(callback) {

    main.regex = new RegExp(argv.r, argv.l);

    // count the number of instances
    main.matches = main.fileData.match(main.regex);
    main.matchesLength = main.matches ? main.matches.length : 0;
    console.log(cliNotice('\n\nFound ' + main.matchesLength + ' matches for regex ' + main.regex + '\n\n'));

    if (argv.s) {

      if (argv.s == 'null') argv.s = '';

      var hash0 = md5Hash(main.fileData);
      var hash1;

      // do replacements and tick the progress bar
      main.newData = main.fileData.replace(main.regex, argv.s);

      hash1 = md5Hash(main.newData);

      console.log(cliNeutral('Were both input and output the same? ' + (hash0 == hash1)));

      if (hash0 != hash1) {
        if (argv.n) {
          console.log(cliNotice('Creating a new file from changes...'));
          var path = argv.n;
        } else {
          console.log(cliNotice('Writing changes to file...'));
          var path = argv.f;
        }

        fs.writeFile(path, main.newData, 'utf8', function(err) {
          if (err) console.log(err);
          console.log(cliGood('Done!'));
        });
      } else {
        console.log('No changes found, no files written...');
      }

    } else if (main.matchesLength) {

      for (var match in main.matches) {
        console.log(cliGood(main.matches[match]));
      }

      console.log(cliNotice('\nDone printing ' + main.matchesLength + ' matches!'));
    } else {
      console.log(cliGood('\nDone!'));
    }

    callback();

}], function() {
  console.log('\n');
});


function md5Hash(string) {
  
  if (typeof(string) == 'string') {

    var hash = crypto.createHash('md5').update(string).digest('hex');
  } else {
    console.log( cliWarn( 'Invalid hash feed: ' + string + 'was a(n) ' + typeof(string) ) );
    var hash = null;
  }

  return hash;
  
}