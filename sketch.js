//Cria variaveis com 2 estados de jogo
var INICIAL = 1;
var FINAL = 2;
var EstadoJogo = INICIAL;

//Cria variaveis com valores para o Ataque do jogador
var ultimoGolpe;
var atacando;
var direcao;

//Declara a variavel do jogador
var jogador,
  ninjaDireita,
  ninjaEsquerda,
  ninjaParado,
  ninjaAtaqueDireita,
  ninjaAtaqueEsquerda;

//Declara a variavel do fundo e soloInvisivel para a colisao
var fundo, cenario;
var soloInvisivel;

//Declara os inimigos e declara os grupos 
var inimigos, bolaSombra;
var aves, gaviao;

var GrupoInimigos;
var GrupoAves;

//Declara os sons
var som_salto, som_morte, som_ambiente, som_tempo, som_corte;

//Declara a variavel do placar alem do Reiniciar pós fim de jogo
var pontos;
var Morte;
var reset, botao;
var fim, gameover;

function preload() {
  //Carrega as imagens o cenario
  cenario = loadImage("fundo.png");

  //Carrega as imagens as Aves
  gaviao = loadAnimation(
    "ave1.png",
    "ave2.png",
    "ave4.png",
    "ave5.png",
    "ave6.png",
    "ave7.png",
    "ave8.png",
    "ave9.png"
  );

  //Carrega as imagens do Ninja
  ninjaDireita = loadAnimation(
    "ninja1.png",
    "ninja2.png",
    "ninja3.png",
    "ninja4.png",
    "ninja5.png",
    "ninja6.png"
  );
  ninjaEsquerda = loadAnimation(
    "ninja01.png",
    "ninja02.png",
    "ninja03.png",
    "ninja04.png",
    "ninja05.png",
    "ninja06.png"
  );
  ninjaParado = loadAnimation("ninjaparado.png");
  ninjaAtaqueDireita = loadAnimation(
    "atacandoDireita1.png",
    "atacandoDireita2.png"
  );
  ninjaAtaqueEsquerda = loadAnimation(
    "atacandoEsquerda1.png",
    "atacandoEsquerda2.png"
  );

  //Carrega a imagem do Inimigo
  bolaSombra = loadAnimation("bola1.png", "bola2.png");

  //Carrega as imagens do game over e botao
  botao = loadImage("reset.png");
  gameover = loadImage("gameover.png");

  //Carrega os sons do jogo
  som_salto = loadSound("salto.mp3");
  som_morte = loadSound("morte.mp3");
  som_ambiente = loadSound("musicaambiente.mp3");
  som_tempo = loadSound("marcacao.mp3");
  som_corte = loadSound("corte.mp3");
}

function setup() {
  createCanvas(800, 400);

  //Cria o sprite do fundo
  fundo = createSprite(400, 200, 10, 10);
  fundo.addImage(cenario);
  fundo.scale = 0.5;

  //Cria o sprite do jogador
  jogador = createSprite(190, 320, 10, 10);
  jogador.addAnimation("Ninja Esquerda", ninjaEsquerda);
  jogador.scale = 0.5;
  jogador.addAnimation("Ninja Direita", ninjaDireita);
  jogador.scale = 0.5;
  jogador.addAnimation("Ninja Parado", ninjaParado);
  jogador.scale = 0.5;
  jogador.addAnimation("Ninja Ataque Direita", ninjaAtaqueDireita);
  jogador.scale = 0.5;
  jogador.addAnimation("Ninja Ataque Esquerda", ninjaAtaqueEsquerda);
  jogador.scale = 0.5;
  jogador.setCollider("rectangle", 0, 30, 60, 180);
  jogador.debug = false;

  //Cria o sprite do soloInvisivel
  soloInvisivel = createSprite(400, 350, 800, 50);
  soloInvisivel.visible = false;

  //Da valor inicial aos pontos
  pontos = 0;

  //Cria o sprite do botao
  reset = createSprite(400, 200, 20, 20);
  reset.addImage(botao);
  reset.scale = 0.4;
  reset.visible = false;

  //Cria o sprite do GameOver
  fim = createSprite(400, 150, 20, 20);
  fim.addImage(gameover);
  fim.scale = 1.5;
  fim.visible = false;

  //Cria os grupos
  GrupoInimigos = createGroup();
  GrupoAves = createGroup();

  //Da valor ao ataque do jogador e relata seu ultimo
  ultimoGolpe = millis();
  atacando = false;
  direcao = "direita";

  //Chama o som de fundo do jogo
  som_ambiente.play();
}

