function isMobile() {
  return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4)))
}


(function () {
  var ANIMATE = false;
  var FOOTERHEIGHT;
  var twitterTpl = '<div>{text}</div><div class="meta"><span class="retweet">{retweet}</span><span class="fav">{favs}</span><a href="{url}" target="_blank" class="date">{date}</a></div>';

  function bake(obj, tpl) {
    //todo: better method for templating, maybe concat a full regex and do it without loop
    for (var prop in obj) {
      var t = '{' + prop + '}';
      tpl = tpl.replace(t, obj[prop]);
    }

    return tpl;
  }

  function validate(arr) {
    var emailRgx = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    var data = {};
    var len = arr.length;

    $('input[type=text]').removeClass('error');
    $('textarea').removeClass('error');

    for (var i = 0; i < len; i++) {

      var value = $.trim(arr[i].value);
      var name = arr[i].name;
      data[name] = value;

      if (name === 'name' && value === '') {
        $('#contactform-name').addClass('error');
        return {
          error: true
        };
      }

      if (name === 'email' && value === '' || name === 'email' && !emailRgx.test(value)) {
        $('#contactform-email').addClass('error');
        return {
          error: true
        };
      }

      if (name === 'message' && value === '') {
        $('#contactform-message').addClass('error');
        return {
          error: true
        };
      }
    }

    return data;
  }

  $(document).ready(function () {
    var $e = {
      footer: $('footer'),
      nav: $('nav'),
      navLink: $('nav a'),
      site: $('html, body'),
      menuIcon: $('.tcon'),
      menuBtn: $('#menu-button'),
      bubbleWrap: $('#bubble-wrap'),
      bubble: $('#bubble'),
      avatar: $('#avatar'),
      input: $('input[type=text]'),
      contact: $('#opencontactform'),
      contactform: $('#contactform')
    };

    transformicons.add('.tcon');

    if (!isMobile()) {
      new WOW().init();
    }

    $.ajax({
      method: 'GET',
      url: 'website/twitter/getTweets.php',
      dataType: 'json',

      success: function (data) {
        $e.bubble.html(
          bake(data, twitterTpl)
        );
      },

      error: function () {
        $e.avatar.off();
      }
    });

    $(document).scroll(function () {
      if ($(this).scrollTop() === 0) {
        $e.menuBtn.removeClass('active');
        $e.menuBtn.removeClass('animated bounceIn').addClass('animated bounceOut');
        $('nav').css({
          position: 'absolute'
        }).removeClass('animated fadeOutUp').removeClass('animated fadeInDown');
        $('.tcon').removeClass('tcon-transform');
      } else if ($(this).scrollTop() > 200) {
        $e.menuBtn.removeClass('animated bounceOut').addClass('animated bounceIn');
      }
    });

    $e.contactform.on('submit', function (event) {
      event.preventDefault();
      var data = validate($(this).serializeArray());


      if (!data.error) {
        $(this).addClass('animated bounceOut');

        $.ajax({
          method: 'POST',
          url: 'website/slack/index.php',
          data: data,
          dataType: 'json'
        });

        $(this).animate({
          height: 0
        });

        setTimeout(function () {
          $e.footer.removeClass('contactform');
          $('.contactform-msg').addClass('animated tada');
        }, 1500);
      }
    });

    $e.contact.on('click', function (evnt) {
      evnt.preventDefault();
      $e.footer.addClass('contactform');
    });

    $e.navLink.on('click', function (event) {
      event.preventDefault();
      var section = $(this).data('scroll');

      $e.site.animate({
        scrollTop: $(section).offset().top - 30
      }, 1000);

      $e.menuIcon.removeClass('tcon-transform');
      // try parent
      $e.menuBtn.removeClass('active');

      $e.nav.addClass('animated fadeOutUp');
      setTimeout(function () {
        $e.nav.css({
          position: 'absolute'
        }).removeClass('animated fadeOutUp').removeClass('animated fadeInDown');
      }, 400);
    });

    $e.avatar.on('click', function () {
      if (ANIMATE !== true) {
        if ($e.bubbleWrap.hasClass('animated bounceIn')) {
          ANIMATE = true;

          $e.bubbleWrap.removeClass('animated bounceIn').addClass('animated bounceOut');

          setTimeout(function () {
            ANIMATE = false;
            $e.bubbleWrap.children().css({
              display: 'none'
            });
          }, 500);


        } else {
          ANIMATE = true;

          $e.bubbleWrap.children().css({
            display: 'block'
          });
          $e.bubbleWrap.removeClass('animated bounceOut').addClass('animated bounceIn');

          setTimeout(function () {
            ANIMATE = false;
          }, 1200);
        }
      }
    });

    $e.menuIcon.on('click', function () {
      if (ANIMATE === false) {
        if ($(this).hasClass('tcon-transform')) {
          $(this).parent().addClass('active');

          $e.nav.css({
            position: 'fixed'
          }).removeClass('animated fadeOutUp').addClass('animated fadeInDown');

        } else {
          $(this).parent().removeClass('active');
          $e.nav.addClass('animated fadeOutUp');

          ANIMATE = true;

          setTimeout(function () {
            $('nav').css({
              position: 'absolute'
            }).removeClass('animated fadeOutUp').removeClass('animated fadeInDown');
            ANIMATE = false;
          }, 500);

        }
      }
    });
  });
})();