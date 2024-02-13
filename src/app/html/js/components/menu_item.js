
function MenuItem (mi) {
    var self = this;

    self.params = mi.params;
    self.title = mi.title;
    self.link = mi.link;

    self.goTo = function () {
        App.pages.goTo(self.link, self.params);
    }
}