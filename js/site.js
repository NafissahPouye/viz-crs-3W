  function generateringComponent(vardata, vargeodata){
  var lookup = genLookup(vargeodata) ;
  var crsMap = dc.leafletChoroplethChart('#Map');
  var whoChart = dc.rowChart('#who');
  var whatChart = dc.rowChart('#what');
  var cf = crossfilter(vardata) ;
  var all = cf.groupAll();
    
  var mapDimension = cf.dimension(function(d) { return d['#adm2+code']});
  var mapGroup = mapDimension.group();
  /*var total = dc.numberDisplay('#Total');
  var benDirects = dc.numberDisplay('#Direct');
  var benIndirects = dc.numberDisplay('#Indirect');*/
  var whatDimension = cf.dimension(function (d){return d['#sector+name']});
  var whoDimension = cf.dimension(function(d){return (d['#subsector+name'])});
  var whatGroup = whatDimension.group();
  var whoGroup = whoDimension.group();
  /*var totalDimension = cf.dimension(function(d){return d['#subsector+name']});
  var totalGroup = totalDimension.groupAll().reduceSum(function(d){return d['#reached+total']});
  
  var bdDimension = cf.dimension(function(d){return d['#reached+direct']});
  var bdGroup = totalDimension.groupAll().reduceSum(function(d){return d['#reached+direct']});
  var biDimension = cf.dimension(function(d){return d['#reached+indirect']});
  var biGroup = totalDimension.groupAll().reduceSum(function(d){return d['#reached+indirect']});
    */
//Key figures
         /*total.group(totalGroup)
             
              .formatNumber(d3.format(',.0f'))
              .valueAccessor(function (d) { return d;
              }) ; 
   benDirects.group(bdGroup)
              .formatNumber(d3.format(',.0f'))
              .valueAccessor(function (d) { return d;
              } ) ; 
  benIndirects.group(biGroup)
              .formatNumber(d3.format(',.0f'))
              .valueAccessor(function (d) { return d;
              } ) ; */
    
whatChart
            .width(350)
            .height(310) 
    .margins({
            top: 10,
            right: 30,
            bottom: 30,
            left: 50
          })
            .dimension(whatDimension)
            .group(whatGroup)
            .elasticX(true)
            .data(function(group) {
                return group.top(Infinity);
            })
            //.filter(function(d) { return d.key !== ""; })
            .colors('#4169E1')
            .colorAccessor(function(d, i){return 0;});
            
    whoChart
            .width(350)
            .height(310)
            .margins({
            top: 10,
            right: 30,
            bottom: 30,
            left: 50
          })
            .dimension(whoDimension)
            .group(whoGroup)
            .elasticX(true)
            .data(function(group) {
                return group.top(Infinity)
            .filter(function(d) { return d.key !== ""; });
            })
            //.filter(function(d) { return d.key !== ""; })
            .colors('#4169E1')
            .colorAccessor(function(d, i){return 0;})
            .xAxis().ticks(5);
            //.xAxis().ticks(5);
   dc.dataCount('#count-info')
    .dimension(cf)
    .group(all);
       crsMap.width($('#Map').width()).height(90)
             .dimension(mapDimension)
             .group(mapGroup)
             //.label(function (p) { return p.key; })
//.renderTitle(true)
             .center([0,0])
             .geojson(vargeodata)
             .colors(['#B0C4DE','#4169E1'])
             .renderTitle(true)
             .label(function (p) {
                    return p.key;
                                })
            .colorDomain([0, 1])
            .colorAccessor(function (d) {
                var c=0;
                if (d>0) {
                    c=1;
                }
                    return c;
                })       
            .featureKeyAccessor(function (feature) {
            return feature.properties['admin2Pcod'];
           }).popup(function (d) {
            return '<h4>'+ d.properties['admin2Name']+ '</h4>' ;
     })
        
        .featureOptions({
            'fillColor': 'gray',
            'color': 'gray',
            'opacity': 0.3,
            'fillOpacity': 0.1,
            'weight': 1
        })
     /*crsMap.on("postRedraw",(function(e){
                var html = "";
                e.filters().forEach(function(l){
                    html += l+", ";
                });
                $('#Map').html(html);
            })); */     


      dc.renderAll();

      var map = crsMap.map({ scrollWheelZoom:false
        
      });
     
$(".leaflet-control-zoom").css("visibility", "hidden");
      zoomToGeom(vargeodata);
      function zoomToGeom(geodata){
        var bounds = d3.geo.bounds(geodata) ;
        map.fitBounds([[bounds[0][1],bounds[0][0]],[bounds[1][1],bounds[1][0]]])
            .setZoom(6)
            .scrollWheelZoom.disable()
            .dragging.disable();
            
            //.setView([14, 14], 3);
      }
        
      function genLookup(geojson) {
        var lookup = {} ;
        geojson.features.forEach(function (e) {
          lookup[e.properties['admin2Pcod']] = String(e.properties['admin2Name']);
        });
        return lookup ;
      }
};
      


var dataCall = $.ajax({
    type: 'GET',
    url: 'data/sahel.json',
    dataType: 'json',
});

var geomCall = $.ajax({
    type: 'GET',
  //  url: 'https://proxy.hxlstandard.org/data.json?strip-headers=on&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F19dmYe6oCJuJ92nOIqqwyRI8wBgizwuwJh1ycOOrqHUw%2Fedit%23gid%3D372257676',
    url: 'data/SN_adm2.geojson',
    dataType: 'json',
});

$.when(dataCall, geomCall).then(function(dataArgs, geomArgs){
    var geom = geomArgs[0];
    geom.features.forEach(function(e){
        e.properties['admin2Pcod'] = String(e.properties['admin2Pcod']);
    });
    generateringComponent(dataArgs[0],geom);
});
