document.addEventListener("DOMContentLoaded", function() {
    var lazyloadImages = document.querySelectorAll("img.lazy");    
    var lazyloadThrottleTimeout;
    
    function lazyload () {
      if(lazyloadThrottleTimeout) {
        clearTimeout(lazyloadThrottleTimeout);
      }    
      
      lazyloadThrottleTimeout = setTimeout(function() {
          var scrollTop = window.pageYOffset;
          lazyloadImages.forEach(function(img) {
              if(img.offsetTop < (window.innerHeight + scrollTop)) {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
              }
          });
          if(lazyloadImages.length == 0) { 
            document.removeEventListener("scroll", lazyload);
            window.removeEventListener("resize", lazyload);
            window.removeEventListener("orientationChange", lazyload);
          }
      }, 20);
    }
    
    document.addEventListener("scroll", lazyload);
    window.addEventListener("resize", lazyload);
    window.addEventListener("orientationChange", lazyload);
  });
        // contact https://chienhsiang-hung.github.io/ if you have any questions 

$(function () {
    var mediumPromise = new Promise(function (resolve) {
        var $content = $('#jsonContent');
        var data = {rss: 'https://medium.com/feed/@cryptosixxx'};

        // use http://jsonviewer.stack.hu/ to check json file easier
        $.get(
            'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2F%40cryptosixxx',
            data,
            function (response) {
                if (response.status == 'ok') {
                    var display = '';
                    $.each(
                        response.items,
                        function (k, item) {
                            display += `<div class="card medium-card mb-3 mx-auto mr-5" style="width: 20rem;">`;
                            var src = item["thumbnail"]; // use thumbnail url
                            display += `  <span>
                                            <img data-src="${src}" class="card-img-top lazy" loading="lazy"  alt="Cover image">
                                          </span>`;
                            display += `  <div class="card-body">`;
                            display += `    <h5 class="card-title">${item.title}</h5>`;
                            
                            // add categories
                            display += '    <p>'
                            var categories = item["categories"];
							for (var i=0; i<categories.length; i++){
                            	display += `  <a href="#"><i>#${categories[i]}</i></a> &nbsp;`
                            }
							display += '    </p>'
                            
                            display += `    <a href="${item.link}" target="_blank" class="btn btn-outline-success" >Read More</a>`;
                            display += `  </div>
                                        </div>`;
                            return k < 10;
                        }
                    );
                    resolve($content.html(display));
                }
            }
        );
    });
    
    mediumPromise.then(function() {
        //Pagination
        pageSize = 3;
        var pageCount = $(".medium-card").length / pageSize;
        for (var i = 0; i < pageCount; i++) {
            $("#pagin").append(`<a class="page-link" href="#">${(i + 1)}</a>`);
        }

        $("#pagin a:nth-child(1)").addClass("active");
        showPage = function (page) {
            $(".medium-card").hide();
            $(".medium-card").each(function (n) {
                if (n >= pageSize * (page - 1) && n < pageSize * page)
                    $(this).show();
            });
        }

        showPage(1);

        $("#pagin a").click(function () {
            $("#pagin a").removeClass("active");
            $(this).addClass("active");
            showPage(parseInt($(this).text()))
            return false;
        });
    });
  
});

