$(function(){
    var varti;    //vertical frames
    var horizon;  //horizontal frames
    var arymine;  //mine array
    var aryopen;  //opened array
    var numb;     //mines
    var stack = [];

    // click start or restart
    $("button").click(function(){
        myWatch(0);
        verti   = Number($("input[id='verti']").val());
        horizon = Number($("input[id='horizon']").val());
        numb    = parseInt(verti * horizon * 0.15625);
        $("#bombs").text(numb);
        $("button").text("やりなおし");
        $("#result").text("");
        $("#minetable").html("");

        // makeMatrix
        Array.matrix = function (m, n, initial) {
            var a, i, j, mat = [];
            for (i = 0; i < m; i += 1) {
                a = [];
                for (j = 0; j < n; j += 1){
                    a[j] = initial;
                }
                mat[i] = a;
            }
            return mat;
        }

        // makebomb
        function makebomb(arybomb){
            var randx = 0 + Math.floor( Math.random() * arymine.length );
            var randy = 0 + Math.floor( Math.random() * arymine.length );
            if (arybomb[randx][randy] == 0) { 
                arybomb[randx][randy] = 1;
            }else{
                makebomb(arybomb);
            }
        }

        for (var i = 0; i < verti; i++){
            var ahtml =     "<tr id='line" + i + "' align=center >";
            for (var j = 0; j < horizon; j++){
                ahtml = ahtml + "<td class='col' id='" + i + "_" + j + "' ></td>"
            }
            ahtml = ahtml + "</tr>";
            $("#minetable").append($(ahtml));
        }
        var arymine = Array.matrix(verti, horizon, 0);
        var aryopen = Array.matrix(verti, horizon, 0);
        for (var l = 0; l < numb; l++){
            makebomb(arymine);
        }

        // click element
        $(".col").live('click',function(){
            var idn = $(this).attr("id");
            calcmn(idn);
            iscomp();
        });
        
        // right click
        $(".col").live('contextmenu',function(e){

            idn = $(this).attr("id");
            var ids = idn.split("_");
            var idsx = Number(ids[0]);
            var idsy = Number(ids[1]);
            if(aryopen[idsx][idsy] == 0){
                numb--;
                aryopen[idsx][idsy] = 1;     
                $("#" + idn).text("▶");   
            } else if(aryopen[idsx][idsy] == 1){
                numb++;
                aryopen[idsx][idsy] = 0;     
                $("#" + idn).text("");   
            }
            $("#bombs").text(numb);
            iscomp();
            return false;
        });

        // check complete?
        function iscomp(){
            var chk = 0;
            for (var f = 0; f < verti; f++){
                for (var m = 0; m < horizon; m++){
                    if (aryopen[f][m] != 0){
                        chk = chk + 1;
                    }
                }
            }
            if ((chk == verti * horizon) && (numb == 0)){
                $("p#result").append('complete!!<br />');
                $(".col").die('click');
                $(".col").die('contextmenu');
                myWatch(0);
                alert('congraturation:)');
            }
        }
        
        // caluclate answer
        function calcmn(idstr){
            var ids = idstr.split("_");
            var idsx = Number(ids[0]);
            var idsy = Number(ids[1]);
            var counts = 0;
            var allsides = new Array(8);
            if(aryopen[idsx][idsy] == 1){
                numb++;
                $("#bombs").text(numb);
            }
            if (arymine[idsx][idsy] == 1){
                $("#" + idstr).text("●");
                for (var i = 0; i < verti; i++){
                    for (var j = 0; j < horizon; j++){
                        if(arymine[i][j] == 1){
                            $("#" + i + '_' + j).text("●");
                        }
                    }
                }
                myWatch(0);
                alert("Game Over");
                $(".col").die('click');
                $(".col").die('contextmenu');
            } else {
                //   point
                //  0  1  2
                //  3  @  4
                //  5  6  7
                for (var d = 0; d < allsides.length; d++){
                    allsides[d] = null;
                }
                if((idsx != 0) && (idsy != 0)){                    // point0
                    allsides[0] = Number(idsx - 1) + '_' +  Number(idsy - 1);
                    countmine(allsides[0]);
                }
                if( idsx != 0){                                    // point1       
                    allsides[1] = parseInt(idsx - 1) + '_' + parseInt(idsy);
                    countmine(allsides[1]);
                }
                if((idsx != 0) && (idsy != horizon - 1)){          // point2
                    allsides[2] = parseInt(idsx - 1) + '_' + parseInt(idsy + 1);
                    countmine(allsides[2]);
                }
                if( idsy != 0){                                    // point3
                    allsides[3] = parseInt(idsx) + '_' + parseInt(idsy - 1);
                    countmine(allsides[3]);
                }
                if( idsy != horizon - 1){                          // point4
                    allsides[4] = parseInt(idsx) + '_' + parseInt(idsy + 1);
                    countmine(allsides[4]);
                }
                if((idsx != verti - 1) && (idsy != 0)){            // point5
                    allsides[5] = parseInt(idsx + 1) + '_' + parseInt(idsy - 1);
                    countmine(allsides[5]);
                }
                if( idsx != verti - 1){                            // point6
                    allsides[6] = parseInt(idsx + 1) + '_' + parseInt(idsy);
                    countmine(allsides[6]);
                }
                if((idsx != verti - 1) && (idsy != horizon - 1)){  // point7
                    allsides[7] = parseInt(idsx + 1) + '_' + parseInt(idsy + 1);
                    countmine(allsides[7]);
                }
                $("#" + idstr).text(counts);
                aryopen[idsx][idsy] = 2;
                if(counts == 0){
                    for(var e = 0; e < allsides.length; e++){
                        if (allsides[e] != null){
                            var alsd = allsides[e].split("_");
                            if(parseInt(aryopen[alsd[0]][alsd[1]]) == 0){
                                calcmn(allsides[e]);
                            }
                        }
                    }
                }
            }
            
            // summary mines count
            function countmine(indx){
                var indxs = indx.split("_");
                if(arymine[indxs[0]][indxs[1]] == 1){
                    counts++;
                }
            }
        }
    });
});
