startTimer = function(i, callback) {
    var start = Date.now(),
        diff,
        minutes,
        seconds,
        id;

       var duration = timeTable.list()[i];
       console.log('duration: ' + duration);
    function timer() {
        // get the number of seconds that have elapsed since 
        // startTimer() was called
        diff = duration - (((Date.now() - start) / 1000) | 0);
        console.log(diff);
        timeTable[i] = diff;
        timeTable.changed();
        // does the same job as parseInt truncates the float
        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        if(seconds == 10 && minutes == 0){
            playSound('10seconds');
        }
        //console.log(minutes + ":" + seconds); 

        if (diff <= 0) {
            // add one second so that the count down starts at the full duration
            // example 05:00 not 04:59
            //start = Date.now() + 1000;
            Meteor.clearInterval(id);
            if(callback){
            	callback();
            }
        }
    };
    // we don't want to wait a full second before the timer starts
    var id = Meteor.setInterval(timer, 1000);
    Session.set('currentTimer', id);

    timer();
}
