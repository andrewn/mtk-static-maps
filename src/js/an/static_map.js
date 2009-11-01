(function( env ) {
  
  if ( typeof env.an == "undefined" ) {
    env.an = {};
  }
  
  if ( !env.glow ) {
    if (!gloader) throw Error("Gloader not found.");
    gloader.load(
      [ "glow", "1", "glow.dom", "glow.events" ],
      {
        async: false
      }
    );
  }
  /*
    StaticMap is the base class to allow
    configuration of Javascript maps using 
    the BBC Mapping Toolkit (mtk) as defined
    by the Google Static Maps API.
    
    http://cdnedge.bbc.co.uk/mtk/
    http://code.google.com/apis/maps/documentation/staticmaps/
  
  */
  an.StaticMap = function( opts ){
    
    var opts = opts || {};
    
    if ( opts.params ) {
      glow.lang.apply( this.params, opts.params );
    }
    
    this.Actions = glow.lang.apply( {}, an.StaticMap.Actions );
    
  };
  
  an.StaticMap.prototype = {
    
    /**
      Shared map state
    */
    state: { stage: "before" },
    
    params: {},
    
    /*
      Actions supported by this static map object.
      The actions are invoked in the order they are
      defined in the Array.
      The action should be named the same as in the 
      ACTIONS object.
      
      Actions in the before array are invoked before the map is loaded.
      Action in the after, after.
    */
    actions: {
      before: [ "provider", "size", "maptype" ],
      after: [ "markers", "center", "zoom" ]
    },
    
    performActions: function() {
      
      var self = this;
      
      // Ensure this gets executed in this scope every time
      function perform() {
        self.actions[ self.state.stage ].forEach( function( item, i ) {
          var action = item;
          var param  = self.params[action] || null;          
          self.performAction( action, param );
        });
      }
      
      // Before actions
      perform(); 

      // Initialise the map
      this.Actions["initMap"]( this.state, function( state ) {
        glow.lang.apply( self.state, state );  
        perform();
      });
      
    },
    
    performAction: function( actionName, paramStr ) {
      
      var action        = this.Actions[ actionName ],
          returnedState = null;
      
      if ( typeof action !== "function" ) {
        throw Error( "action associated with " + actionName + " is not function");
      }
      
      if ( this.state["stage"] == "after" && !this.state["map"] ) {
        throw Error("Map not initialised, did you call performAction('initMap') ?");
      }
      
      try {
        returnedState = action( this.state["map"], paramStr );
      } catch (e) {
        throw Error( actionName + " failed with error: " + e.message );
      }
      
      if ( returnedState === null ) {
        throw Error( actionName + " returned null state object" );
      }
      
      glow.lang.apply( this.state, returnedState );

    },
    
    getState: function( stateKey ) {
      return this.state[stateKey] ? this.state[stateKey] : null;
    }
  };
  
  an.StaticMap.Actions = {
    initMap: function( state, callback ) {
      var map,
          provider = state.provider ? state.provider : null;

      bbc.mtk.load( {
        onLoad: function() {
          map = new bbc.mtk.OpenLayers.Map( "map", {
                controls: [],
                provider: provider,
                onLoad: function() { 
                  callback( { stage: "after", map: map } );
                }
              });
        }
      });
    },
    
    size: function( map, paramStr ) {
      var sizeParts = paramStr.split("x"),
          state = {},
          width,
          height;
      
      if ( sizeParts.length != 2 ) {
        throw Error("Need width and height");
      }
      
      width  = sizeParts[0] * 1;
      height = sizeParts[1] * 1;
      
      glow.dom.get("#map")
              .css("width", width + "px")
              .css("height", height + "px");
      
      window.innerWidth = width;
      window.innerHeight = height;
      
      state.width = width;
      state.height = height;
      
      return state;
    },
    
    maptype: function( map, paramStr ) {
      var state = {};
      
      state.mapType = paramStr ? paramStr : null;
      
      return state;
    },
    
    provider: function( map, paramStr ) {
      var state = {};
      
      state.provider = paramStr;
      
      return state;
    },
    
    center: function( map, paramStr ) {
       var coords = paramStr.split(","),
           state  = {},
           lat,
           lon;
      
      if ( coords && coords.length == 2 ) {
        
        lat = coords[0];
        lon = coords[1];    
        
        try {
          map.setCenter( map.getLonLat( lon, lat ) );
          state.lat = lat;
          state.lon = lon;
        } catch (e) {
          throw e;
        }
        

      } else {
        throw Error("couldn't parse 2 coords. input: " + paramStr);
      }
      
      return state;
    },
    
    zoom: function( map, paramStr ) {
      var state = {},
          zoomNum = paramStr * 1;
      map.zoomTo( zoomNum );
      state.zoom = zoomNum;
      return state;
    },
    
    markers: function( map, params ) {

      var markers = [],
          params = params.length ? params : [ params ];
      
      function splitCoord(coord) {
        return { lat: coord.split(",")[0] * 1, lon: coord.split(",")[1] * 1};
      }
      
      function parse( p ) {
        
        var parts = p.split("|"),
            spec = {
              style : { color: "red", size: "small", label: null },
              locs  : []
            },
            stylePattern = /color|size|label/i;
            
        parts.forEach( function( thing, i ) {
          
          if ( stylePattern.test(thing) ) {
            // is a style 
            spec.style[ thing.split(":")[0] ] = thing.split(":")[1];
          } else {
            // is a loc
            spec.locs.push( splitCoord(thing) );
          }
          
        });
        
        return spec;
      }
      
      params.forEach( function(item, i) {

        var layer = new bbc.mtk.OpenLayers.Layer.PinPoints( "i", { disableClustering: true })
        var spec = parse( item );
        
        spec.locs.forEach( function( loc, i ) {
          layer.addBalloon(
            map.getPoint( loc.lon, loc.lat ), {
              color: spec.style.color
            }
          );
        });
        
        map.addLayer( layer );
      });
      
      return {};
    }
  };
  
})( this );