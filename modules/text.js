export function makeSprite(text, color, points) {
  var canvas, texture, context, textWidth;

  var pad = points * 0.5;

  canvas = d3.select("body").append("canvas")
    .style("display", "none");

  context = canvas.node().getContext("2d");
  context.font = "normal " + points + "pt helvetica";

  textWidth = context.measureText(text).width + pad;
  canvas.attr({width: textWidth, height: points + pad});

  context.font = "normal " + points + "pt helvetica";
  context.textAlign    = "center";
  context.textBaseline = "middle";
  context.fillStyle    = color;
  context.fillText(text, textWidth / 2, (points + pad) / 2);
  
  texture = new THREE.Texture(canvas.node());
  texture.needsUpdate = true;

  canvas.remove();

  return { 
    map: texture, 
    width: textWidth, 
    height: points + pad
  };
}

export function wrapText(text, color, points, maxWidth) {

  text = text.length > 140 ? text.slice(0,140) + "...": text;

  var canvas = d3.select("body").append("canvas")
    .style("display", "none");

  var texture, context;
  var testLine, testWidth;

  var pad = points * 0.5;
  var lineHeight = points + pad;

  var total = lineHeight;

  canvas.attr({
    width: maxWidth + (pad * 2)
  });

  context = canvas.node().getContext("2d");
  context.font = "normal normal " + points + "px helvetica, arial";

  var line  = "", lines = [], words = text.split(" ");

  for(var n = 0; n < words.length; n++) {

    testLine  = line + words[n] + " ";
    testWidth = context.measureText(testLine).width;

    if (testWidth > maxWidth) {
      lines.push([line, pad, total]);
      line = words[n] + " ";
      total += lineHeight;
    } else {
      line = testLine;
    }
  }

  lines.push([line, pad, total]);

  canvas.attr({ // RESIZE THEN DRAW
    height: total + 50
  });

  context = canvas.node().getContext("2d");
  context.fillStyle = color; 
  context.font = "normal normal " + points + "px helvetica, arial";
  context.textBaseline = 'bottom';
  context.textAlign = 'left';
  context.globalAlpha = '1';
  context.shadowColor = '#787878';
  context.shadowBlur = '3';
  context.shadowOffsetX = '1';
  context.shadowOffsetY = '1';

  for (var i = 0; i < lines.length; i++) {
    context.fillText(lines[i][0], lines[i][1], lines[i][2]);
  }

  texture = new THREE.Texture(canvas.node());
  texture.needsUpdate = true;

  // FOR DEBUGGING _ LOADS THE PNG INTO "RESOURCES" IN DEV TOOLS
  // var image = new THREE.ImageUtils.loadTexture(canvas.node().toDataURL());

  canvas.remove();

  return { 
    map: texture, 
    width: maxWidth + (pad * 2), 
    height: total + (pad * 2)
  };
}