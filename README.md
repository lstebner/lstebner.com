# lstebner.com

source code for lstebner.com 2019™

## directory explanation

- README: this file
- build/: this directory is generated by the build command
    \- *.html|css|js: files for webserver
- build.js: the main build file
- node_modules/: these contain the modules managed by yarn
- package.json: scripts and package info
- src/: the files used by the build script to generate build/*
    \- *.pug: view templates
- webpack.config.js: our config file for webpack
- yarn.lock: standard lock file for yarn

## for development

1. check out branch
2. `yarn`
3. `yarn build`
4. open `src/index.html` in a browser

## for deployment

1. `yarn build_prod`
2. upload `build` directory to webserver


