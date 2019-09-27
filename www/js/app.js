var $$ = Dom7;

var audioElDom7 = $$('audio');
var audioEl = audioElDom7[0];

var app = new Framework7({
  root: '#app',
  name: 'Абу Джабир',
  theme: 'ios',
  version: 5.0,
  routes: routes,
  backend: 'https://abujabir.ru/new/',
  touch: {
    mdTouchRipple: false,
    tapHold: false,
    disableContextMenu: true,
    activeState: false,
    fastClicks: true
  },
  view: {
    animate: false,
    iosDynamicNavbar: false,
    stackPages: true
  },
  dialog: {
    buttonCancel: 'Отмена',
    buttonOk: 'Ок'
  },
  methods: {
    backButton: function (closeApp = true) {

      var views = [];

      for (var i = 0; i < app.views.length; i++) {

        var view = app.views[i];

        views.push(view.params.url);

      }

      if (closeApp) {

        if (views.indexOf(app.views.current.router.url) !== -1) {

          app.dialog.confirm('Вы уверены что хотите закрыть приложение?', function () {

            navigator.app.exitApp();

          });

          return false;

        }

      }

      if ($$('.popover.modal-in').length > 0) {

        var popover;

        if ($$('.popover.modal-in').length > 1) {

          popover = app.popover.get($$('.popover.modal-in:last-child'));

        } else {

          popover = app.popover.get($$('.popover.modal-in'));

        }

        popover.close();

        return false;

      }

      if ($$('.popup.modal-in').length > 0) {

        var popup;

        if ($$('.popup.modal-in').length > 1) {

          popup = app.popup.get($$('.popup.modal-in:last-child'));

        } else {

          popup = app.popup.get($$('.popup.modal-in'));

        }

        popup.close();

        return false;

      }

      app.views.current.router.back();

    },
    books: function (id) {

      var app = this;

      if (localStorage.books == undefined || Number(localStorage.version) !== app.version) {

        app.methods.loadData();

      }

      var books = JSON.parse(localStorage.books);

      if (id) {

        if (id == 'favorites') {

          if (localStorage.favorites !== undefined && JSON.parse(localStorage.favorites).length !== 0) {

            var favorites = {
              "Аудио": JSON.parse(localStorage.favorites)
            };

            return favorites;

          } else {

            return false;

          }

        } else {

          var book = books.filter(function (book) {

            return book.id == id;

          })[0];

          return book;

        }


      } else {

        return books;

      }

    },
    player: {
      play: function (audio) {

        if (app !== undefined) {

          sheetPlayer.$el.find('.preloader').removeClass('display-none');
          sheetPlayer.$el.find('.page-content').addClass('disabled');

          if(!sheetPlayer.opened) {

            sheetPlayer.open();

          }

        }

        localStorage.latest = JSON.stringify(audio);

        localforage.getItem(audio.url).then(function(value) {

          var src;

          if (value !== null) {

            src = URL.createObjectURL(value);

          } else {

            src = app.params.backend + audio.url;

          }

          audioElDom7.attr('src', src);

          playing = false;

          audioEl.load();

        });

      },
      next: function () {

        var latest = JSON.parse(localStorage.latest);
        var books = app.methods.books();

        for (var i1 = 0; i1 < books.length; i1++) {

          var book = books[i1];

          for (var i2 = 0; i2 < book.Аудио.length; i2++) {

            if(book.Аудио[i2].Ссылка == latest.url) {

              var next;

              if (book.Аудио[i2+1] !== undefined) {

                next = book.Аудио[i2+1];

              } else {

                next = book.Аудио[0];

              }

              var audio = {
                title: book.Название + ' - ' + next.Название,
                author: next.Автор,
                url: next.Ссылка,
                duration: next.Длительность
              };

              app.methods.player.play(audio);

              return false;

            }

            if (book.Аудио[i2].Вырезки !== undefined) {

              for (var i3 = 0; i3 < book.Аудио[i2].Вырезки.length; i3++) {

                if(book.Аудио[i2].Вырезки[i3].Ссылка == latest.url) {

                  var next;

                  if (book.Аудио[i2].Вырезки[i3+1] !== undefined) {

                    next = book.Аудио[i2].Вырезки[i3+1];

                  } else {

                    next = book.Аудио[i2].Вырезки[0];

                  }

                  var audio = {
                    title: next.Название,
                    author: '',
                    url: next.Ссылка,
                    duration: next.Длительность
                  };

                  app.methods.player.play(audio);

                  return false;

                }

              }

            }

          }

        }

      },
      prev: function () {

        var latest = JSON.parse(localStorage.latest);
        var books = app.methods.books();

        for (var i1 = 0; i1 < books.length; i1++) {

          var book = books[i1];

          for (var i2 = 0; i2 < book.Аудио.length; i2++) {

            if(book.Аудио[i2].Ссылка == latest.url) {

              var prev;

              if (book.Аудио[i2-1] !== undefined) {

                prev = book.Аудио[i2-1];

              } else {

                prev = book.Аудио[book.Аудио.length - 1];

              }

              var audio = {
                title: book.Название + ' - ' + prev.Название,
                author: prev.Автор,
                url: prev.Ссылка,
                duration: prev.Длительность
              };

              app.methods.player.play(audio);

              return false;

            }

            if (book.Аудио[i2].Вырезки !== undefined) {

              for (var i3 = 0; i3 < book.Аудио[i2].Вырезки.length; i3++) {

                if(book.Аудио[i2].Вырезки[i3].Ссылка == latest.url) {

                  var prev;

                  if (book.Аудио[i2].Вырезки[i3-1] !== undefined) {

                    prev = book.Аудио[i2].Вырезки[i3-1];

                  } else {

                    prev = book.Аудио[i2].Вырезки[book.Аудио[i2].Вырезки.length - 1];

                  }

                  var audio = {
                    title: prev.Название,
                    author: '',
                    url: prev.Ссылка,
                    duration: prev.Длительность
                  };

                  app.methods.player.play(audio);

                  return false;

                }

              }

            }

          }

        }

      }
    },
    loadData: function() {

      app.request({
        url: app.params.backend + '/data.json',
        dataType: 'json',
        async: false,
        success: function (data) {

          localStorage.books = JSON.stringify(data.Книги);
          localStorage.version = app.version;

        }
      });

    },
    checkVersion: function () {

      var app = this;

      app.request({
        url: encodeURI('https://goldproekt.com/api/abujabir'),
        cache: false,
        dataType: 'json',
        success: function (response) {

          var appVersion = response.appVersion;
          var audioVersion = response.audioVersion;
          var dataVersion = response.dataVersion;

          if (appVersion > app.version) {

            app.dialog.alert('Вышла новая версия приложения, обновитесь пожалуйста.', function () {

              if (app.device.ios) {

                var updateLink = response.updateLink.ios;

                window.open(updateLink, '_system');

              } else {

                var updateLink = response.updateLink.android;

                window.open(updateLink, '_system');

              }

            });

          }

          if (dataVersion > Number(localStorage.dataVersion) || localStorage.dataVersion == undefined) {

            localStorage.removeItem('books');

            localStorage.dataVersion = dataVersion;

          }

          if (audioVersion > Number(localStorage.audioVersion) || localStorage.audioVersion == undefined) {

            localforage.clear();

            localStorage.audioVersion = audioVersion;

          }

        }
      });

    }
  },
  on: {
    init: function () {

      app = this;

      app.methods.checkVersion();

      toolbarPlayer = $$('.toolbar-player');

      sheetPlayer = app.sheet.create({
        el: '.sheet-player',
        swipeToClose: false,
        backdrop: true,
        closeByOutsideClick: true,
        closeByBackdropClick: true
      });

      audioRange = app.range.create({
        el: sheetPlayer.$el.find('.range-audio'),
        label: false,
        min: 0,
        on: {
          change: function (range, value) {

            var currentTimeMinutes = Math.floor(audioEl.currentTime / 60).toLocaleString('en-US', {
              minimumIntegerDigits: 2,
              useGrouping: false
            });

            var currentTimeSeconds = (Math.floor(audioEl.currentTime) - currentTimeMinutes * 60).toLocaleString('en-US', {
              minimumIntegerDigits: 2,
              useGrouping: false
            });

            var currentTime = currentTimeMinutes + ':' + currentTimeSeconds;

            sheetPlayer.$el.find('.current-time').html(currentTime);

            if (change) {

              audioEl.currentTime = value;

            }

          }
        }
      });

      firstPlay = false;
      latestTime = 0;

      if (localStorage.latest !== undefined) {

        firstPlay = true;

        var latest = JSON.parse(localStorage.latest);

        latestTime = latest.time;

        setTimeout(function () {

          app.methods.player.play(latest);

        }, 100);

      }

    }
  }
}).init();

