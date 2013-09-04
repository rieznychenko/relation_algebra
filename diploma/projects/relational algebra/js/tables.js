function removeRow(dataSet, rowId) {
    $("#" + dataSet + " tbody").find("#" + rowId).remove();
}

function setHeader(dataSet, columns) {
    var cells = [];

    $(columns).each(function(index, value) {
        cells.push($("<th>").append(value));
    });

    var head = $("#" + dataSet + " thead");
    $(head).empty();
    $(head).append($("<tr>").append(cells));
}

function addRow(dataSet) {
    var cells = [];
    $("#" + dataSet + " tbody tr").last().find("input:text").each(function() {
        var value = $(this).val();
        $(this).val("");
        var input = $("<input>");
        $(input).attr("id", $(this).attr("id"));
        $(input).attr("type", "text");
        $(input).val(value);
        cells.push($("<td>").append(input));
    });

    var removeButton = $("<button>");
    $(removeButton).addClass("btn btn-warning");
    $(removeButton).html("<i class='icon-minus'></i>");
    $(removeButton).click(function() {
        removeRow(dataSet, rowId);
    });
    cells.push($("<td>").append(removeButton));

    var rowId = nextRowId();
    var row = $("<tr>");
    row.attr("id", rowId);

    $("#" + dataSet + " tbody tr").eq(-1).before(
        $(row).append(cells)
    );
}

var lastRowId = 100;
function nextRowId() {
    ++lastRowId;
    return lastRowId;
}
