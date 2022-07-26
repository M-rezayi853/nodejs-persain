const multer = require('multer')
const mkdir = require('mkdirp')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    mkdir('./public/uploads/images').then((made) => {
      cb(null, './public/uploads/images')
    })
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  },
})

const upload = multer({ storage: storage })

module.exports = upload
