function Mine(tr, td, mineNum) {
    this.tr = tr; 
    this.td = td; 
    this.mineNum = mineNum; 
    this.squares = []; 
    this.tds = []; 
    this.surplusMine = mineNum; 
    this.allRight = false; 
    this.parent = document.querySelector('.gameBox');
}

Mine.prototype.randomNum = function () {
    var square = new Array(this.tr * this.td); 
    for (var i = 0; i < square.length; i++) {
        square[i] = i;
    }

    square.sort(function () {
        return 0.5 - Math.random()
    });
    return square.slice(0, this.mineNum);
};



Mine.prototype.createDom = function () {
    var This = this;
    var table = document.createElement('table');
    for (var i = 0; i < this.tr; i++) { // 行
        var domTr = document.createElement('tr');
        this.tds[i] = [];
        for (var j = 0; j < this.td; j++) { // 列
            var domTd = document.createElement('td');
            this.tds[i][j] = domTd; 
            domTd.pos = [i, j]; 
            domTd.onmousedown = function () {
                This.play(event, this); 
            };


            domTr.appendChild(domTd);
        }
        table.appendChild(domTr);
    }
    this.parent.innerHTML = ''; 

    this.parent.appendChild(table);
};


Mine.prototype.getAround = function (square) {
    var x = square.x,
        y = square.y;
    var result = []; 
    for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
            if (i < 0 ||
                j < 0 ||
                i > this.td - 1 ||
                j > this.tr - 1 ||
     
                (i == x && j == y) ||
    
                this.squares[j][i].type == 'mine'

            ) {
                continue;
            }
   
            result.push([j, i]);
        }
    }
    return result;
}

Mine.prototype.updateNum = function () {
    for (var i = 0; i < this.tr; i++) {
        for (var j = 0; j < this.td; j++) {
            // 要更新的是雷周围的数字
            if (this.squares[i][j].type == 'number') {
                continue;
            }
            var num = this.getAround(this.squares[i][j]); // 获取到每一个雷周围的数字
            for (var k = 0; k < num.length; k++) {
                this.squares[num[k][0]][num[k][1]].value += 1;
            }
        }
    }
};

Mine.prototype.play = function (ev, obj) {
    var This = this;
    if (ev.which == 1 && obj.className != 'flag') { 
        var curSquare = this.squares[obj.pos[0]][obj.pos[1]];
        var cl = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
        // cl 存储className

        if (curSquare.type == 'number') {
            // 用户点击的是数字
            obj.innerHTML = curSquare.value;
            obj.className = cl[curSquare.value];

            if (curSquare.value == 0) {
        

                obj.innerHTML = ''; // 显示为空
                function getAllZero(square) {
                    var around = This.getAround(square); // 
                    for (var i = 0; i < around.length; i++) {
                        var x = around[i][0]; // 行
                        var y = around[i][1]; // 列
                        This.tds[x][y].className = cl[This.squares[x][y].value];

        
                    }

                }
                getAllZero(curSquare);
            }

        } else {
            // 用户点击的是雷
            this.gameOver(obj);
        }
    }
    if (ev.which == 3) {

        if (obj.className && obj.className != 'flag') {
            return;
        }
        obj.className = obj.className == 'flag' ? '' : 'flag';

        if (this.squares[obj.pos[0]][obj.pos[1]].type == 'mine') {
            this.allRight = true;
        } else {
            this.allRight = false;
        }

        if (obj.className == 'flag') {
            this.mineNumDom.innerHTML = --this.surplusMine;
        } else {
            this.mineNumDom.innerHTML = ++this.surplusMine;
        }

        if (this.surplusMine == 0) {
     
            if (this.allRight == true) {
                alert('恭喜你，游戏通过');
                for (i = 0; i < this.tr; i++) {
                    for (j = 0; j < this.td; j++) {
                        this.tds[i][j].onmousedown = null;
                    }
                }

            } else {
                alert('游戏失败');
                this.gameOver();
            }
        }
    }
}

// 游戏失败函数
Mine.prototype.gameOver = function (clickTd) {

    for (i = 0; i < this.tr; i++) {
        for (j = 0; j < this.td; j++) {
            if (this.squares[i][j].type == 'mine') {
                this.tds[i][j].className = 'mine';
            }
            this.tds[i][j].onmousedown = null;
        }
    }
    if (clickTd) {
        clickTd.style.backgroundColor = '#f00';
    }
}



// 添加 button 的功能
var btns = document.getElementsByTagName('button');
var mine = null; // 用来存储生成的实例
var ln = 0; 
    [9, 9, 10],
    [16, 16, 30],
    [20, 28, 50]

for (let i = 0; i < btns.length - 1; i++) {
    btns[i].onclick = function () {
        btns[ln].className = '';
        this.className = 'active';
        mine = new Mine(arr[i][0], arr[i][1], arr[i][2]);
        mine.init();
        ln = i;
    }
}
btns[0].onclick(); // 初始化
btns[3].onclick = function () {
    for (var i = 0; i < btns.length - 1; i++) {
        if (btns[i].className == 'active') {
            btns[i].onclick();
        }
    }
}