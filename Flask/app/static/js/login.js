
End = function() {
    SetStorage(d3.select('#remember').property('checked'));
    window.location.href = '/home';
}