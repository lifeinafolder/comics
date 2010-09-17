function capitalize(str){
  var tokens = str.split(' ');
  tokens.forEach( function(token,ind){
    token = token.toLowerCase();
    tokens[ind] = token.substr(0,1).toUpperCase() + token.substr(1);
  });
  return tokens.join(' ');
}

function loadMasonry(){
  var e  = new ebay({
    appId: 'eBayb653a-8240-4cf1-9b3c-715b5b09f55',
    callback: function(response){
      var items = response.findItemsByKeywordsResponse["0"].searchResult["0"].item;
      var container = $('#box');
      items.forEach(function(val,ind){
        if ( val.galleryURL ){
          var source = val.galleryURL["0"];
          source = source.replace('8080_1','4040_1');
          var img = new Image();
          img.onload = function(){
            var wrapper = document.createElement('DIV');
            $(wrapper).css({
              'width': img.width,
              'height': img.height,
            });
            var info = document.createElement('DIV');
            $(info).css({
              'height' : img.height - 10,
              'padding' : 5
            });
            $(info).addClass('info');
            info.innerHTML = capitalize(val.title[0]);
            $(wrapper).append(info);
            $(wrapper).addClass('box');
            wrapper.style.backgroundImage = 'url(' + source + ')';
            
            $(wrapper).mouseenter( function(){
              var self = this;
              $(self).addClass('highlight');
              $(this).find('.info').show();
            });
      
            $(wrapper).mouseleave( function(){
              $(this).removeClass('highlight');
              $(this).find('.info').hide();
            });
            
            container.append(wrapper);
          };
          img.src = source;
        }
      });


      var target;
      $(document).keyup(function(e){
        if ( !target ){
          target = $(container).find(':first');
          $(target).addClass('highlight');
          return;
        }
        $(target).removeClass('highlight');        
        switch( e.keyCode ){
          case 37:  //left
            target = ( $(target).prev().length !== 0 ) ? $(target).prev() : target;
            break;
          case 38:
            var offset = $(target).offset();
            var top = offset.top - ($(target).outerHeight() + 20);
            var newTarget = document.elementFromPoint(offset.left,top);
            target = newTarget;
          case 39:  //right
            target = ( $(target).next().length !== 0 ) ? $(target).next() : target;
            break;
          case 40:
            var offset = $(target).offset();
            var top = offset.top + $(target).outerHeight() + 20;
            var newTarget = document.elementFromPoint(offset.left,top);
            target = newTarget;
            break;
        }
        $(target).addClass('highlight');
      });
    }
  });

  e.searchByKeywords('gucci dress');
}

function doMasonry(){
  $('#box').masonry({
    columnWidth: 20
  });
}