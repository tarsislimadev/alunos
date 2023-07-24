function MenuItem (type) {
  const self = this

  self.type = type
  self.params = []
  self.title = ''
  self.link = ''

  self.addParam = function (key, value) {
    const obj = {}
    obj[key] = value
    self.params.push(obj)
    return self
  }

  self.addParams = function (list = []) {
    list.map(self.addParam)
    return self
  }

  self.setTitle = function (title) {
    self.title = title
    return self
  }

  self.setLink = function (link) {
    self.link = link
    return self
  }
};

exports.default = MenuItem
exports.new = function (type) { return new MenuItem(type) }
