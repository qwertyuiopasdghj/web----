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

Mine.prototype.init = function () {
    // this.randomNum();
    var rn = this.randomNum(); 
    var n = -1; 
    for (var i = 0; i < this.tr; i++) {
        this.squares[i] = [];
        for (var j = 0; j < this.td; j++) {
          
            n++;
            if (rn.indexOf(n) != -1) {
                this.squares[i][j] = {
                    type: 'mine',
                    x: j,
                    y: i
                };

            } else {
                this.squares[i][j] = {
                    type: 'number',
                    x: j,
                    y: i,
                    value: 0
                };
            }
        }
    }

    this.updateNum();
    this.createDom();

    this.parent.oncontextmenu = function () {
        return false;
   
    }

    // 剩余雷数
    this.mineNumDom = document.querySelector('.mineNum');
    this.mineNumDom.innerHTML = this.surplusMine;
};

// 创建表格
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
                // 上述表示出边界
                (i == x && j == y) ||
                // 表示循环到自己
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
    if (ev.which == 1 && obj.className != 'flag') { // 后面的条件是为了用户右键之后不能点击

        var curSquare = this.squares[obj.pos[0]][obj.pos[1]];
        var cl = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
 

        if (curSquare.type == 'number') {

            obj.innerHTML = curSquare.value;
            obj.className = cl[curSquare.value];

            if (curSquare.value == 0) {
            

                obj.innerHTML = ''; 
                function getAllZero(square) {
                    var around = This.getAround(square); 
                    for (var i = 0; i < around.length; i++) {
                        var x = around[i][0]; // 行
                        var y = around[i][1]; // 列
                        This.tds[x][y].className = cl[This.squares[x][y].value];

                        if (This.squares[x][y].value == 0) {
                        
                            if (!This.tds[x][y].check) {
    
                                This.tds[x][y].check = true;
                                getAllZero(This.squares[x][y]);
                            }

                        } else {
                         
                            This.tds[x][y].innerHTML = This.squares[x][y].value;
                        }
                    }

                }
                getAllZero(curSquare);
            }

        } else {
   
            this.gameOver(obj);
        }
    }
    if (ev.which == 3) {

        if (obj.className && obj.className != 'flag') {
            return;
        }
        obj.className = obj.className == 'flag' ? '' : 'flag'; // 切换calss 有无

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
            alert("游戏通关！")


        }
    }
}


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
    if("class  =mine"){
        alert("游戏失败！")
        return false;
    }
    }
}

var btns = document.getElementsByTagName('button');
var mine = null; 
var ln = 0; 
var arr = [
    [9, 9, 10],
    [16, 16, 30],
    [20, 28, 50]
]; 
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