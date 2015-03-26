function analyze(matrix){
	matrix = [
		[1, 0.5, 0.5, 0.5, 0.33],
		[2, 1, 1, 1, 0.5],
		[2, 1, 1, 1, 0.5],
		[2, 1, 1, 1, 0.5],
		[3, 2, 2, 2, 1]
	]
	var n = matrix.length;

	// Подсчет С = sqrtN(П Kj) 
	var c_vector = [];
	var c_sum = 0;
	for (var i = 0; i < n; i++){
		var mult = 1;
		for (var j = 0; j < n; j++){
			mult = mult * matrix[i][j];
		}
		var degree = 1/n;
		c = Math.pow(mult, degree);
		c = Number(c.toFixed(3));
		c_vector.push(c);
		c_sum = c_sum + c;
	}

	// Подсчет aplha
	var alpha_vector = [];
	for (var i = 0; i < c_vector.length; i++){
		var alpha = c_vector[i]/c_sum;
		alpha_vector.push(alpha);
	}

	// Подсчет лямбда
	var R = getRValue(n);
	lamdba_max = 0;

	for (var j = 0; j < n; j++){
		k_sum = 0;
		for (var i = 0; i < n; i++){
			k_sum = k_sum + matrix[i][j];
		}
		lamdba_max = lamdba_max + alpha_vector[j] * k_sum;
	}

	var OC = (lamdba_max - n)/((n - 1)*R);
	OC = Number(OC.toFixed(3));

	return {
		"OC": OC,
		"alpha": alpha_vector,
		"c_vector": c_vector
	}

}


function getResultVariant(n, m, criteria_alpha, variant_alpha){
	// criteria_alpha - массив альф критериев в порядке с К1 по Кn
	// variant_alpha - массив из массивов альф вариантов, варианты с В1 по Вn внутри каждого массивчика
	// n - количество критериев, m - количество вариантов
	criteria_alpha = [0.097, 0.184, 0.184, 0.184, 0.35]
	variant_alpha = [
		[0.57, 0.285, 0.143],
		[0.143, 0.57, 0.285],
		[0.107, 0.318, 0.575],
		[0.25, 0.498, 0.25],
		[0.57, 0.285, 0.143]
	]
	n = 5;
	m = 3;
	var sums = []
	var max_sum = -Number.MAX_VALUE;
	var max_variant = 0;
	for (var i = 0; i < m; i++){
		var variant;
		var sum = 0;
		for (var j = 0; j < n; j++){
			var crit_alpha = criteria_alpha[j];
			var var_alpha = variant_alpha[j][i];
			sum = sum + crit_alpha * var_alpha;
		}
		sums.push(sum);
		if (sum > max_sum){
			max_sum = sum;
			max_variant = i;
		}
	}

	console.log("Лучший вариант = " + max_variant);

	return {
		"sums": sums,
		"best_variant": max_variant,
	}

}


function getRValue(n){
	if (n == 5)
		return 1.12;
	if (n == 3)
		return 0.58;
}