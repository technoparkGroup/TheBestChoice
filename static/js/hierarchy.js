function analyze(matrix){

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
	OC = Math.abs(Number(OC.toFixed(3)));

	return {
		"OC": OC,
		"alpha": alpha_vector,
		"c_vector": c_vector
	}

}


function getResultVariant(n, m, alpha){
	// criteria_alpha - массив альф критериев в порядке с К1 по Кn
	// variant_alpha - массив из массивов альф вариантов, варианты с В1 по Вn внутри каждого массивчика
	// n - количество критериев, m - количество вариантов
	criteria_alpha = alpha[0];
	variant_alpha = [];
	for (var i = 1; i < alpha.length; i++){
		variant_alpha.push(alpha[i]);
	}

	var sums = [];
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
		"best_variant": max_variant + 1
	}

}


function getRValue(n){
	var NtoR = {
		"3": 0.58,
		"4": 0.9,
		"5": 1.12,
		"6": 1.24,
		"7": 1.32,
		"8": 1.41,
		"9": 1.45,
		"10": 1.49 
	}
	return NtoR[n.toString()]
}