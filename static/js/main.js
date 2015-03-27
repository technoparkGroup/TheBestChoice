$(document).ready(function() {

    var step = 0;

    var $quantitySubmit = $('#quantity_submit'),
        $secondBlock = $('#second'),
        $nextMatrix = $('#next_matrix');

    var choiceNumber, criteriaNumber;

    $nextMatrix.on('click', getNext);

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
        $nextMatrix.before(getMatrix(criteriaNumber, 'criteria', 'Сравнение критериев'));

    });

    function getNext() {
        if(step < criteriaNumber + 1) {
            $nextMatrix.before(getMatrix(choiceNumber, 'choice', 'Сравнение вариантов по критерию ' + step));

        } else {
            //конец матриц
            $('#result').remove();
            $nextMatrix.text("Обновить");
            $nextMatrix.before($('<h1/>', {'id': 'result', 'text': 'THE END'}));
        }
    }


    function getMatrix(size, type, caption) {
        var $table = $('<table/>', {
            'class': 'table table-hover table-bordered',
            'data-type': type,
            'data-step': step});

        $table.append($('<caption/>', {'text': caption}));
        var $tHead = $('<thead/>');
        var $tBody = $('<tbody/>');
        var $headRow = $('<tr/>');

        $tHead.append($headRow);

        var tds = [$('<td/>', {'text': '*'})];
        for(var i = 0; i < size; i++) {
            tds.push($('<td/>', {'text': i + 1}));
        }
        tds.push($('<td/>', {'text': 'c'}));
        tds.push($('<td/>', {'text': 'alpha'}));

        $headRow.append(tds);

        var trs = [];
        for(i = 0; i < size; i++) {
            var $tr = $('<tr/>');
            tds = [$('<td/>', {text: i + 1})];
            for(var j = 0; j < size; j++) {
                var $input;
                if(i == j) {
                    $input = $('<input/>', {
                        'data-type': 'value',
                        'data-row': i,
                        'data-column': j,
                        'class':"form-control",
                        'value':"1",
                        'readonly': 'readonly',
                        'tabindex': -1});
                } else {
                    if(i > j) {
                        $input = $('<input/>', {
                            'data-type': 'value',
                            'data-row': i,
                            'data-column': j,
                            'class':"form-control",
                            'readonly': 'readonly',
                            'tabindex': -1});
                    } else {
                        $input = $('<input/>', {
                            'data-type': 'value',
                            'data-row': i,
                            'data-column': j,
                            'class':"form-control",
                            'type':"number"});
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

            tds.push($('<td/>')
                .append($('<input/>', {
                    'data-type': 'c',
                    'data-step': step,
                    'data-row': i,
                    'class':"form-control",
                    'readonly': 'readonly',
                    'tabindex': -1})));

            tds.push($('<td/>')
                .append($('<input/>', {
                    'data-type': 'alpha',
                    'data-step': step,
                    'data-row': i,
                    'class':"form-control",
                    'readonly': 'readonly',
                    'tabindex': -1})));

            $tr.append(tds);
            trs.push($tr);
        }

        $tBody.append(trs);
        $table.append([$tHead, $tBody]);

        var $matrix = $('<div/>', {'class': 'col-md-12'});
        var $infoDiv = $('<div/>', {'class': 'row'});
        $matrix.append([$table, $infoDiv]);
        $infoDiv.append([
            $('<p/>', {'class': 'col-md-5',
                'text': 'статус',
                'data-type': type,
                'data-step': step}),
            $('<button/>', {'text': 'Проверить',
                class: 'pull-right btn btn-success',
                'data-type': type,
                'data-step': step})
        ]);
        step += 1;
        return $matrix;
    }
});