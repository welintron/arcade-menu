$(document).ready(function ($) {
  
  var posicao = 1;
  var turn = 1;
  var selecionado = false;
  var operacao = 0;
  var keys = {
    downP2: false,
    startP2: false
};

const remote = require('electron').remote;

  const soundList = [
    '1dontmake.mp3',
    '1isthatyourbest.mp3',
    '1weakpathetic.mp3',
    '1youarenothing.mp3',
    '0laugh1.wav',
    '0laugh2.wav',
    '0laugh3.wav',
    '0toasty.mp3',
    '2excellent.wav',
    '2excellent2.wav',
    '2feelthewrath.mp3',
    '2outstanding.wav',
    '2superb.wav',
    '2superb2.mp3',
    '2welldone.wav',
    '2youwilldie.mp3'
  ];

  //testador

  // for (i=0; i < 100; i++ ) {
  //  //Math.floor(Math.random() * (max - min + 1)) + min;
  //  //console.log(soundList[Math.floor(Math.random() * 8)]); //option for poweroff/reboot/windows
  //  console.log(soundList[Math.floor(Math.random() * 12 ) + 4]); //option for hyperspin/restart
  // }
  $("#toasty").hide();
  $("#dan").hide();

  const soundLog1 =  localStorage.getItem("soundLog1"); 
  const soundLog2 =  localStorage.getItem("soundLog2"); 
  const soundLog3 =  localStorage.getItem("soundLog3"); 
  
  const filteredSoundList = $.grep(soundList, function (n, i) {
    return ( n !== soundLog1 && n !== soundLog2 && n !== soundLog3);
  });

  const soundListDown= $.grep(filteredSoundList, function (n, i) {
    return ( n.substring(0,1) !== '2');
  });

  const soundListUp = $.grep(filteredSoundList, function (n, i) {
    return ( n.substring(0,1) !== '1');
  });
  var shaokahnSound;
  const selection = new Howl({
    src: ['./build/wav/selection.wav']
  });
  const selected = new Howl({
    src: ['./build/wav/selected.wav']
  });

  const toasty = new Howl({
    src: ['./build/wav/0toasty.mp3']
  });

  const choose = new Howl({
    src: ['./build/wav/choosedestiny.mp3'],
    autoplay: true,
  });


  const music = new Howl({
    src: ['./build/wav/mk2_wasteland.wav'],
    autoplay: true,
    loop: true,
    volume: 0.4
  });

  

  function goPowerOff() {
    delay(function () {
      const {
        exec
      } = require('child_process');
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

  function goReboot() {
    delay(function () {
      const {
        exec
      } = require('child_process');
      exec('shutdown -r -f -t 00', (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      });
    }, 4000);
  }

  function goMK2() {
    delay(function () {
      //  $("body").addClass("blackBg");
      findKillExplorerProcess();
      delay(function () {
        runStartupScript();
      }, 2000);
    }, 2000);
  }


  function goHyperspin() {
    delay(function () {
      abreHyperspin();
      delay(function () {
        remote.getCurrentWindow().close();
      }, 4000);
    }, 1000);
  }

  function goWindows() {
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

  function loadShaoKahnSound() {
    var sList = ((operacao == 2 || operacao == 4) ? soundListUp : soundListDown );
    shaokahnSound = new Howl({
      src: ['./build/wav/' + sList[Math.floor(Math.random() * sList.length)]]
    });
  }

  function saveSoundLog() {
    localStorage.setItem('soundLog1', localStorage.getItem("soundLog2"));
    localStorage.setItem('soundLog2', localStorage.getItem("soundLog3"));
    localStorage.setItem('soundLog3', shaokahnSound._src.substring(12,shaokahnSound._src.length));
  }

  document.addEventListener("keyup", function keyUp(e) {
    // reset status of the button 'released' == 'false'

    if (e.which == 70) {
        keys["downP2"] = false;
    } else if (e.which == 50) {
        keys["startP2"] = false;
    }

  });

  document.addEventListener("keydown", function keyDown(e) {

    if (e.which == 70) {
      keys["downP2"] = true;
    } else if (e.which == 50) {
      keys["startP2"] = true;
    }
    if (keys["downP2"] && keys["startP2"]) {
      document.removeEventListener('keydown', keyDown, false); 
      startToasty(keyDown);
      
    } else {

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
          document.removeEventListener('keydown', keyDown, false);
          operacao = 1;
          selected.play();
          loadShaoKahnSound();
          saveSoundLog();
          animateSelected2();
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
        } else if (e.which === 27 || e.which === 113 || e.which === 13 ||
          e.which === 9 || e.which === 53 || e.which === 80) {
          document.removeEventListener('keydown', keyDown, false);
          operacao = 2;
          selected.play();
          loadShaoKahnSound();
          saveSoundLog();
          animateSelected2();

        } else if (e.which === 49) {
          document.removeEventListener('keydown', keyDown, false);
          operacao = 3;
          selected.play();
          //  Math.floor(Math.random() * (max - min + 1)) + min;
          loadShaoKahnSound();
          saveSoundLog();
          animateSelected2();


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
          document.removeEventListener('keydown', keyDown, false);
          operacao = 4;
          selected.play();
          //  Math.floor(Math.random() * (max - min + 1)) + min;
          loadShaoKahnSound();
          saveSoundLog();
          animateSelected2();
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
          document.removeEventListener('keydown', keyDown, false);
          operacao = 5;
          selected.play();
          loadShaoKahnSound();
          saveSoundLog();
          animateSelected2();


        }
      }
    }

  });


  function checkSelection() {
    switch (operacao) {
      case 1:
        goPowerOff();
        break;
      case 2:
        goReboot();
        break;
      case 3:
        goMK2();
        break;
      case 4:
        goHyperspin();
        break;
      case 5:
        goWindows();
        break;
    }

  }


  function runStartupScript() {

    const {
      spawn
    } = require('child_process');

    const child = spawn('cscript.exe', ['c:/Arcade/Startup/autorun.vbs'], {
      detached: true,
      stdio: 'ignore'
    });

    child.unref();
    remote.getCurrentWindow().close();


  }


  function abreHyperspin() {
    const {
      exec
    } = require('child_process');
    exec('c:/Arcade/FE/HyperSpin/HyperSpin.exe', (error, stdout, stderr) => {
      if (error.code !== 1) {
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
      $('#element' + posicao).transition({
        'border-color': '#006700'
      }, 100).transition({
        'border-color': '#24C72A'
      }, 100, animateDivers);
    }

  }

  function animateSelected2() {
    selecionado = true;
    if (turn < 6) {
      turn++;
      $('#element' + posicao).transition({
          'background-color': '#FFFFFF',
          'border-color': '#006700'
        }, 60)
        .transition({
          'background-color': 'transparent',
          'border-color': '#24C72A'
        }, 60, animateSelected2);

    } else {
      $('#element' + posicao).addClass("selecionado");
      if (shaokahnSound._src === './build/wav/0toasty.mp3') {
        startToasty();
      } else {
        shaokahnSound.play();
        checkSelection();
      }

    }

  }

  function abreExplorer() {
    const {
      spawn
    } = require('child_process');

    const child = spawn('C:/Windows/Explorer.EXE', {
      detached: true,
      stdio: 'ignore'
    });

    child.unref();
  }


  function findOpenExplorerProcess() {
    const find = require('find-process');

    find('name', 'Explorer.EXE')
      .then(function (list) {
        if (list.length === 0) {
          find('name', 'explorer')
          .then(function (list2) {
            if (list2.length === 0) {
              abreExplorer();
            }
    
          });
        }

      });

  }

  function killExplorer() {
    const {
      exec
    } = require('child_process');
    exec('taskkill /f /IM explorer.exe', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
  }

  function findKillExplorerProcess() {
    const find = require('find-process');

    find('name', 'Explorer.EXE')
      .then(function (list) {
        if (list.length == 0) {

          find('name', 'explorer')
          .then(function (list2) {
            if (list2.length > 0) {
              killExplorer(); 
            }
          });

        } else {
          killExplorer(); 
        }
      });

  }


  function startToasty(keyDown) {
     $("#toasty").show();
    $('.toasty').transition({
      x: '-150px'
    }).transition({
      x: '150px',
      duration: 800,
      delay: 300
    });


    delay(function () {
      toasty.play();
      delay(function () {
        $("#toasty").hide();
        checkSelection(); 
        document.addEventListener('keydown', keyDown, false);
      }, 1000);
    }, 300);




  }

 
  $('#dan').click(function () {
    startToasty();
  });


  //$("#element").focus();
  animateDivers();

});