function draw() {
  background(220);

  //Cria um if de estado de jogo Inicial
  if (EstadoJogo === INICIAL) {
    fim.visible = false;
    reset.visible = false;

    //Comando de movimento do jogador
    if (!atacando) {
      if (keyDown("a")) {
        jogador.velocityX = -7;
        jogador.changeAnimation("Ninja Esquerda", ninjaEsquerda);
        direcao = "esquerda";
      } else if (keyDown("d")) {
        jogador.velocityX = 7;
        jogador.changeAnimation("Ninja Direita", ninjaDireita);
        direcao = "direita";
      } else {
        jogador.velocityX = 0;
        jogador.changeAnimation("Ninja Parado", ninjaParado);
      }
    }

    if (keyDown("space") && jogador.y >= 250) {
      jogador.velocityY = -24;
      som_salto.play();
    }

    //Comando de Ataque do jogador
    if (millis() - ultimoGolpe > 200) {
      atacando = false;

      if (keyDown("e") && direcao == "direita") {
        jogador.changeAnimation("Ninja Ataque Direita", ninjaAtaqueDireita);
        ultimoGolpe = millis();
        atacando = true;
        som_corte.play();
      }

      if (keyDown("e") && direcao == "esquerda") {
        jogador.changeAnimation("Ninja Ataque Esquerda", ninjaAtaqueEsquerda);
        ultimoGolpe = millis();
        atacando = true;
        som_corte.play();
      }

      //Condiçao do jogador encostar nos inimigos
      if (jogador.isTouching(GrupoInimigos) && atacando === true) {
        pontos = pontos + 100;
        inimigos.destroy();
      } else if (jogador.isTouching(GrupoInimigos)) {
        EstadoJogo = FINAL;
        som_ambiente.stop();
        som_morte.play();
      }

      //Condiçao do jogador encostar nas Aves
      if (jogador.isTouching(GrupoAves) && atacando === true) {
        pontos = pontos + 100;
        aves.destroy();
      } else if (jogador.isTouching(GrupoAves)) {
        EstadoJogo = FINAL;
        som_morte.play();
        som_ambiente.stop();
      }
    }

    //Chama a funçao
    Inimigos();
    
    //Cria um if de estado de jogo Final
  } else if (EstadoJogo === FINAL) {
    jogador.velocityX = 0;

    GrupoInimigos.setVelocityXEach(0);
    GrupoAves.setVelocityXEach(0);

    GrupoInimigos.setLifetimeEach(-1);
    GrupoAves.setLifetimeEach(-1);

    reset.visible = true;
    fim.visible = true;

    //Condiçao de click no botao
    if (mousePressedOver(reset)) {
      Reset();
    }
  }

  //Gravidade do jogador
  jogador.velocityY = jogador.velocityY + 2;

  //Adiciona colisao ao soloInvisivel
  jogador.collide(soloInvisivel);

  //Cria os limites de bordas
  edges = createEdgeSprites();
  jogador.collide(edges);

  //Desenha na tela
  drawSprites();

  //Chama o texto de Placar
  textSize(28);
  fill("black");
  text(" Score: " + pontos, 20, 50);
  
  //Chama o texto de botoes
  textSize(16);
  fill("black");
  text("E Atack", 670, 30);
  textSize(16);
  fill("black");
  text("A - D Moviment", 670, 50);
  textSize(16);
  fill("black");
  text("Space Jump", 670, 70);
  
  
}

function Inimigos() {
  //Cria de forma aleatoria os Inimigos e as Aves
  var aleatoria = Math.round(random(1, 4));
  switch (aleatoria) {
    case 1:
      if (frameCount % 100 === 0) {
        inimigos = createSprite(810, 310, 15, 15);
        inimigos.addAnimation("Sombras", bolaSombra);
        inimigos.scale = 0.05;
        inimigos.velocityX = -(8 + pontos / 100);
        inimigos.setCollider("circle", 0, 0, 400);
        inimigos.debug = false;
        GrupoInimigos.add(inimigos);
        inimigos.lifetime = 200;
      }
      break;

    case 2:
      if (frameCount % 60 === 0) {
        inimigos = createSprite(810, 310, 15, 15);
        inimigos.addAnimation("Sombras", bolaSombra);
        inimigos.scale = 0.05;
        inimigos.velocityX = -(6 + pontos / 100);
        inimigos.setCollider("circle", 0, 0, 400);
        inimigos.debug = false;
        GrupoInimigos.add(inimigos);
        inimigos.lifetime = 200;
      }
      break;

    case 3:
      if (frameCount % 100 === 0) {
        aves = createSprite(810, 200, 15, 15);
        aves.addAnimation("Passaro", gaviao);
        aves.velocityX = -(8 + pontos / 100);
        aves.setCollider("rectangle", -10, 10, 50, 10);
        aves.debug = false;
        GrupoAves.add(aves);
        aves.lifetime = 200;
      }
      break;

    case 4:
      if (frameCount % 60 === 0) {
        aves = createSprite(810, 150, 15, 15);
        aves.addAnimation("Passaro", gaviao);
        aves.velocityX = -(6 + pontos / 100);
        aves.setCollider("rectangle", -10, 10, 50, 10);
        aves.debug = false;
        GrupoAves.add(aves);
        aves.lifetime = 200;
      }
      break;

    default:
      break;
  }
}

function Reset() {
  //Condiçao para reiniciar o jogo depois que atinge seu estado Final
  EstadoJogo = INICIAL;
  jogador.x = 190;
  jogador.y = 320;
  pontos = 0;
  GrupoInimigos.destroyEach();
  GrupoAves.destroyEach();
}
