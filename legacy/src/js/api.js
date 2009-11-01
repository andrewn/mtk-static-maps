(function(){
  
  var domId = "map",
      map,
      layer,
      params,
      width,
      height,
      domEl,
      glow;
      
  var REQ_MSG = "Required parameter not found.";
  
  // Public API
  StaticMaps = {
    init : init,
    loadGlow : loadGlow,
    on : function( eventName, callback ) {
      glow.events.addListener( this, eventName, callback );
    }
  };
  
  var Events = {
      CENTER: "center"
  }
  
  function loadGlow( fn ) {
    gloader.load( 
      [ "glow", "1", "glow.dom", "glow.events" ], {
      onLoad: function( g ) {
        glow = g;
        fn();
      }
    });
  }
  
  function init( p ) {
    params = p;
    glow.ready( initMap );
  }
  
  function initMap() {
    
    // destroy previous map?
    glow.dom.get("#domId").empty();
    
    if( !params["size"] ) fail( REQ_MSG );
    
    var size = params[ "size" ].split("x");
    width  = size[0];    
    height = size[1];
    
    // Set the browser viewport to the 
    // same size as the map
    window.innerWidth  = width;
    window.innerHeight = height;
    
    if ( !width || !height ) fail( REQ_MSG );
    
    domEl = glow.dom.get( "#" + domId );
    domEl.css( "width", width + "px" );
    domEl.css( "height", height + "px");
    
    bbc.mtk.PROVIDERS = bbc.mtk.PROVIDERS.concat( ["CloudMade", "GoogleMaps"] );
    
    var map_opts = {
      controls: [],
      onLoad: function() { parse(params) }
    }
    
    if ( params["provider"] ) 
      map_opts["provider"] = params["provider"];
    
    bbc.mtk.load( {
      onLoad: function() {
        map = new bbc.mtk.OpenLayers.Map( domId, map_opts );
        console.log(map);
      }
    });
  }
    
  function parse( params ) {
    
    for( var key in params ) {
      if( Actions[ key ] ) {
        try {
          Actions[ key ]( params[ key ] );
        } catch(e) {
          warn( "Action " + key + " failed." );
          warn(e.message)
        }
      }
    }
  }
  
  function fail( msg ) {
    throw new Error( msg );
  }
  
  function warn( msg ) {
    console.warn( msg );
  }
  
  function fire( eventName, eventParams ) {
    glow.events.fire( this, eventName, eventParams );
  }
  
  var Actions = {
    center  : function( param ) {
      var coords = param.split(",");
      map.setCenter( map.getLonLat( coords[1], coords[0] ) );

      fire( Events.CENTER, { lat: coords[0], lon: coords[1] } );
    },
    zoom    : function( param ) {
      map.zoomTo( param * 1 );
    },
    markers : function( params ) {

      var params = params.forEach ? params : [ params ];
      
      params.forEach( function (param) {
        
        var parts         = param.split("|"),
            stylePattern  = /:/i,
            styleInfo     = {};
        
        console.log("for each", parts);
        
        var i   = 0,
            len = parts.length,
            parsingStyles = true;

        layer = new bbc.mtk.OpenLayers.Layer.PinPoints();

        for ( ; i < len; i++ ) {
                    
          var p = parts[i];
          if ( parsingStyles == true && 
                stylePattern.test( p ) ) {
            // store the style for later
            var style = p.split(":");
            styleInfo[ style[0] ] = style[1];
            
            console.log("store style for later", style);
            
          } else {
            // it's a marker
            parsingStyles = false; // just in case

            var coords = p.split(",");
            var map_coords = map.getPoint( coords[1] * 1, coords[0] * 1 );

            console.log("added balloon", p.split(","), styleInfo);
            console.log(map_coords);

            window.p = layer.addBalloon( 
              map_coords, { 
                color: styleInfo["color"],
                title: "a title"
              });
          }
        }
        
        window.l = layer;
        
        console.log("adding layer to map", layer);
        
        
        map.addLayer( layer );
        
        console.log("layer added to map", layer);
        
      });
    }
  };

})();