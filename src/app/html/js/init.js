
window.addEventListener('DOMContentLoaded', function () {
    ko.options.useOnlyNativeEvents = true;

    vm = new ViewModel();
    ko.applyBindings(vm);
    vm.init();
});
