// canvas 객체 생성
var canvas = $('#canvas')[0];
var ctx = canvas.getContext('2d');

function drawImageData(image) {
    image.height *= canvas.offsetWidth / image.width;
    image.width = canvas.offsetWidth;

    if (image.height > canvas.offsetHeight) {
        image.width *= canvas.offsetHeight / image.height;
        image.height = canvas.offsetHeight;
    }

    ctx.drawImage(image, 0, 0, image.width, image.height);
    console.log(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

// click input button
$('#loadButton').on('change', function(e) {
    var file = e.target.files[0];
    var fileReader = new FileReader();

    fileReader.onload = function(e) {
        var image = new Image();
        image.src = e.target.result;
        image.onload = function() {
            drawImageData(image);
        }
    };

    fileReader.readAsDataURL(file);
});

$('#invertButton').on('click', function() {
    var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var filteredData = invertFilter(pixels);
    ctx.putImageData(filteredData, 0, 0);
});

$('#grayscaleButton').on('click', function() {
    var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var filteredData = grayscaleFilter(pixels);
    ctx.putImageData(filteredData, 0, 0);
});

$('#brightnessButton').on('click', function() {
    var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var filteredData = brightnessFilter(pixels, 100);
    ctx.putImageData(filteredData, 0, 0);
});

$('#sepiaButton').on('click', function() {
    var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var filteredData = sepiaFilter(pixels);
    ctx.putImageData(filteredData, 0, 0);
});


// Filter Format
function somethingFilter(pixels) {
    var d = pixels.data;

    // image processing logic

    return pixels;
}

// Filters
function invertFilter(pixels) {
    var d = pixels.data;
    for (var i = 0; i < pixels.data.length; i += 4) {
        d[i] = 255 - d[i]; // R
        d[i + 1] = 255 - d[i + 1]; // G
        d[i + 2] = 255 - d[i + 2]; // B
        d[i + 3] = 255; // Alpha
    }
    return pixels;
}

function brightnessFilter(pixels, value) {
    var d = pixels.data;
    for (var i = 0; i < d.length; i += 4) {
        d[i] += value / 3;
        d[i + 1] += value / 3;
        d[i + 2] += value / 3;
    }
    return pixels;
}

function grayscaleFilter(pixels) {
    var d = pixels.data;
    for (var i = 0; i < d.length; i += 4) {
        var r = d[i];
        var g = d[i + 1];
        var b = d[i + 2];
        // 흑백값을 더 밝게 만들기 위해 0.6을 더해준다.
        var v = 0.2126 * r + 0.7152 * g + 0.0722 * b; // 보정값 변경
        d[i] = d[i + 1] = d[i + 2] = v + 10; // RBG 색을 같게 맞추고, 적절한 값을 더하여 회색 느낌을 살려준다.
    }
    return pixels;
}


function sepiaFilter(pixels) {
    var d = pixels.data;
    for (var i = 0; i < d.length; i += 4) {
        var r = d[i];
        var g = d[i + 1];
        var b = d[i + 2];

        d[i] = r * 0.3588 + g * 0.7044 + b * 0.1368;
        d[i + 1] = r * 0.2990 + g * 0.5870 + b * 0.1140;
        d[i + 2] = r * 0.2392 + g * 0.4696 + b * 0.0912;
    }
    return pixels;
}