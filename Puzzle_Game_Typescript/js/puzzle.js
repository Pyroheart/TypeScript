var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var pieces = [];
var start;
var end;
var img = new Image();
var fileInput = document.getElementById('file-input');
var checkEarly = document.getElementById('ReStart');
checkEarly === null || checkEarly === void 0 ? void 0 : checkEarly.addEventListener('click', function (event) {
    if ((fileInput === null || fileInput === void 0 ? void 0 : fileInput.files.length) > 0) {
        var file = fileInput === null || fileInput === void 0 ? void 0 : fileInput.files[0];
        var reader_1 = new FileReader();
        reader_1.readAsDataURL(file);
        reader_1.onload = function () {
            img.crossOrigin = "Anonymous";
            img.src = reader_1.result;
        };
    }
    else {
        img.crossOrigin = "Anonymous";
        img.src = 'https://cloudinary-marketing-res.cloudinary.com/image/upload/f_auto,q_auto/v1667313676/website_2021/Guess_iPhone2';
    }
});
img.onload = function () {
    var canvasRatio = canvas.width / canvas.height;
    var imgRatio = img.width / img.height;
    var width, height, x, y;
    if (imgRatio > canvasRatio * (2 / 3)) {
        width = canvas.width * (2 / 3);
        height = width / imgRatio;
    }
    else {
        height = canvas.height;
        width = height * imgRatio;
    }
    x = (canvas.width - width) / 2;
    y = (canvas.height - height) / 2;
    ctx.drawImage(img, x, y, width, height);
    restart(height, width, img);
};
function shuffle(array) {
    var currentIndex = array.length;
    var temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    drawPieces();
    return array;
}
function drawPieces() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < pieces.length; i++) {
        var piece = pieces[i];
        if (!piece.solved) {
            ctx.strokeRect(piece.imageX, piece.imageY, piece.width, piece.height);
            ctx.drawImage(piece.image, piece.imageX, piece.imageY, piece.width, piece.height, piece.x, piece.y, piece.width, piece.height);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.strokeRect(piece.x, piece.y, piece.width, piece.height);
        }
    }
}
function initPieces(rows, cols, newWidth, newHeight, resizedImg) {
    pieces.length = 0;
    var pieceWidth = newWidth / cols;
    var pieceHeight = newHeight / rows;
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var piece = {
                imageX: j * pieceWidth,
                imageY: i * pieceHeight,
                x: Math.random() * (canvas.width - pieceWidth),
                y: Math.random() * (canvas.height - pieceHeight),
                width: pieceWidth,
                height: pieceHeight,
                image: resizedImg,
                solved: false
            };
            pieces.push(piece);
        }
    }
    pieces = shuffle(pieces);
    drawPieces();
    start = new Date();
}
function restart(newHeight, newWidth, img) {
    var tempCanvas = document.createElement("canvas");
    var context = tempCanvas.getContext("2d");
    tempCanvas.width = newWidth;
    tempCanvas.height = newHeight;
    context.drawImage(img, 0, 0, newWidth, newHeight);
    var resizedImg = new Image();
    resizedImg.src = tempCanvas.toDataURL();
    var select = document.getElementById('difficulty');
    var difficulty = select.options[select.selectedIndex].value;
    switch (difficulty) {
        case 'easy':
            initPieces(3, 3, newWidth, newHeight, resizedImg);
            break;
        case 'medium':
            initPieces(6, 6, newWidth, newHeight, resizedImg);
            break;
        case 'hard':
            initPieces(9, 9, newWidth, newHeight, resizedImg);
            break;
        case 'testFlemm':
            initPieces(2, 1, newWidth, newHeight, resizedImg);
            break;
    }
    setTimeout(function () {
        drawPieces();
    }, 10);
}
function checkSolved() {
    var tolerance = 5;
    for (var i = 0; i < pieces.length; i++) {
        var piece = pieces[i];
        if (Math.abs(piece.x - piece.imageX) > tolerance || Math.abs(piece.y - piece.imageY) > tolerance) {
            return false;
        }
    }
    return true;
}
var selectedPiece = null;
var offsetX = 0;
var offsetY = 0;
canvas.addEventListener('mousedown', function (e) {
    var mouseX = e.clientX - canvas.offsetLeft;
    var mouseY = e.clientY - canvas.offsetTop;
    for (var i = 0; i < pieces.length; i++) {
        var piece = pieces[i];
        if (mouseX > piece.x && mouseX < piece.x + piece.width && mouseY > piece.y && mouseY < piece.y + piece.height) {
            selectedPiece = piece;
            offsetX = mouseX - piece.x;
            offsetY = mouseY - piece.y;
            break;
        }
    }
});
canvas.addEventListener('mousemove', function (e) {
    if (selectedPiece !== null) {
        selectedPiece.x = e.clientX - canvas.offsetLeft - offsetX;
        selectedPiece.y = e.clientY - canvas.offsetTop - offsetY;
        drawPieces();
    }
});
canvas.addEventListener('mouseup', function (e) {
    if (selectedPiece !== null) {
        selectedPiece = null;
        if (checkSolved()) {
            end = new Date();
            var time = (end.getTime() - start.getTime()) / 60000;
            if (time < 1) {
                var secondTime = (end.getTime() - start.getTime()) / 1000;
                var roundedSecondTime = parseFloat(secondTime.toFixed(1));
                alert("Congratulations! You solved the puzzle in ".concat(roundedSecondTime, " seconds."));
            }
            else {
                var roundedTime = parseFloat(time.toFixed(1));
                alert("Congratulations! You solved the puzzle in ".concat(roundedTime, " minutes."));
            }
        }
    }
});
canvas.addEventListener('touchstart', function (e) {
    var touchX = e.touches[0].clientX - canvas.offsetLeft;
    var touchY = e.touches[0].clientY - canvas.offsetTop;
    for (var i = 0; i < pieces.length; i++) {
        var piece = pieces[i];
        if (touchX > piece.x && touchX < piece.x + piece.width && touchY > piece.y && touchY < piece.y + piece.height) {
            selectedPiece = piece;
            offsetX = touchX - piece.x;
            offsetY = touchY - piece.y;
            break;
        }
    }
});
canvas.addEventListener('touchmove', function (e) {
    if (selectedPiece !== null) {
        selectedPiece.x = e.touches[0].clientX - canvas.offsetLeft - offsetX;
        selectedPiece.y = e.touches[0].clientY - canvas.offsetTop - offsetY;
        drawPieces();
    }
});
canvas.addEventListener('touchend', function (e) {
    if (selectedPiece !== null) {
        selectedPiece = null;
        if (checkSolved()) {
            end = new Date();
            var time = (end.getTime() - start.getTime()) / 60000;
            if (time < 1) {
                var secondTime = (end.getTime() - start.getTime()) / 1000;
                var roundedSecondTime = parseFloat(secondTime.toFixed(1));
                alert("Congratulations! You solved the puzzle in ".concat(roundedSecondTime, " seconds."));
            }
            else {
                var roundedTime = parseFloat(time.toFixed(1));
                alert("Congratulations! You solved the puzzle in ".concat(roundedTime, " minutes."));
            }
        }
    }
});
canvas.addEventListener('touchmove', function (e) {
    e.preventDefault();
});
