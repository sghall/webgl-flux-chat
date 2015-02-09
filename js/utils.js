
export function convertRawMessage(rawMessage, currentThreadID) {
  return {
    id: rawMessage.id,
    threadID: rawMessage.threadID,
    authorName: rawMessage.authorName,
    date: new Date(rawMessage.timestamp),
    text: rawMessage.text,
    isRead: rawMessage.threadID === currentThreadID
  };
}

export var color = SubUnit.cache(10, function (color) {
  return new THREE.MeshPhongMaterial({color: color});
});

export var text = SubUnit.cache(100, wrapText);

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

  canvas.attr({
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

  canvas.remove();

  return { 
    map: texture, 
    width: maxWidth + (pad * 2), 
    height: total + (pad * 2)
  };
}

export var actionTypes = {
  CLICK_THREAD: 'CLICK_THREAD',
  CREATE_MESSAGE: 'CREATE_MESSAGE',
  RECEIVE_RAW_CREATED_MESSAGE: 'RECEIVE_RAW_CREATED_MESSAGE',
  RECEIVE_RAW_MESSAGES: 'RECEIVE_RAW_MESSAGES'
};
