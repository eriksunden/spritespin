(function ($, SpriteSpin) {
  "use strict";

  var floor = Math.floor;

  function drawVideoFrame(v,c,w,h) {
    c.drawImage(v,0,0,w,h);
    setTimeout(drawVideoFrame,0,v,c,w,h);
  }

  function drawVideo(data){
    var index = data.lane * data.frames + data.frame;

    // get video from html element
    var video = document.getElementById('video');

    // set current video time
    video.currentTime = index / data.frames;

    if (data.renderer === 'canvas'){
      var w = data.canvas[0].width / data.canvasRatio;
      var h = data.canvas[0].height / data.canvasRatio;
      //data.context.clearRect(0, 0, w, h);
      //data.context.drawImage(video, 0, 0, w, h);
      drawVideoFrame(video, data.context, w, h);
      //data.context.drawImage(data.images[0], 0, 0, 400, 224);
    } else if (data.renderer === 'background') {
      data.stage.css({
        "background-image" : ["url('", data.images[0], "')"].join(""),
        "background-position" : [0, "px ", 0, "px"].join("")
      });
    } else {
      $(data.images).hide();
      $(data.images[0]).show();
    }
  }

  SpriteSpin.registerModule('v360', {

    onLoad: function(e, data){
      var w, h;

      // calculate scaling if we are in responsive mode
      if (data.width && data.frameWidth) {
        data.scaleWidth = data.width / data.frameWidth;
      } else {
        data.scaleWidth = 1;
      }
      if (data.height && data.frameHeight) {
        data.scaleHeight = data.height / data.frameHeight;
      } else {
        data.scaleHeight = 1;
      }

      // clear and enable the stage container
      data.stage.empty().css({ "background-image" : 'none' }).show();

      if (data.renderer === 'canvas')
      {
        var w = data.canvas[0].width / data.canvasRatio;
        var h = data.canvas[0].height / data.canvasRatio;
        data.context.clearRect(0, 0, w, h);
        data.canvas.show();
      }
      else if (data.renderer === 'background')
      {
        // prepare rendering frames as background images
        w = floor(data.frameWidth * data.scaleWidth);
        h = floor(data.frameHeight * data.scaleHeight);
        var background = [w, "px ", h, "px"].join("");

        data.stage.css({
          "background-repeat"   : "no-repeat",
          // set custom background size to enable responsive rendering
          "-webkit-background-size" : background, // Safari 3-4 Chrome 1-3
          "-moz-background-size"    : background, // Firefox 3.6
          "-o-background-size"      : background, // Opera 9.5
          "background-size"         : background  // Chrome, Firefox 4+, IE 9+, Opera, Safari 5+
        });
      }
      else if (data.renderer === 'image')
      {
        // prepare rendering frames as image elements
        w = h = '100%';
        $(data.images).appendTo(data.stage).css({
          width: w,
          height: h,
          position: 'absolute'
        });
      }
    },

    onDraw: function(e, data){
        drawVideo(data);
    }
  });

}(window.jQuery || window.Zepto || window.$, window.SpriteSpin));
