myButton = 0;
function myWatch(flug){
  if (myButton==0){ 
    Start=new Date();
    myButton = 1;
    myInterval=setInterval("myWatch(1)",1);
  } else { 
    if (flug==0){
      myButton = 0;
      clearInterval( myInterval ); 
    }
    Stop=new Date();
    T = Stop.getTime() - Start.getTime();
    H = Math.floor(T/(60*60*1000));
    T = T-(H*60*60*1000);
    M = Math.floor(T/(60*1000));
    T = T-(M*60*1000);
    S = Math.floor(T/1000); 
    Ms = T%1000; 
    $("#timestamp").text(H+":"+M+":"+S+":"+Ms);
  }
}
