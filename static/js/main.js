$(document).ready(function() {
    var $quantitySubmit = $('#quantity_submit'),
        $secondBlock = $('#second');

    var choiceNumber, criteriaNumber;

    $quantitySubmit.on('click', function() {
        var choiceValue = parseInt($('#choices').val());
        var criteriaValue = parseInt($('#crits').val());
        if(isNaN(choiceValue) || choiceValue < 1 || isNaN(criteriaValue) || criteriaValue < 1) {
            toastr.error("Ошибка в количестве");
            return;
        }

        $(this).remove();
        choiceNumber = choiceValue;
        criteriaNumber = criteriaValue;
        $secondBlock.removeAttr('hidden');

        $secondBlock.append(getMatrix(5));

    });

    function getMatrix(size) {
        var $table = $('<table/>', {'class': 'table table-hover table-bordered'});
        var $tHead = $('<thead/>');
        var $tBody = $('<tbody/>');
        var $headRow = $('<tr/>');

        $tHead.append($headRow);

        var tds = [$('<td/>', {'text': '*'})];
        for(var i = 0; i < size; i++) {
            tds.push($('<td/>', {'text': i + 1}));
        }

        $headRow.append(tds);

        var trs = [];
        for(i = 0; i < size; i++) {
            var $tr = $('<tr/>');
            tds = [$('<td/>', {text: i + 1})];
            for(var j = 0; j < size; j++) {
                var $input;
                if(i == j) {
                    $input = $('<input/>', {'data-row': i, 'data-column': j, 'class':"form-control", 'value':"*", 'readonly': 'readonly', 'tabindex': -1});
                } else {
                    if(i > j) {
                        $input = $('<input/>', {'data-row': i, 'data-column': j, 'class':"form-control inp", 'readonly': 'readonly', 'tabindex': -1});
                    } else {
                        $input = $('<input/>', {'data-row': i, 'data-column': j, 'class':"form-control inp", 'type':"number"});
                        $input.keyup(function () {
                            this.value = this.value.replace(/[^0-9\.]/g,'');
                        });
                        $input.bind('propertychange change click keyup input paste', function(event) {
                            var row = $(this).data('row'),
                                column = $(this).data('column');

                            var $inverseInput = $('input[data-row=' + column +'][data-column=' + row +']');
                            var intValue = parseInt($(this).val());
                            if(isNaN(intValue)) {
                                $inverseInput.val("");
                            } else {
                                $inverseInput.val(1 / intValue);
                            }
                        });
                    }
                }
                tds.push($('<td/>').append($input));
            }
            $tr.append(tds);
            trs.push($tr);
        }

        $tBody.append(trs);
        $table.append([$tHead, $tBody]);

        return $table;
    }
});