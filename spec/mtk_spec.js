Screw.Unit(function(){
  
  describe('Bootstrap', function(){
    it('should initialise properly', function(){
      expect( StaticMaps.init({}) ).to( equal, null );
    });
  });
  
  describe('Actions', function(){
    describe('center', function(){
      it('should set the coordinates of the map', function(){
        expect( map.getCentre() ).to( equal, true);
      })
    })
  });
  
});