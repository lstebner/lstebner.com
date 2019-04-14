const pug = require("pug")
const fs = require("fs")
const sass = require("node-sass")

const path = require("path")

const SRC_DIR = path.resolve(__dirname, "src")
const BUILD_DIR = path.resolve(__dirname, "build")
const TEMPLATE_EXT = ".pug"

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
}

// finally, the "go" point
render_all_views()