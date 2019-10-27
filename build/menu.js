$(document).ready(function ($) {
  var posicao = 2;
  var turn = 1;
  var selecionado = false;
  var shutdown = false;
  var stopCounter = false;
  var cancelType = 1;
  var operacao = 0;
  var keys = {
    downP2: false,
    startP2: false
  };

  const arenaList = [
    'Armory.png',
    'The_tower.png',
    'Dead_pool.png',
    'Goros_lair.png',
    'Khans_arena.png',
    'Kombat_tomb.png',
    'Living_forest.png',
    'Portal.png',
    'The_pit_2.png',
    'Wasteland.png',
  ];

  const arenaLog1 = localStorage.getItem("arenaLog1");
  const arenaLog2 = localStorage.getItem("arenaLog2");
  const arenaLog3 = localStorage.getItem("arenaLog3");

  const filteredArenaList = $.grep(arenaList, function (n, i) {
    return (n !== arenaLog1 && n !== arenaLog2 && n !== arenaLog3);
  });

  const arena = filteredArenaList[Math.floor(Math.random() * filteredArenaList.length)];
  //const arena = arenaList[4]; //testar arena
  $("body").css("background-image", `url(./arenas/${arena})`);
  localStorage.setItem('arenaLog1', localStorage.getItem("arenaLog2"));
  localStorage.setItem('arenaLog2', localStorage.getItem("arenaLog3"));
  localStorage.setItem('arenaLog3', arena);

  const remote = require('electron').remote;

  const soundList = [
    '1dontmake.mp3',
    '1isthatyourbest.mp3',
    '1weakpathetic.mp3',
    '1youarenothing.mp3',
    '1Iwin.wav',
    '1stilltriyngtowin.mp3',
    '1thatwaspathetic.mp3',
    '1youwillneverwin.mp3',
    '1yousuck.mp3',
    '0laugh1.wav',
    '0laugh2.wav',
    '0laugh3.wav',
    '0toasty.mp3',
    '0toasty2.mp3',
    '2crowd.wav',
    '2excellent.wav',
    '2excellent2.wav',
    '2feelthewrath.mp3',
    '2outstanding.wav',
    '2superb.wav',
    '2superb2.mp3',
    '2welldone.wav',
    '2youwilldie.mp3'
  ];

  const charSoundList = [
    'jax.wav',
    'kintaro.wav',
    'liukang.wav',
    'liukang2.wav',
    'raiden.wav',
    'raiden2.wav',
    'scorpion.wav',
    'scorpion2.wav',
    'kunglao.wav',
    'kunglao2.wav',
  ];


  //testador

  /*   for (i=0; i < 100; i++ ) {
     //Math.floor(Math.random() * (max - min + 1)) + min;
     //console.log(soundList[Math.floor(Math.random() * 8)]); //option for poweroff/reboot/windows
     //console.log(soundList[Math.floor(Math.random() * 12 ) + 4]); //option for hyperspin/restart
    // console.log(arenaList[Math.floor(Math.random() * 10)]); //option for hyperspin/restart
    } */


  //limpar contador
  //localStorage.clear(); 

  //  var menu = Math.floor(Math.random() * 2);
  var menu = localStorage.getItem("menu");


  var soundLog1, soundLog2, soundLog3, charSoundLog1, charSoundLog2, charSoundLog3, shaokahnSound;

  function loadSoundList() {

    soundLog1 = localStorage.getItem("soundLog1");
    soundLog2 = localStorage.getItem("soundLog2");
    soundLog3 = localStorage.getItem("soundLog3");

    charSoundLog1 = localStorage.getItem("charSoundLog1");
    charSoundLog2 = localStorage.getItem("charSoundLog2");
    charSoundLog3 = localStorage.getItem("charSoundLog3");

    charSoundsCount = (localStorage.getItem("charSoundsCount") === null ? 0 : localStorage.getItem("charSoundsCount"));

    filteredSoundList = $.grep(soundList, function (n, i) {
      return (n !== soundLog1 && n !== soundLog2 && n !== soundLog3);
    });

    filteredCharSoundList = $.grep(charSoundList, function (n, i) {
      return (n !== charSoundLog1 && n !== charSoundLog2 && n !== charSoundLog3);
    });

    soundListDown = $.grep(filteredSoundList, function (n, i) {
      return (n.substring(0, 1) !== '2');
    });

    soundListUp = $.grep(filteredSoundList, function (n, i) {
      return (n.substring(0, 1) !== '1');
    });
  }

  loadSoundList();

  const selection = new Howl({
    src: ['./build/wav/selection.wav']
  });
  const selected = new Howl({
    src: ['./build/wav/selected.wav']
  });

  const cancel = new Howl({
    src: ['./build/wav/whoa.wav']
  });

  const toasty = new Howl({
    src: ['./build/wav/0toasty.mp3']
  });

  const choose = new Howl({
    src: ['./build/wav/choosedestiny.mp3']
  });


  const music = new Howl({
    src: ['./build/wav/mk2_wasteland.mp3'],
    autoplay: false,
    loop: true,
    volume: 0.4
  });

  const gates = new Howl({
    src: ['./build/wav/menu-mugen3.mp3']
  });

  const musicGates = new Howl({
    src: ['./build/wav/mk2title.mp3'],
    loop: true,
    volume: 1
  });

  var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();

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



  function findKillVlcProcess() {
    const {
      exec
    } = require('child_process');
    const find = require('find-process');

    find('name', 'vlc.exe')
      .then(function (list) {
        if (list.length > 0) {

          exec('taskkill /f /IM vlc.exe', (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
          });

        }
      });

  }


  function runVlcScript(sound) {

    const {
      spawn
    } = require('child_process');

    const script = sound ? 'c:/Arcade/Startup/vlc.vbs' : 'c:/Arcade/Startup/vlcNoSound.vbs';

    const child = spawn('cscript.exe', [script], {
      detached: false,
      stdio: 'ignore'
    });

  }




  function playMenuMusic() {
    const find = require('find-process');
    find('name', 'vlc.exe')
      .then(function (list) {
        if (list.length == 0) {
          delay(function () {
            gates.play();
            runVlcScript(true);
            delay(function () {
              remote.getCurrentWindow().focus();
              delay(function () {
                delay(function () {
                  choose.play();
                  $("#element2").addClass("bordaPiscante");
                  animateDivers();
                  document.addEventListener('keydown', keyDown, false);
                }, 500);
              }, 1300);
            }, 500);

          }, 1600);

        } else {
          delay(function () {
            gates.play();
            runVlcScript(true);
            delay(function () {
              remote.getCurrentWindow().focus();
              delay(function () {
                delay(function () {
                  choose.play();
                  $("#element2").addClass("bordaPiscante");
                  animateDivers();
                  document.addEventListener('keydown', keyDown, false);
                  delay(function () {
                    musicGates.play();
                  }, 2000);
                }, 500);
              }, 1300);
            }, 500);
          }, 1600);
        }
      });

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

  function countDown() {
    var timeleft = 5;
    $("#countdownCenter").text("5");
    $("#countdownCenter").attr('data-text', $("#countdowntimer").text());
    $("#countdowntimer").text("5");
    $("#countdowntimer").attr('data-text', $("#countdowntimer").text());
    document.getElementById("pTop").value = 5;
    var downloadTimer = setInterval(function () {
      if (stopCounter == true) {
        document.getElementById("pTop").value = 5;
        document.getElementById("countdowntimer").textContent = 5;
        document.getElementById("countdownCenter").textContent = 5;
        $("#countdowntimer").attr('data-text', 5);
        $("#countdownCenter").attr('data-text', 5);
        clearInterval(downloadTimer);
        return;
      }

      //   document.getElementById("progressBar").value = 5 - --timeleft;  //barra progressiva
      document.getElementById("pTop").value = --timeleft;
      document.getElementById("countdowntimer").textContent = timeleft;
      document.getElementById("countdownCenter").textContent = timeleft;
      $("#countdowntimer").attr('data-text', timeleft);
      $("#countdownCenter").attr('data-text', timeleft);
      if (timeleft <= 0) {
        $("#pbText").text(operacao == 1 ? "SHUTTING DOWN..." : "RESTARTING OS...");
        $('.bottomText').transition({
          'visibility': 'visible',
          easing: 'snap',
          duration: 1
        });
        $("#pbText").attr('data-text', $("#pbText").text());
        $("#countdowntimer").hide();
        clearInterval(downloadTimer);
        const {
          exec
        } = require('child_process');
        exec(operacao == 1 ? /* 'c:/windows/system32/calc.exe' : 'c:/windows/system32/notepad.exe' */ 'shutdown -s -f -t 00' : 'shutdown -r -f -t 00', (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);
        });
        return;
      }
    }, 1000);
  }

  function startCountDown() {
    document.addEventListener('keydown', keyDown, false);
    if (menu == "default") {
      $(".bordaPiscante").css({
        "display": "none"
      });



    }
    countDown();
    $("#countdown").show();
    $("#progressContent").show();

    $("#pbText").removeClass("pbTextDefault");
    $("#pbText").addClass("pbText");
    $('.bottomText').transition({
      'visibility': 'visible',
      easing: 'snap',
      duration: 1
    });
    if (cancelType == 2 || menu == 'snes') {
      $("#pbText").text(operacao == 1 ? "SHUTDOWN IN " : "RESTART IN ");
      $("#pbText").attr('data-text', $("#pbText").text());
      $("#countdowntimer").show();
      $("#countdownCenter").hide();
      $("#cancel").removeClass("cancelPowerOff");
      $("#cancel").removeClass("cancelRestart");
      $("#cancel").addClass("cancelType1");
    } else {
      $("#countdownCenter").show();
      $("#pbText").text(operacao == 1 ? "SHUTTING DOWN..." : "RESTARTING OS...");
      $("#pbText").attr('data-text', $("#pbText").text());
      $("#cancel").removeClass("cancelType1");
      $("#cancel").removeClass("cancelPowerOff");
      $("#cancel").removeClass("cancelRestart");
      $("#cancel").addClass(operacao == 1 ? "cancelPowerOff" : "cancelRestart");
    }

    $("#cancel").transition({
      'visibility': (menu == 'default' ? 'visible' : 'hidden'),
      easing: 'ease',
      duration: 500
    });

    if (menu == 'snes') {
      $('.bottomText').css({
        "top": "405px"
      });
      $('.countdown').css({
        "top": "402px"
      });
      $('.progressContent').css({
        "top": "405px"
      });
    } else {
      animateCountDown();
    }


  }

  function goPowerOffReboot() {
    shutdown = true;
    stopCounter = false;
    startCountDown();
  }

  function goMK2() {
    findKillExplorerProcess();
    delay(function () {
      findKillVlcProcess();
      delay(function () {
        runStartupScript();
      }, 2000);
    }, 2000);
  }


  function goHyperspin() {
    findKillVlcProcess();
    delay(function () {
      runVlcScript(false);
      abreHyperspin();
      delay(function () {
        remote.getCurrentWindow().close();
      }, 4000);
    }, 1000);
  }


  function goWindows() {
    delay(function () {
      try {
        findKillVlcProcess();
        findOpenExplorerProcess();
      } finally {
        delay(function () {
          remote.getCurrentWindow().close();
        }, 3000);
      }
    }, 1000);
  }

  function startCharAnimations(name) {
    if (name == "shaokahn" && arena == "Khans_arena.png") {
      animateShaoKahn();
    } else {
      var sound = name == 'toasty' ? toasty : shaokahnSound;
      $(`#${name}`).show();
      switch (name) {
        case 'toastypyke':
          $('#toastypyke').transition({
            x: '-140px'
          }).transition({
            x: '140px',
            duration: 800,
            delay: 300
          });
          break;
        case 'liukang':
          $('#liukang').transition({
            x: '-1000px',
            duration: 1300,
            easing: 'linear'
          });
          break;
        case 'raiden':
          $('#raiden').transition({
            x: '950px',
            duration: 1000,
            easing: 'linear'
          });
          break;
        default:
          $(`#${name}`).transition({
            x: '-140px'
          }).transition({
            x: '140px',
            duration: 800,
            delay: 300
          });
      }

      delay(function () {
        sound.play();
        delay(function () {
          $(`#${name}`).hide();

          if (name == 'raiden') {
            $(`#${name}`).css({
              "left": "-218px",
              "transform": ""
            });
          } else if (name == 'liukang') {
            $(`#${name}`).css({
              "left": "512px",
              "transform": ""
            });
          }

          checkSelection();
          document.addEventListener('keydown', keyDown, false);
        }, 1000);
      }, 300);
    }

  }


  function startCharAnimationsTest(name) {
    const sound = new Howl({
      src: ['./build/wav/0toasty2.mp3']
    });
    sound.play();

    $(`#${name}`).show();
    switch (name) {
      case 'toastypyke':
        $('#toastypyke').transition({
          x: '-140px'
        }).transition({
          x: '140px',
          duration: 800,
          delay: 300
        });
        break;
      case 'liukang':
        $('#liukang').transition({
          x: '-1000px',
          duration: 1300,
          easing: 'linear'
        });
        break;
      case 'raiden':
        $('#raiden').transition({
          x: '950px',
          duration: 1000,
          easing: 'linear'
        });
        break;
      default:
        $(`#${name}`).transition({
          x: '-140px'
        }).transition({
          x: '140px',
          duration: 800,
          delay: 300
        });
    }

    delay(function () {
      delay(function () {
        if (name == 'raiden') {
          $(`#${name}`).css({
            "left": "-300px",
            "transform": ""
          });
        } else if (name == 'liukang') {
          $(`#${name}`).css({
            "left": "720px",
            "transform": ""
          });
        }

        document.addEventListener('keydown', keyDown, false);
      }, 1000);
    }, 300);


  }


  function animateSelected() {
    document.removeEventListener('keydown', keyDown, false);
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
        }, 60, animateSelected);

    } else {
      turn = 1;
      $('#element' + posicao).addClass("selecionado");
      var soundFileName = shaokahnSound._src.substring(12, shaokahnSound._src.length);
      switch (soundFileName) {
        case '0toasty.mp3':
          startCharAnimations('toasty');
          break;
        case '0toasty2.mp3':
          startCharAnimations('toastypyke');
          break;
        case 'raiden.wav':
          startCharAnimations('raiden');
          break;
        case 'raiden2.wav':
          startCharAnimations('raidenpyke');
          break;
        case 'liukang.wav':
          startCharAnimations('liukang');
          break;
        case '1Iwin.wav':
          if (menu == "default") {
            startCharAnimations('shaokahn');
            break;
          }
          default:
            shaokahnSound.play();
            checkSelection();
      }

    }

  }

  function animateDivers() {
    if (!selecionado) {
      $('#element' + posicao).transition({
        'border-color': '#007B00' /* '#006700' */
      }, 80).transition({
        'border-color': '#24C72A' /* '#00FF00' */
      }, 80, animateDivers);
    }

  }

  function animateCountDown() {
    $('#countdownCenter').transition({
      'color': '#FFFFFF',
      easing: 'snap',
      duration: 90
    }).transition({
      'color': '#FF0000',
      easing: 'snap',
      duration: 90
    }, animateCountDown);

  }

  function animateShaoKahn() {

    const death = new Howl({
      src: ['./build/wav/death.wav']
    });

    const laugh1 = new Howl({
      src: ['./build/wav/0laugh1.wav'],
    });

    const closefast = new Howl({
      src: ['./build/wav/closefast.mp3'],
    });

    const iwin = new Howl({
      src: ['./build/wav/1Iwin.wav'],
      onend: function () {
        laugh1.play();
      }
    });

    const open = new Howl({
      src: ['./build/wav/open.mp3'],
      onend: function () {
        iwin.play();
      }
    });



    open.play();
    $("#portalLeft").css({
      "right": "0",
      "transform": ""
    });
    $("#portalRight").css({
      "left": "0",
      "transform": ""
    });
    $(".bordaPiscante").css({
      "display": "none"
    });
    $("#countdown").hide();
    $("#progressContent").hide();
    $('.bottomText').transition({
      'visibility': 'hidden',
      easing: 'snap',
      duration: 1
    })
    $('.blocoDireito').transition({
      'background-color': 'transparent',
      easing: 'snap',
      duration: 1
    });
    $('#portalLeft').transition({
        x: '-131px',
        duration: 650,
        easing: 'linear'
      })
      .transition({
        x: '0px',
        duration: 650,
        easing: 'linear',
        delay: 2500
      })
      .transition({
        y: '-2px',
        duration: 50
      })
      .transition({
        y: '4px',
        duration: 100
      })
      .transition({
        y: '-4px',
        duration: 100
      })
      .transition({
        y: '0px',
        duration: 50
      });
    $('#portalRight').transition({
        x: '115px',
        duration: 650,
        easing: 'linear'
      })
      .transition({
        x: '0px',
        duration: 650,
        easing: 'linear',
        delay: 2500
      })
      .transition({
        y: '-2px',
        duration: 50
      })
      .transition({
        y: '4px',
        duration: 100
      })
      .transition({
        y: '-4px',
        duration: 100
      })
      .transition({
        y: '0px',
        duration: 50
      });;

    $("#pbText").text("HAVE A NICE DAY");
    $("#pbText").attr('data-text', $("#pbText").text());
    $('.bottomText').transition({
        'visibility': 'visible',
        delay: 3800,
        easing: 'snap',
        duration: 1
      })
      .transition({
        y: '-2px',
        duration: 50
      })
      .transition({
        y: '4px',
        duration: 100
      })
      .transition({
        y: '-4px',
        duration: 100
      })
      .transition({
        y: '0px',
        duration: 50
      });
    $('.blocoDireito').transition({
      'background-color': '#393839',
      delay: 3755,
      easing: 'snap',
      duration: 1
    });
    delay(function () {
      closefast.play();
      delay(function () {
        death.play();

        delay(function () {
          $(".bordaPiscante").css({
            "display": "inline"
          });
          checkSelection();
          if (operacao == 1 || operacao == 2) {
            document.addEventListener('keydown', keyDown, false);
          }

        }, 300);
      }, 800);
    }, 3000);


  }

  function cancelShutDown(e) {
    if (e.which != 38 && e.which != 40 && e.which != 37 && e.which != 39 &&
      e.which != 82 && e.which != 70 && e.which != 68 && e.which != 71) {
      stopCounter = true;
      $("#cancel").transition({
        'visibility': 'hidden',
        easing: 'snap',
        duration: 1
      });
      $(".bordaPiscante").css({
        "display": "inline"
      });
      $('.bottomText').transition({
        'visibility': (menu == 'default' ? 'visible' : 'hidden'),
        easing: 'snap',
        duration: 1
      });
      if (menu != 'snes') {
        $("#pbText").text("CHOOSE YOUR DESTINY");
        $("#pbText").removeClass("pbText");
        $("#pbText").addClass("pbTextDefault");
        $("#pbText").attr('data-text', $("#pbText").text());
      }



      selecionado = false;
      $("#progressContent").hide();
      $("#countdowntimer").hide();
      $("#countdown").hide();
      $("#element" + posicao).removeClass("selecionado");
      $("#element" + posicao).addClass("bordaPiscante");
      $("pTop").val(0);


      cancel.play();
      shutdown = false;
      operacao = 0;
      animateDivers();
      loadSoundList();
      loadShaoKahnSound();


    }


  }



  function saveSoundLog() {
    localStorage.setItem('soundLog1', localStorage.getItem("soundLog2"));
    localStorage.setItem('soundLog2', localStorage.getItem("soundLog3"));
    localStorage.setItem('soundLog3', shaokahnSound._src.substring(12, shaokahnSound._src.length));
  }

  function saveCharSoundLog() {
    localStorage.setItem('charSoundLog1', localStorage.getItem("charSoundLog2"));
    localStorage.setItem('charSoundLog2', localStorage.getItem("charSoundLog3"));
    localStorage.setItem('charSoundLog3', shaokahnSound._src.substring(12, shaokahnSound._src.length));
  }

  function loadShaoKahnSound() {
    localStorage.setItem('charSoundsCount', (Number(charSoundsCount) + 1));
    if (charSoundsCount % 7 == 0) {
      shaokahnSound = new Howl({
        src: ['./build/wav/' + filteredCharSoundList[Math.floor(Math.random() * filteredCharSoundList.length)]]
      });
      saveCharSoundLog();
    } else {
      var sList = ((operacao == 3 || operacao == 4) ? soundListUp : soundListDown);
      shaokahnSound = new Howl({
        src: ['./build/wav/' + sList[Math.floor(Math.random() * sList.length)]]
        //  src: ['./build/wav/raiden.wav']  // para testar animação
      });
      saveSoundLog();
    }
  }

  function checkSelection() {
    switch (operacao) {
      case 1:
      case 2:
        goPowerOffReboot();
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




  function changeMenu() {
    if (menu == 'snes') {
      menu = 'default';
    } else {
      menu = 'snes';
    }
    localStorage.setItem('menu', menu);
    delay(function () {
      location.reload();
    }, 40);

  }


  document.addEventListener("keyup", function keyUp(e) {
    // reset status of the button 'released' == 'false'

    if (e.which == 70) {
      keys["downP2"] = false;
    } else if (e.which == 50) {
      keys["startP2"] = false;
    }

  });


  function keyDown(e) {
    // startCharAnimationsTest('toastypyke');
    if (e.repeat) {
      return
    }
    if (shutdown) {
      cancelShutDown(e);
    } else {


      if (e.which == 70) {
        keys["downP2"] = true;
      } else if (e.which == 50) {
        keys["startP2"] = true;
      }
      if (keys["downP2"] && keys["startP2"]) {
        cancelType = cancelType == 1 ? 2 : 1;
        startCharAnimations('toasty');
      } else {

        if (e.which === 54) {
          changeMenu();
        } else if (posicao === 1) { //if($("#element").is(':focus')) {
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
            //  document.removeEventListener('keydown', keyDown, false);
            operacao = 1;
            selected.play();
            loadShaoKahnSound();
            animateSelected();
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
            //  document.removeEventListener('keydown', keyDown, false);
            operacao = 2;
            selected.play();
            loadShaoKahnSound();
            animateSelected();

          } else if (e.which === 49) {
            document.removeEventListener('keydown', keyDown, false);
            operacao = 3;

            $("#pbText").text("STARTING MK II...");
            $("#pbText").attr('data-text', $("#pbText").text());

            if (menu == 'snes') {
              $('.bottomText').css({
                "top": "402px"
              });
              $(".bottomText").css({
                'visibility': 'visible'
              });
              if ($("#pbText").hasClass("pbText")) {
                $("#pbText").removeClass("pbText");
                $("#pbText").addClass("pbTextDefault");
              }
            }

            selected.play();
            //  Math.floor(Math.random() * (max - min + 1)) + min;
            loadShaoKahnSound();
            animateSelected();


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

            $("#pbText").text("STARTING HYPERSPIN...");
            $("#pbText").attr('data-text', $("#pbText").text());

            if (menu == 'snes') {
              $('.bottomText').css({
                "top": "402px"
              });
              $(".bottomText").css({
                'visibility': 'visible'
              });
              if ($("#pbText").hasClass("pbText")) {
                $("#pbText").removeClass("pbText");
                $("#pbText").addClass("pbTextDefault");
              }
            }

            selected.play();
            //  Math.floor(Math.random() * (max - min + 1)) + min;
            loadShaoKahnSound();
            animateSelected();
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
            $("#pbText").text("STARTING WINDOWS...");
            $("#pbText").attr('data-text', $("#pbText").text());

            if (menu == 'snes') {
              $('.bottomText').css({
                "top": "402px"
              });
              $(".bottomText").css({
                'visibility': 'visible'
              });

              if ($("#pbText").hasClass("pbText")) {
                $("#pbText").removeClass("pbText");
                $("#pbText").addClass("pbTextDefault");
              }
            }

            selected.play();
            loadShaoKahnSound();
            animateSelected();
          }
        }
      }
    }

  }

  document.addEventListener("keydown", keyDown);





  function startMenu() {
    if (menu == 'snes') {
      $("body").addClass("menuSnes");
      $("#element2").addClass("bordaPiscante");
      $(".bordaPiscante").css({
        'width': '210px'
      });
      animateDivers();
      music.play();
      delay(function () {
        choose.play();
      }, 500);
    } else {
      document.removeEventListener('keydown', keyDown, false);
      $("#element1").css({
        'left': '54px'
      });
      $("#element2").css({
        'left': '54px'
      });
      $("#element3").css({
        'left': '286px'
      });
      $("#element4").css({
        'left': '286px'
      });
      $('#portalRight').show();
      $('#portalLeft').show();
      $('#portalRight').transition({
          x: '-381px',
          duration: 1300,
          delay: 1800,
          easing: 'linear'
        })
        .transition({
          y: '-2px',
          duration: 50
        })
        .transition({
          y: '4px',
          duration: 100
        })
        .transition({
          y: '-4px',
          duration: 100
        })
        .transition({
          y: '0px',
          duration: 50
        });
      $('#portalLeft').transition({
          x: '381px',
          duration: 1300,
          delay: 1800,
          easing: 'linear'
        })
        .transition({
          y: '-2px',
          duration: 50
        })
        .transition({
          y: '4px',
          duration: 100
        })
        .transition({
          y: '-4px',
          duration: 100
        })
        .transition({
          y: '0px',
          duration: 50
        });
      $('.blocoDireito').transition({
        'background-color': '#393839',
        delay: 3050,
        easing: 'snap',
        duration: 1
      });
      //  $('.bottomText').delay(2095).show(0);  //causa problemas na sincronia dos portões
      $('.bottomText').transition({
          'visibility': 'visible',
          delay: 3095,
          easing: 'snap',
          duration: 1
        })
        .transition({
          y: '-2px',
          duration: 50
        })
        .transition({
          y: '4px',
          duration: 100
        })
        .transition({
          y: '-4px',
          duration: 100
        })
        .transition({
          y: '0px',
          duration: 50
        });

        playMenuMusic();
    }

  }


  //$("#element").focus();
  startMenu();


  $("#btnTeste").click(function () {
    animateShaoKahn();
  });

});