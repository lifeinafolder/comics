var comicBooksBrowser = (function(){
  var loadingDiv = $('footer');
	var query,container,pageNo = 1, fetching = false;
  //helper fn to sanitize some reealllly messed up text
  function capitalize(str){
    var tokens = str.split(' ');
    tokens.forEach( function(token,ind){
      token = token.toLowerCase();
      tokens[ind] = token.substr(0,1).toUpperCase() + token.substr(1);
    });
    return tokens.join(' ');
  }
  
  //mason that biatch, please
  function doMasonry(selector){
    $('' + selector).masonry({
      columnWidth: 10
    });
  }
  
  var responseHandler = function(data){
    //attach the infinite scroll handler the first time this fn is called i.e. callback is received.
    $(document).scroll(function(){
			console.info('scroll triggered');
			if(pageNo < 4){
	      var pageHeight = $(document).height();
	      var viewportHeight = $(window).height();
	      var scrollHeight = $(document).scrollTop();

	      if ( !fetching && (pageHeight - viewportHeight - scrollHeight < 100) ){
	        e.searchByKeywords(query,{
	          'paginationInput.pageNumber' : pageNo
	        });
	        fetching = true;
	        loadingDiv.show();
	      }
			}
			else{
				if( !document.getElementById('next') ){
					console.log('capping infinite scroll. Adding next button from now onwards');
					var btn = $('<INPUT type="button"/>');
					btn.attr('value','Next');
					btn.attr('id','next');
					//btn.attr('type','button');
					btn.click(function(){
						pageNo +=1;
						e.searchByKeywords(query,{
		          'paginationInput.pageNumber' : pageNo
		        });
						fetching = true;
						loadingDiv.show();
					});
					container.append(btn);
				}
			}
    });
    
    //rewrite fn
    var fn = function(response){
      var items = response.findItemsByKeywordsResponse["0"].searchResult["0"].item;
      var len = items.length;
			pageNo +=1;	//now that the response is back, increment the page no.
      //console.info('Items Fetched: ', len);
      /*
      container.mouseover(function(e){
        var target = $(e.target);
        //console.log('Mouseover: ', target.attr('class'));
        if ( target.hasClass('box') && !target.hasClass('highlight') ){
          var infodialog = $(target).find('.info');
          target.addClass('highlight');
          infodialog.show();
        }
      });
      
      container.mouseout(function(e){
        var mouseoutFrom = $(e.target);
        var mouseoutTo = $(e.relatedTarget);
        console.log('Mouseout from: ', mouseoutFrom.attr('class') );
        console.log('Mouseout to: ', mouseoutTo.attr('class') );
        
        if( mouseoutFrom.hasClass('info') && mouseoutTo !== mouseoutFrom.parent() ){
          var highlightedElem = $(this).find('.highlight');
          highlightedElem.removeClass('highlight');
          highlightedElem.find('.info').hide();
        }
      });
      */
      var fragment = document.createElement('DIV');
			console.info(response.findItemsByKeywordsResponse["0"].paginationOutput['0'].pageNumber['0']);
      fragment.id = 'page' + response.findItemsByKeywordsResponse["0"].paginationOutput['0'].pageNumber['0'];
      
      items.forEach(function(val,ind){
        if ( val.galleryURL ){
          //var source = val.galleryPlusPictureURL['0'] || val.galleryURL["0"];
          var source = val.galleryURL["0"];
          source = source.replace('8080_1','4040_1');
          var link = val.viewItemURL[0];
          var img = new Image();
          img.onload = function(){
            var wrapper = $('<a/>');
            wrapper.css({
              'width': img.width,
              'height': img.height
            });
            
            wrapper.attr('href',link);
            wrapper.addClass('box');
            wrapper.css('opacity',0);
            wrapper[0].style.backgroundImage = 'url(' + source + ')';
            
            var info = $('<DIV/>');
            info.css({
              'height' : img.height - 10,
              'padding' : 5
            });
            info.addClass('info');
            info.html(capitalize(val.title[0]));
            $(wrapper).append(info);            
            $(fragment).append(wrapper);
          };
          img.src = source;
        }
      });
      
      //single injection in the DOM causing less reflow
      var itemsInjected = 0;
      var timer = setInterval(function(){
        //console.log(itemsInjected,len);
        if( itemsInjected === len ){
          clearInterval(timer);
          return;
        }
        else{
          //console.info('Items in DOM: ', fragment.childNodes.length);
          itemsInjected += (fragment.childNodes.length - itemsInjected);
					container.append(fragment);
          //animate being called only on the new elements
          $(fragment).children().animate({
            opacity:1
          },1000);
          
          if(fetching){
            fetching = false;
            loadingDiv.hide();
          }
        }
      },500);
      //setTimeout(doMasonry,100);
      
      // taking too long to fetch and insert images. time it out for poor browsers.
      setTimeout(function(){
        clearInterval(timer);
      },5000);
    };
    
    fn(data);
    responseHandler = fn;
  }
  
  var e  = new ebay({
    appId: 'eBayb653a-8240-4cf1-9b3c-715b5b09f55',
    callback: responseHandler
  });

  return {
		init:function(){
			container = $('#box');
		},
    doQuery:function(keywords){
      e.searchByKeywords(keywords);
      fetching = true;
      query = keywords;
    }
  };
})();

$(document).ready(function(){
	$('#search').submit(function(){
		$('#searchcontainer').animate({
			marginTop: '50',
		});
		comicBooksBrowser.init();
		comicBooksBrowser.doQuery($('#query').val());
		$('.arrowup').show();
		$('#box').show();
		return false;
	});
});