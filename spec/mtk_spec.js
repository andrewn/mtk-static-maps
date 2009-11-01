Screw.Unit(function(){
  
  describe('StaticMap', function(){
    
    describe('object', function(){
      var sm = null;
      before( function() { sm = new an.StaticMap(); } );
      
      describe('creation and functions', function() {
        
          it('should initialise to a new object', function(){
            expect( sm ).to_not( be_null );
          });
          
          it('should create an mtk map object with default params', function(){
            
          });
          
          it('should have performAction() method', function(){
            expect( typeof sm.performAction ).to( equal, "function" );
          });
          
          it('should allow state querying via getState()', function(){
            expect( typeof sm.getState ).to( equal, "function" );
          });

      });     
      
      describe('configure via object literal', function(){
        
        
      });
      
    }); // end describe object

    describe('Google Static maps API', function(){
      
      var sm = new an.StaticMap();
          sm.actions.before = [];
          sm.actions.after  = [];
      
      describe('after map initialised', function() {
        
        describe('center', function(){
          var centerParam = "40.714728,-73.998672";
          before( function() { sm.performAction("center", centerParam); });

          it('should set the lat and lon state', function() {
            expect( sm.getState('lat') ).to( equal, "40.714728" );
            expect( sm.getState('lon') ).to( equal, "-73.998672" );
          });
        });

        describe('size', function(){

        });
      });
      
      
    });
      
  }); // end StaticMap
  
}); // end Screw.Unit