$(document).ready(function ($) {
  var posicao = 1;
  var turn = 1;
  var selecionado = false;

  const soundList = [
    '1dontmake.mp3',
    '1isthatyourbest.mp3',
    '1weakpathetic.mp3',
    '1youarenothing.mp3',
    '0laugh1.wav',
    '0laugh2.wav',
    '0laugh3.wav',
    '2excellent.wav',
    '2excellent2.wav',
    '2feelthewrath.mp3',
    '2outstanding.wav',
    '2superb.wav',
    '2superb2.mp3',
    '2welldone.wav',
    '2youwilldie.mp3',
  ];

  //testador

  // for (i=0; i < 100; i++ ) {
  //  //Math.floor(Math.random() * (max - min + 1)) + min;
  // // console.log(soundList[Math.floor(Math.random() * 7)]); //option for poweroff/reboot/windows
  //  console.log(soundList[Math.floor(Math.random() * 11 ) + 4]); //option for hyperspin/restart
  // }

  var shaokahnSound = new Howl({ src: ['./build/wav/' + soundList[Math.floor(Math.random() * 7)]] });
  const selection = new Howl({ src: ['./build/wav/selection.wav'] });
  const selected = new Howl({ src: ['./build/wav/selected.wav'] });
  const music = new Howl({
    src: ['./build/wav/mk2_wasteland.wav'],
    autoplay: true,
    loop: true,
    volume: 0.4
  });


  const remote = require('electron').remote;
  document.addEventListener("keydown", function (e) {

    //if($("#element").is(':focus')) {
    if (posicao === 1) {
      if (e.which === 40) {
        selection.play();
        $("#element1").removeClass("bordaPiscante");
        $("#element2").addClass("bordaPiscante");
        // $("#element2").focus();
        posicao = 2;
      } else if (e.which === 39) {
        selection.play();
        $("#element1").removeClass("bordaPiscante");
        $("#element3").addClass("bordaPiscante");
        //  $("#element3").focus();
        posicao = 3;
      } else if (e.which === 49) {
        selected.play();
        animateSelected2();
        delay(function () {
          const { exec } = require('child_process');
          exec('shutdown -s -f -t 00', (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
          });
        }, 4000);
      }

      //} else if($("#element2").is(':focus')) {
    } else if (posicao === 2) {
      if (e.which === 38) {
        selection.play();
        $("#element2").removeClass("bordaPiscante");
        $("#element1").addClass("bordaPiscante");
        //  $("#element").focus();
        posicao = 1;
      } else if (e.which === 39) {
        selection.play();
        $("#element2").removeClass("bordaPiscante");
        $("#element4").addClass("bordaPiscante");
        //   $("#element4").focus();
        posicao = 4;
      } else if (e.which === 49) {
        selected.play();
        animateSelected2();
        delay(function () {
          const { exec } = require('child_process');
          exec('shutdown -r -f -t 00', (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
          });
        }, 4000);


      } else if (e.which === 27 || e.which === 113 || e.which === 13
        || e.which === 9 || e.which === 53 || e.which === 80) {
        selected.play();
        //  Math.floor(Math.random() * (max - min + 1)) + min;
        shaokahnSound = new Howl({ src: ['./build/wav/' + soundList[Math.floor(Math.random() * 11) + 4]] });
        animateSelected2();
        delay(function () {
          runStartupScript();
          findKillExplorerProcess();
          delay(function () { 
            remote.getCurrentWindow().close();
          }, 2000);
        }, 1000);

      }

      //  } else if($("#element3").is(':focus')) {
    } else if (posicao === 3) {
      if (e.which === 40) {
        selection.play();
        $("#element3").removeClass("bordaPiscante");
        $("#element4").addClass("bordaPiscante");
        //  $("#element4").focus();
        posicao = 4;
      } else if (e.which === 37) {
        selection.play();
        $("#element3").removeClass("bordaPiscante");
        $("#element1").addClass("bordaPiscante");
        // $("#element").focus();
        posicao = 1;
      } else if (e.which === 49) {
        selected.play();
        //  Math.floor(Math.random() * (max - min + 1)) + min;
        shaokahnSound = new Howl({ src: ['./build/wav/' + soundList[Math.floor(Math.random() * 11) + 4]] });
        animateSelected2();
        delay(function () {
          abreHyperspin();
          delay(function () {
            remote.getCurrentWindow().close();
          }, 4000);
        }, 1000);
      }


      //  } else if($("#element4").is(':focus')) {
    } else if (posicao === 4) {
      if (e.which === 38) {
        selection.play();
        $("#element4").removeClass("bordaPiscante");
        $("#element3").addClass("bordaPiscante");
        //  $("#element3").focus();
        posicao = 3;
      } else if (e.which === 37) {
        selection.play();
        $("#element4").removeClass("bordaPiscante");
        $("#element2").addClass("bordaPiscante");
        //   $("#element2").focus();
        posicao = 2;
      } else if (e.which === 49) {
        selected.play();
        animateSelected2();
        delay(function () {
          try {
            findOpenExplorerProcess();
          } finally {
            delay(function () {
              remote.getCurrentWindow().close();
            }, 3000);
          }
        }, 1000);

      }
    }

  });


  function runStartupScript() {
    // const execFile = require('child_process').execFile;

    // execFile('c:/Windows/System32/cscript.exe', ['c:/Arcade/Startup/autorun.vbs'], function (err, data) {
    //   if (err) {
    //     console.log(err)
    //   }
    //   else
    //     console.log(data.toString());
    // });

    'use strict';

    const
      spawn = require('child_process').spawnSync,
      vbs = spawn('cscript.exe', ['c:/slave.vbs', 'one']);

    console.log(`stderr: ${vbs.stderr.toString()}`);
    console.log(`stdout: ${vbs.stdout.toString()}`);
    console.log(`status: ${vbs.status}`);

  }


  function abreHyperspin() {
    const { exec } = require('child_process');
    exec('c:/Arcade/FE/HyperSpin/HyperSpin.exe', (error, stdout, stderr) => {
      if (error.code != 1) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
  }

  var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();


  function animateDivers() {
    if (!selecionado) {
      $('#element' + posicao).transition({ 'border-color': '#006700' }, 100).transition({ 'border-color': '#24C72A' }, 100, animateDivers);
    }

  }

  function animateSelected2() {
    selecionado = true;
    if (turn < 6) {
      turn++;
      $('#element' + posicao).transition({ 'background-color': '#FFFFFF', 'border-color': '#006700' }, 60)
        .transition({ 'background-color': 'transparent', 'border-color': '#24C72A' }, 60, animateSelected2);

    } else {
      $('#element' + posicao).addClass("selecionado");
      shaokahnSound.play();
    }

  }

  function abreExplorer() {
    var child = require('child_process').execFile;
    var executablePath = 'C:/Windows/Explorer.EXE';

    child(executablePath, function (err, data) {
      if (err.code != 1) {
        console.error(err);
        return;
      }

      console.log(data.toString());
    });
  }


  function findOpenExplorerProcess() {
    const find = require('find-process');

    find('name', 'explorer')
      .then(function (list) {
        if (list.length === 0) {
          abreExplorer();
        }

      });

  }

  function findKillExplorerProcess() {
    const find = require('find-process');
    const kill  = require('tree-kill');

    find('name', 'explorer')
      .then(function (list) {
        if (list.length > 0) {
          kill(list[0].pid);
        }
      });

  }




  //$("#element").focus();
  animateDivers();
  //animateSelected();
  //$("#element1").addClass( "selecionando" );






});