app.request.setup({
  beforeSend: function(xhr) {

  },
  complete: function(xhr) {

    //console.log(xhr);

  }
});

app.views.create('.view-main', {
  url: '/books',
  main: true
});

$$(document).on('deviceready', function () {

    setTimeout(function () {

      navigator.splashscreen.hide();

    }, 1000);

    $$(document).on('backbutton', function(event) {

      app.methods.backButton();

    });

});

toolbarPlayer.on('click', function (e) {

  if(!$$(e.target).hasClass('icon')) {

    sheetPlayer.open();

  }

});

audioElDom7.on('loadedmetadata', function () {

  var latest = JSON.parse(localStorage.latest);

  sheetPlayer.$el.find('.audio-title').html(latest.title);

  if (latest.title.length > 20 && latest.title.length < 40) {

    sheetPlayer.$el.find('.audio-title').addClass('audio-title-medium');

  } else if (latest.title.length >= 40) {

    sheetPlayer.$el.find('.audio-title').addClass('audio-title-small');

  } else {

    sheetPlayer.$el.find('.audio-title').removeClass('audio-title-medium');
    sheetPlayer.$el.find('.audio-title').removeClass('audio-title-small');

  }

  sheetPlayer.$el.find('.audio-author').html(latest.author);

  toolbarPlayer.removeClass('display-none');
  toolbarPlayer.find('.audio-title').html(latest.title);

  audioRange.max = audioEl.duration.toFixed(0);

  var durationMinutes = Math.floor(audioEl.duration / 60).toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  });

  var durationSeconds = (Math.floor(audioEl.duration) - durationMinutes * 60).toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  });

  var duration = durationMinutes + ':' + durationSeconds;

  sheetPlayer.$el.find('.duration').html(duration);

  sheetPlayer.$el.find('.share-button').off('click').on('click', function () {

    app.request({
      url: encodeURI('https://abujabir.ru/s.php?url=' + audioElDom7.attr('src')),
      success: function (response) {

        var appDownloadUrl;

        if (app.device.ios) {

          appDownloadUrl = 'https://abujabir.ru/s/f0a144';

        } else {

          appDownloadUrl = 'https://abujabir.ru/s/ee6804';

        }

        window.plugins.socialsharing.share(latest.title + ' 🎧⬇️ ' + "\r\n" + response + "\r\n\r\n" + 'Скачай приложение📱⬇️' + "\r\n" + appDownloadUrl);

      }
    });

  });

  audioElDom7.once('canplay', function () {

    if (firstPlay && localStorage.latest !== undefined) {

      sheetPlayer.$el.find('.preloader').addClass('display-none');
      sheetPlayer.$el.find('.page-content').removeClass('disabled');

      setTimeout(function () {

        audioEl.currentTime = latestTime;

      });

      firstPlay = false;

    } else {

      audioEl.play();

    }

  });

});

