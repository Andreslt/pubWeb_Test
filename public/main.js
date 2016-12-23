$(document).ready(function () {

    $('#elbutton').on('click', function () {
        cleanTable();
        if ($('textarea').val() !== "") {
            var lines = $('textarea').val().split('\n');
            for (var i = 0; i < lines.length; i++) {
                var url = lines[i];
                if (validURL(url)) {
                    $.ajax({
                        type: 'POST',
                        url: '/scrapping?url=' + url,
                        success: function (elem) {
                            addRows(elem);
                        }
                    })
                } else {
                    alert('la dirección: ' + url + " no es válida. Por favor inténtelo nuevamente. Toda dirección deber comenzar por: 'http(s)://www...'")
                }
            }
        } else {
            alert('Ingrese al menos una URL a consultar.')
        }
    });
    function addRows(elem) {
        var row = '<tr>';
        for (var i = 0; i < elem.length; i++) {
            var link = '<a href=' + elem[i] + ' target="_blank">';
            if (elem[i] === "N/A") link = "";
            row += '<td class="tableRow">' + link + elem[i] + '</td>'
        }
        row += '</tr>';
        $('tbody').append(row)
    }

    function cleanTable() {
        $('.tableRow').remove()
    }

    function removeClass() {
        $('td').each(function () {
            if (e.textContent() === "N/A")
                e.removeClass()
        })
    }

    function validURL(url) {
        if ( url.indexOf('http://www.') != -1 || url.indexOf('.com') != -1 || url.indexOf('.co') != -1 || url.indexOf('.net') != -1 || url.indexOf('.org') != -1)
            return true
        else
            return false
    }
});