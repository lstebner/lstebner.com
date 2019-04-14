const pug = require("pug")
const fs = require("fs")
const sass = require("node-sass")

const path = require("path")

const SRC_DIR = path.resolve(__dirname, "src")
const SRC_ASSETS_PATH = path.resolve(SRC_DIR, "assets")
const BUILD_DIR = path.resolve(__dirname, "build")
const BUILD_ASSETS_PATH = path.resolve(BUILD_DIR, "images")
const TEMPLATE_EXT = ".pug"
const VALID_ASSET_EXTENSIONS = [/\.png$/, /\.jpg$/, /\.svg$/, /\.jpeg$/]

const QUIET = false

function log(...args) {
  if (QUIET) return
  console.log(...args)
}

const filename = function(name, abs_path = false) {
  let _name = `${name}${TEMPLATE_EXT}`

  if (abs_path) {
    _name = path.resolve(SRC_DIR, name)
  }

  return _name
}

const INDEX_FILE = filename("src/index")

const views_to_render = [["index", INDEX_FILE]]

function render_view(src_path, dest_path) {
  const rendered_file = pug.renderFile(src_path)
  log("render view: ", src_path, " -> ", dest_path)
  fs.writeFileSync(dest_path, rendered_file)
}

function render_sass(src_path, dest_path) {
  if (!fs.existsSync(src_path)) {
    return
  }

  sass.render(
    {
      file: src_path
    },
    (err, result) => {
      if (err) {
        return console.error(`SASS error! ${src_path} -- ${err}`)
      }

      log("rendered sass file ", src_path, " -> ", dest_path)
      fs.writeFileSync(dest_path, result.css)
    }
  )
}

function ensure_build_dir_exists() {
  if (!fs.existsSync(BUILD_DIR)) {
    fs.mkdirSync(BUILD_DIR)
  }
}

function is_valid_asset(asset_path) {
  for (const i in VALID_ASSET_EXTENSIONS) {
    const ext = VALID_ASSET_EXTENSIONS[i]
    if (asset_path.match(ext)) {
      return true
    }
  }

  return false
}

function copy_assets() {
  log("copying assets over...")

  if (!fs.existsSync(BUILD_ASSETS_PATH)) {
    fs.mkdirSync(BUILD_ASSETS_PATH)
  }

  const asset_files = fs.readdirSync(SRC_ASSETS_PATH)

  for (const i in asset_files) {
    const asset_file = asset_files[i]
    const full_asset_path = path.resolve(__dirname, "src/assets", asset_file)
    const asset_dest = full_asset_path.replace(/src\/assets/, "build/images")

    if (is_valid_asset(asset_file)) {
      fs.copyFileSync(full_asset_path, asset_dest)
      log(`copied src/assets/${asset_file} -> build/images/${asset_file}`)
    }
  }
}

function render_all_views() {
  ensure_build_dir_exists()

  let src_file, dest_file

  for (const i in views_to_render) {
    src_file = views_to_render[i][1]
    src_sass_file = src_file.replace(/\.pug/, ".scss")
    dest_file = src_file.replace(/^src/, "build").replace(/\.pug/, ".html")
    dest_sass_file = dest_file.replace(".html", ".css")

    render_view(src_file, dest_file)
    render_sass(src_sass_file, dest_sass_file)
  }

  copy_assets()
}

// finally, the "go" point
render_all_views()
