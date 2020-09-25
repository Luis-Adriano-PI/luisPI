(function() {
    var cnv = document.querySelector("canvas");
    var ctx = cnv.getContext("2d");

    var WIDTH = cnv.width, HEIGHT = cnv.height;

    var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
    var mvLeft = mvUp = mvRight = mvDown = false;

    var tileSize = 32;

    var paredes = [];

    var player = {
        x: tileSize + 2, 
        y: tileSize + 2,
        width: 28,
        height: 28,
        speed: 2
    }

    var labirinto = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,1,0,1,0,1,0,1,0,0,0,1,0,0,0,0,1],
        [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,0,1,1,1],
        [1,0,1,0,0,0,1,0,1,0,1,0,1,0,0,0,0,1,0,1],
        [1,0,0,0,0,0,0,0,1,0,0,0,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,1,1,1,0,1,0,1,0,0,1,0,1,0,1],
        [1,1,1,0,0,0,1,0,0,0,1,0,1,0,0,1,0,1,0,1],
        [1,0,1,1,1,1,1,1,1,0,1,1,1,0,0,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,0,1,1,1,0,1,0,0,0,0,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0,0,0,1],
        [1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,0,0,1],
        [1,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0,1,0,0,1],
        [1,0,0,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1]
    ];

    for(var linha in labirinto) {
        for(var coluna in labirinto[linha]) {
            var tile = labirinto[linha][coluna];
            if(tile == 1) {
                var parede = {
                    x: tileSize*coluna,
                    y: tileSize*linha,
                    width: tileSize,
                    height: tileSize
                };
                paredes.push(parede);
            }
        }
    }

    function blockRetangle(objA, objB) {
        var distX = (objA.x + objA.width/2) - (objB.x + objB.width/2);
        var distY = (objA.y + objA.height/2) - (objB.y + objB.height/2);

        var somaWidth = (objA.width + objB.width)/2;
        var somaHeight = (objA.height + objB.height)/2;
        
        if(Math.abs(distX) < somaWidth && Math.abs(distY) < somaHeight) {
            var overlapX = somaWidth - Math.abs(distX);
            var overlapY = somaHeight - Math.abs(distY);

            if(overlapX > overlapY) {
                objA.y = distY > 0 ? objA.y + overlapY : objA.y - overlapY;
            } else {
                objA.x = distX > 0 ? objA.x + overlapX : objA.x - overlapX;
            }
        }
    }

    window.addEventListener("keydown", keydownHandler, false);
    window.addEventListener("keyup", keyupHandler, false);

    function keydownHandler(e) {
        var key = e.keyCode;
        switch(key) {
            case LEFT:
                mvLeft = true;
                break;
            case UP: 
                mvUp = true;
                break;
            case RIGHT:
                mvRight = true;
                break;
            case DOWN:
                mvDown = true;
                break;
        }
    }

    function keyupHandler(e) {
        var key = e.keyCode;
        switch(key) {
            case LEFT:
                mvLeft = false;
                break;
            case UP: 
                mvUp = false;
                break;
            case RIGHT:
                mvRight = false;
                break;
            case DOWN:
                mvDown = false;
                break;
        }
    }

    function update() {
        if(mvLeft && !mvRight) {
            player.x -= player.speed;
        } else if(mvRight && !mvLeft) {
            player.x += player.speed;
        }
        if(mvUp && !mvDown) {
            player.y -= player.speed;
        }else if(mvDown && !mvUp) {
            player.y += player.speed;
        }

        for(var i in paredes) {
            var parede = paredes[i];
            blockRetangle(player, parede);
        }
    }

    function renderizacao() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.save();
        for(var linha in labirinto) {
            for(var coluna in labirinto[linha]) {
                var tile = labirinto[linha][coluna];
                if(tile == 1) {
                    var x = coluna*tileSize;
                    var y = linha*tileSize;
                    ctx.fillRect(x, y, tileSize, tileSize);
                }
            }
        }

        ctx.fillStyle = "#00f";
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.restore();
    }
    
    function loop() {
        update();
        renderizacao();
        requestAnimationFrame(loop, cnv);
    }
    requestAnimationFrame(loop, cnv);
}());