// 游戏所需变量
// 这些变量将在初始化游戏时定义
var puzzle;            // 游戏操作区域div
var blankPiece;        // 游戏空白图块
var allPuzzlePieces;   // 所有游戏图块数组
var won;               // 胜利信息div

/**
 * 绑定事件
 */
function addEvent(obj, type, fn, cap) {
    if (obj.attachEvent) {
        obj.attachEvent("on" + type, fn);
    } else {
        obj.addEventListener(type, fn, cap);
    }
}

/**
 * 移除事件
 */
function remEvent(obj, type, fn, cap) {
    if (obj.detachEvent) {
        obj.detachEvent("on" + type, fn);
    } else {
        obj.removeEventListener(type, fn, cap);
    }
}

/**
 * 生成随机数组
 */
function randomize(array) {
    for (var j, x, i = array.length - 1; i; j = parseInt(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x) {};
    return array;
}

/**
 * 判断游戏是否获胜
 */
function hasWon() {
    for (var i = 0; i < allPuzzlePieces.length - 1; i++) {
        if (allPuzzlePieces[i].id != i) {
            return false;
        }
    }

    return true;
}

/**
 * 隐藏胜利信息
 */
function hideWonMessage(e) {
    // 隐藏胜利信息
    won.style.bottom = '';
    remEvent(won, "click", hideWonMessage, false);
}

/**
 * 移动图块
 */
function movePieces(aPiece) {
    // 移动图块到空白图块的位置
    var blankPieceTop = blankPiece.style.top;
    var blankPieceLeft = blankPiece.style.left;

    blankPiece.style.top = aPiece.style.top;
    blankPiece.style.left = aPiece.style.left;

    aPiece.style.top = blankPieceTop;
    aPiece.style.left = blankPieceLeft;

    // 更新数组中图块的位置
    var temp = allPuzzlePieces.indexOf(aPiece);
    allPuzzlePieces[allPuzzlePieces.indexOf(blankPiece)] = aPiece;
    allPuzzlePieces[temp] = blankPiece;
}

/**
 * 判断点击的图块是否能被移动
 * 也就是判断点击的图块是否在空白图块旁边
 */
function isValid(aPiece) {
    var top = parseInt(aPiece.style.top, 10);
    var left = parseInt(aPiece.style.left, 10);

    var blankTop = parseInt(blankPiece.style.top, 10);
    var blankLeft = parseInt(blankPiece.style.left, 10);

    var diffTop = Math.abs(blankTop - top);
    var diffLeft = Math.abs(blankLeft - left);

    // 图块的宽度和高度都是135
    if ((diffTop === 0 && diffLeft === 135) || (diffTop === 135 && diffLeft === 0)) {
        return true;
    }

    return false;
}

/**
 * 点击图块
 */
function clickPiece(e) {
    var evt = e || window.event;
    var obj = evt.target || evt.srcElement;

    if (isValid(obj)) { // 判断点击的图块是否能被移动
        movePieces(obj); // 移动图块
        if (hasWon()) { // 判断游戏是否胜利
            won = document.getElementById("won");
            won.style.bottom = '50%';

            // 游戏胜利，移除点击图块事件
            remEvent(puzzle, "click", clickPiece, false);
            // 绑定隐藏胜利信息函数到div#won
            // 这样点击胜利信息就会隐藏它
            addEvent(won, "click", hideWonMessage, false);
        }
    }
}

/**
 * 切割图片为图块
 */
function createPuzzle(img) {
    // 加载完整拼图预览区域
    var preview = document.getElementById("preview");
    preview.style.background = "white";
    preview.innerHTML = "<h2>全图预览：</h2><img src='" + img + "'>";
    preview.innerHTML += "<div id='rules'><p>玩法：</p><ol><li>点击拼图中空白旁边的图块来移动图块。</li>" +
                         "<li>使图片与左边的预览图相同。</li><li>完成后点击选择另一个图片。</li></ol></div>";

    // 清空游戏操作区域
    puzzle.innerHTML = "";

    var counter = 0;
    allPuzzlePieces = [];

    // 创建16个图块
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var puzzlePiece = document.createElement("div");

            // 设置上坐标和左坐标
            var top = 135 * i;
            var left = 135 * j;

            puzzlePiece.style.top = top + "px";
            puzzlePiece.style.left = left + "px";

            // 设置 class            
            puzzlePiece.className = "puzzlePiece";

            if (counter != 15) {
                // 设置id，用于判断游戏是否胜利
                puzzlePiece.id = counter;

                // 设置背景图片和背景图片的x, y坐标
                var posY = -top;
                var posX = -left;

                puzzlePiece.style.backgroundImage = "url('" + img + "')";
                puzzlePiece.style.backgroundPosition = posX + "px " + posY + "px";
            } else {
                // 这是最后一个图块
                // 即空白图块
                blankPiece = puzzlePiece;
                blankPiece.className += " blankPiece";
            }

            // 按id从小到大顺序添加图块到数组
            allPuzzlePieces[counter++] = puzzlePiece;

            // 添加图块到游戏操作区域
            puzzle.appendChild(puzzlePiece);
        }
    }

    // 对allPuzzlePieces数组中的元素进行随机化处理
    var randomizedArray = randomize(allPuzzlePieces);
    counter = 0;
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var puzzlePiece = randomizedArray[counter++];

            // 设置坐标
            var top = 135 * i;
            var left = 135 * j;

            puzzlePiece.style.top = top + "px";
            puzzlePiece.style.left = left + "px";
        }
    }

    // 为图块绑定点击事件
    addEvent(puzzle, "click", clickPiece, false);
}

/**
 * 初始化游戏
 */
function init() {
    // 游戏标题滑动效果
    var sliding = document.getElementsByTagName("span");
    setTimeout(function() {
        for (var i = 0; i < sliding.length; i++) {
            sliding[0].style.fontStyle = "italic";
            sliding[i].style.left = '0';
        }
    }, 500);

    puzzle = document.getElementById("puzzle");

    // 创建游戏
    createPuzzle('http://anything-about-doc.qiniudn.com/javascript-puzzle/1.jpg');
}

// 运行游戏
window.onload = init;