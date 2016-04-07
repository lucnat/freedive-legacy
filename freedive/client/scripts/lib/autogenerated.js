
CO2table = function(){
	
	// returns CO2 table array by acceessing profile maxTime or using default
	var table = [];
	try{
		var maxTime = User.get().maxTime;
	} catch(e){
		var maxTime = 9;
	};	

	var breathTime = 165;

	for(var i=0; i<16; i++){
		if(i%2==0){	
			//breath
			breathTime -= 15;
			if(breathTime < 60)
				table[i] = 60;
			else
				table[i] = breathTime;
		} 
		//hold
		else table[i] = maxTime*1.0/2; 
	}

	for(i=0; i<table.length; i++){
		table[i] = Math.round(table[i]);
	}
	return table
};

O2table = function(){
	
	// returns O2 table array by acceessing profile maxTime or using default
	var table = [];
	try{
		var maxTime = User.get().maxTime;
	} catch(e){
		var maxTime = 9;
	};
	

	var step = maxTime/12;
	var lowerLimit = 4*step;
	var upperLimit = maxTime-2*step;
	var holdTime = lowerLimit

	for(var i=0; i<16; i++){
		if(i%2==0) //breath
			table[i] = 120;
		else{ //hold
			if(holdTime < upperLimit){
				table[i] = holdTime;
			}
			else table[i] = upperLimit;
			holdTime += step;
		} 
	}

	for(i=0; i<table.length; i++){
		table[i] = Math.round(table[i]);
	}
	return table;
};