function union(a, b, ab) {
    applySetOperator(a, b, ab, function (itemsA, itemsB) {
        var itemsAB = [];
        $(itemsA).each(function(index, item) {
            if (!contains(itemsAB, item)) {
                console.log("Added " + item["id"] + ".");
                itemsAB.push(item);
            }
        });
        $(itemsB).each(function(index, item) {
            if (!contains(itemsAB, item)) {
                console.log("Added " + item["id"] + ".");
                itemsAB.push(item);
            }
        });
        return itemsAB;
    });
}

function intersect(a, b, ab) {
    applySetOperator(a, b, ab, function (itemsA, itemsB) {
        var itemsAB = [];
        $(itemsA).each(function(index, item) {
            if (contains(itemsB, item)) {
                console.log("Added " + item["id"] + ".");
                itemsAB.push(item);
            }
        });
        return itemsAB;
    });
}

function difference(a, b, ab) {
    applySetOperator(a, b, ab, function (itemsA, itemsB) {
        var itemsAB = [];
        $(itemsA).each(function(index, item) {
            if (!contains(itemsB, item)) {
                console.log("Added " + item["id"] + ".");
                itemsAB.push(item);
            }
        });
        return itemsAB;
    });
}

function product(a, b, ab) {
    applySetOperator(a, b, ab, function (itemsA, itemsB) {
        var itemsAB = [];
        $(itemsA).each(function(indexA, itemA) {
            $(itemsB).each(function(indexB, itemB) {
                console.log("Added " + itemA["id"] + "x" + itemB["id"] + ".");
                itemsAB.push(merge(itemA, itemB));
            });
        });
        return itemsAB;
    });
}

function select(a, field, condition, limit, b, applied_condition) {
    var itemsA = extractItemsFromTable(a);

    var itemsB = [];

    var gt = $("#" + condition).val() == "greater_than";
    var limitValue = Number($("#" + limit).val());

    var applied = "\"заработная плата " + (gt ? "больше чем" : "не больше чем") + " " + limitValue + "\"";
    $("#" + applied_condition).html(applied);

    $(itemsA).each(function(index, item) {
        var value = Number(item[field]);
        console.log("Check value " + item[field] + ".");
        if (isNaN(value)) {
            console.log("Ignored.");
            return;
        }

        if ((gt && value > limitValue)
                || (!gt && value <= limitValue)) {
            itemsB.push(item);
        }
    });

    addItemsToTable(b, itemsB);
}

function project(a, attrs, b, applied_attrs) {
    var itemsA = extractItemsFromTable(a);

    var selectedAttrs = $("#" + attrs).find("input:checked");
    if (selectedAttrs.length == 0) {
        return;
    }

    var props = [];
    var columns = [];
    var applied = "[";
    $(selectedAttrs).each(function(index, selectedAttr) {
        var name = $(selectedAttr).attr("name");
        columns.push(name);
        props.push($(selectedAttr).val());

        applied += name;
        if (index != selectedAttrs.length - 1) {
            applied += ", ";
        }
    });
    applied += "]";
    console.log("Applied " + applied);
    $("#" + applied_attrs).html(applied);

    var itemsB = [];
    $(itemsA).each(function(index, itemA) {
        var reducedItem = reduce(itemA, props);
        if (!contains(itemsB, reducedItem)) {
            itemsB.push(reducedItem);
        }
    });

    setHeader(b, columns);
    addItemsToTable(b, itemsB);
}

function divide(a, b, divideBy, ab, groupBy) {
    var itemsA = extractItemsFromTable(a);
    var itemsB = extractItemsFromTable(b);

    var groups = [];
    $(itemsA).each(function(index, itemA) {
        var group = itemA[groupBy];
        if ($.inArray(group, groups) == -1) {
            groups.push(group);
        }
    });
    console.log("Found " + groups.length + " groups.");

    var itemsAB = [];
    $(groups).each(function(index, group) {
        var groupItems = selectByAttr(itemsA, groupBy, group);
        $(groupItems).each(function(index, item) {
            groupItems[index] = reduce(item, [divideBy]);
        });
        console.log("Found " + groupItems.length + " for " + group + ".");
        var accepted = true;
        $(itemsB).each(function(index, itemB) {
            if (!contains(groupItems, itemB)) {
                accepted = false;
                return false;
            }
        });

        if (accepted) {
            itemsAB.push({groupBy : group});
        }
    });

    addItemsToTable(ab, itemsAB);
}

function join(a, pk, b, fk, ab) {
    var itemsA = extractItemsFromTable(a);
    var itemsB = extractItemsFromTable(b);

    var itemsAB = [];
    $(itemsB).each(function(index, itemB) {
        var joinedItem;
        $(itemsA).each(function(index, itemA) {
            if (itemA[pk] == itemB[fk]) {
                joinedItem = itemA;
                return false;
            }
        });
        if (!joinedItem) {
            console.log("Item for key " + itemB[fk] + " not found.");
            return;
        }

        var item = {};
        $.each(itemB, function(key, value) {
            if (key != fk) {
                item[key + "B"] = value;
            }
        });
        $.each(joinedItem, function(key, value) {
            item[key + "A"] = value;
        });
        itemsAB.push(item);
    });

    addItemsToTable(ab, itemsAB);
}

function applySetOperator(a, b, ab, op) {
    var itemsA = extractItemsFromTable(a);
    var itemsB = extractItemsFromTable(b);

    var itemsAB = op(itemsA, itemsB);

    addItemsToTable(ab, itemsAB);
}

function contains(items, item) {
    for(var i = 0; i < items.length; i++) {
        var current = items[i];
        if (!current) {
            continue;
        }
        if (equal(current, item)) {
            return true;
        }
    }
    return false;
}

function equal(a, b) {
    var areEqual = true;
    $.each(a, function(key, value) {
        if (value != b[key]) {
            areEqual = false;
            return false;
        }
    });
    return areEqual;
}

function merge(a, b) {
    var result = {};
    $.each(a, function(key, value) {
        result[key + "A"] = value;
    });
    $.each(b, function(key, value) {
        result[key + "B"] = value;
    });
    return result;
}

function reduce(item, props) {
    var result = {};

    $.each(item, function(key, value) {
        if ($.inArray(key, props) != -1) {
            result[key] = value;
        }
    });

    return result;
}

function selectByAttr(items, attr, value) {
    var results = [];

    $(items).each(function(index, item) {
        if (item[attr] == value) {
            results.push(item);
        }
    });

    return results;
}

function extractItemsFromTable(id) {
    var items = [];
    var rows = $("#" + id).find("tbody tr");
    $(rows).each(function(index) {
        $(this).removeClass("error");

        if (index == rows.length - 1) {
            return false;
        }

        var item = extractItemFromRow(this);
        if (item) {
            items.push(item);
        } else {
            $(this).addClass("error");
            console.log("Ignored.");
        }
    });
    return items;
}

function extractItemFromRow(row) {
    var item = {};
    var error = false;
    $(row).find("input").each(function () {
        var id = $(this).attr("id");
        var value = $(this).val();
        console.log("Found " + id + ":" + value + ".");
        if (!id || !value) {
            error = true;
            return false;
        }
        item[id] = value;
    });

    if (error) {
        return null;
    }

    console.log("Found item.");
    return item;
}

function addItemsToTable(id, items) {
    var table = $("#" + id);
    var body = $(table).find("tbody");
    $(body).empty();
    $.each(items, function(index, item) {
        var cells = [];
        $.each(item, function(key, value) {
            cells.push($("<td>").append(value));
        });

        $(body).append($("<tr>"), cells);
    });
    $(table).show();
}