audioElDom7.on('timeupdate', function () {

  if (playing) {

    sheetPlayer.$el.find('.preloader').addClass('display-none');
    sheetPlayer.$el.find('.page-content').removeClass('disabled');

  }

  playing = true;

  var latest = JSON.parse(localStorage.latest);

  var currentTimeMinutes = Math.floor(audioEl.currentTime / 60).toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  });

  var currentTimeSeconds = (Math.floor(audioEl.currentTime) - currentTimeMinutes * 60).toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  });

  var currentTime = currentTimeMinutes + ':' + currentTimeSeconds;

  sheetPlayer.$el.find('.current-time').html(currentTime);

  change = false;

  latest.time = audioEl.currentTime;

  localStorage.latest = JSON.stringify(latest);

  audioRange.setValue(audioEl.currentTime);

  change = true;

});

audioElDom7.on('playing', function () {

  sheetPlayer.$el.find('.resume').addClass('display-none');
  sheetPlayer.$el.find('.pause').removeClass('display-none');

  toolbarPlayer.find('.resume').addClass('display-none');
  toolbarPlayer.find('.pause').removeClass('display-none');

});

audioElDom7.on('pause', function () {

  sheetPlayer.$el.find('.resume').removeClass('display-none');
  sheetPlayer.$el.find('.pause').addClass('display-none');

  toolbarPlayer.find('.resume').removeClass('display-none');
  toolbarPlayer.find('.pause').addClass('display-none');

});

window.addEventListener("error", handleError, true);

function handleError(evt) {
  if (evt.message) { // Chrome sometimes provides this
    alert("error: "+evt.message +" at linenumber: "+evt.lineno+" of file: "+evt.filename);
  } else {
    alert("error: "+evt.type+" from element: "+(evt.srcElement || evt.target));
  }
}