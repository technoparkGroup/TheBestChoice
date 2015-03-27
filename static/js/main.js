$(document).ready(function() {

    alphas = [], //храним массивы для всех матриц
        cs = [],
        consistencyMarks = [];

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
        for(var i = 0; i < consistencyMarks.length; i++) {
            if(consistencyMarks[i] > 0.1) {
                toastr.error('Некоторые матрицы не согласованы');
                return;
            }
        }
        if(step < criteriaNumber + 1) {
            $nextMatrix.before(getMatrix(choiceNumber, 'choice', 'Сравнение вариантов по критерию ' + step));

        } else {
            //конец матриц
            $('.result').remove();
            $nextMatrix.text("Обновить");
            if(alphas.length < 1) {
                toastr.error('Проверьте все матрицы');
                return;
            }
            var bestChoice = getResultVariant(criteriaNumber, choiceNumber, alphas);
            var $resultSums = $('<p/>', {'class': 'result'});
            for(i = 0; i < bestChoice.sums; i++) {
                $resultSums.append('Вариант ' + (i + 1) + '=' + bestChoice.sums[i] + '\n');
            }
            $nextMatrix.before($('<h1/>', {'class': 'result', 'text': 'Лучший вариант: ' + bestChoice.best_variant}));
        }
    }


    function parseMatrix(tableElement) {
        var $inputs = $(tableElement).find('input[data-type=value]');
        var array = [];
        var size = $(tableElement).data('size');
        var correct = true;
        $inputs.each(function () {
            var inputValue = parseFloat($(this).val());
            if(isNaN(inputValue)) {
                correct = false;
            } else {
                array.push(inputValue);
            }
        });
        if(!correct){
            return null;
        } else {
            var matrix = [],
                count = 0;
            for (var i = 0; i < size; i++) {
                var row = [];
                for (var j = 0; j < size; j++) {
                    row.push(array[count]);
                    count++;
                }
                matrix.push(row);
            }
            return matrix;
        }
    }

    function getMatrix(size, type, caption) {
        var $table = $('<table/>', {
            'class': 'table table-hover table-bordered',
            'data-type': type,
            'data-size': size,
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
                        'data-step': step,
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
                            'data-step': step,
                            'data-column': j,
                            'class':"form-control",
                            'readonly': 'readonly',
                            'tabindex': -1});
                    } else {
                        $input = $('<input/>', {
                            'data-type': 'value',
                            'data-row': i,
                            'data-step': step,
                            'data-column': j,
                            'class':"form-control",
                            'type':"number"});
                        $input.keyup(function () {
                            this.value = this.value.replace(/[^0-9\.]/g,'');
                        });
                        $input.bind('propertychange change click keyup input paste', function(event) {
                            var row = $(this).data('row'),
                                column = $(this).data('column'),
                                step = $(this).data('step');

                            var $inverseInput = $('input[data-row=' + column +'][data-column=' + row +'][data-step=' + step +']');
                            var intValue = parseFloat($(this).val());
                            if(isNaN(intValue)) {
                                $inverseInput.val("");
                            } else {
                                $inverseInput.val((1 / intValue).toFixed(3));
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
            $('<p/>', {'class': 'col-md-5 consistency_mark',
                'data-type': type,
                'data-step': step}),
            $('<button/>', {'text': 'Проверить',
                class: 'pull-right btn btn-success check_consistency',
                'data-type': type,
                'data-step': step}).on('click', function() {
                var $table = $(this).parent().siblings(".table");
                var step = $table.data('step');
                var matrix = parseMatrix($table);
                if(matrix === null) {
                    toastr.error('Ошибка в матрице');
                    return;
                }
                var analyzeInfo = analyze(matrix);
                alphas[step] = analyzeInfo.alpha;
                cs[step] = analyzeInfo.c_vector;
                consistencyMarks[step] = analyzeInfo.OC;
                var $consistencyMark = $(this).siblings('.consistency_mark');
                $consistencyMark.text('Оценка согласованности: ' + analyzeInfo.OC);
                if(analyzeInfo.OC > 0.1) {
                    $consistencyMark.css({'color': 'red'});
                } else {
                    $consistencyMark.css({'color': 'green'});
                }

                var $alphas = $table.find('input[data-type=alpha]');
                for(var i = 0; i < analyzeInfo.alpha.length; i++) {
                    $alphas.filter('[data-row=' + i +']').val(analyzeInfo.alpha[i]);
                }

                var $vector = $table.find('input[data-type=c]');
                for(i = 0; i < analyzeInfo.c_vector.length; i++) {
                    $vector.filter('[data-row=' + i +']').val(analyzeInfo.c_vector[i]);
                }

                })
        ]);
        step += 1;
        return $matrix;
    }
});