var $$ = Dom7;

var app = new Framework7({
  root: '#app',
  name: 'Абу Джабир',
  theme: 'ios',
  version: 7.8,
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
    iosDynamicNavbar: false,
    stackPages: true,
    preloadPreviousPage: false,
    removeElements: false,
    iosSwipeBack: true,
    mdSwipeBack: true
  },
  dialog: {
    buttonCancel: 'Отмена',
    buttonOk: 'Ок'
  },
  methods: {
    player: {
      play: function (audio) {

        sheetPlayer.$el.find('.preloader-block').removeClass('display-none');
        sheetPlayer.$el.find('.page-content').addClass('disabled');

        if(!sheetPlayer.opened) {

          sheetPlayer.open();

        }

        localStorage.latest = JSON.stringify(audio);

        localforage.getItem(audio.url).then(function(value) {

          var src;

          if (value !== null) {

            src = URL.createObjectURL(value);

          } else {

            src = app.params.backend + audio.url;

          }

          player.url = src;

          player.unload();

          player.play();

          setTimeout(function () {

            //player.load();

          }, sheetPlayer.opened ? 0 : 1000);

        });

      },
      prev15sec: function () {

        var position = player.position - 15000;

        player.setPosition(position);

      },
      next15sec: function () {

        var position = player.position + 15000;

        player.setPosition(position);

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

      },
      toggle: function () {

        player.togglePause();

      }
    },
    books: function (id, callback) {

      var app = this;

      if (localStorage.books == undefined || Number(localStorage.version) !== app.version) {

        app.methods.loadData(function (books) {

          if (callback !== undefined) {

            callback(books);

          }

        });

      } else {

        var books = JSON.parse(localStorage.books);

        if (callback !== undefined) {

          callback(books);

        }

        if (id) {

          if (id == 'favorites') {

            if (localStorage.favorites !== undefined && JSON.parse(localStorage.favorites).length !== 0) {

              var favorites = {
                "Аудио": JSON.parse(localStorage.favorites),
                "Фон": "img/favorites.jpg"
              };

              return favorites;

            } else {

              var favorites = {
                "Фон": "img/favorites.jpg"
              };

              return favorites;

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

      }

    },
    loadData: function(callback) {

      app.request({
        url: app.params.backend + '/data.json',
        dataType: 'json',
        success: function (data) {

          if (callback !== undefined) {

            callback(data.Книги);

          }

          localStorage.books = JSON.stringify(data.Книги);
          localStorage.version = app.version;

        }
      });

    },
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
    checkVersion: function () {

      var app = this;

      app.request({
        url: encodeURI('https://salvion.ru/api/abujabir'),
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

    }
  }

});

app.request.setup({
  beforeSend: function(xhr) {

  },
  complete: function(xhr) {

    console.log(xhr);

  }
});

$$(document).on('deviceready', function () {

  app.init();

  app.methods.checkVersion();

  app.views.create('.view-main', {
    url: '/books',
    animate: app.device.ios ? true : false,
    main: true
  });

  if (app.device.android) {

    var attachFastClick = Origami.fastclick;
    attachFastClick(document.body);

  }

  window.toolbarPlayer = $$('.toolbar-player');

  window.sheetPlayer = app.sheet.create({
    el: '.sheet-player',
    swipeToClose: true,
    backdrop: true,
    closeByOutsideClick: true,
    closeByBackdropClick: true
  });

  window.audioRange = app.range.create({
    el: sheetPlayer.$el.find('.range-audio'),
    label: false,
    step: 0.01,
    min: 0,
    value: 0,
    on: {
      change: function (range, value) {

        if (change) {

          var position = (range.value.toFixed(0).toString());

          player.setPosition(position);

        }

      }
    }
  });

  toolbarPlayer.on('click', function (e) {

    if(!$$(e.target).hasClass('icon')) {

      sheetPlayer.open();

    }

  });

  player = soundManager.createSound({
    onload: function(bConnect) {

      var latest = JSON.parse(localStorage.latest);

      sheetPlayer.$el.find('.audio-title').html(latest.title);

      if (latest.title.length > 20 && latest.title.length < 40) {

        sheetPlayer.$el.addClass('size-medium');

      } else if (latest.title.length >= 40) {

        sheetPlayer.$el.addClass('size-small');

      } else {

        sheetPlayer.$el.removeClass('size-medium');
        sheetPlayer.$el.removeClass('size-small');

      }

      sheetPlayer.$el.find('.audio-author').html(latest.author);

      toolbarPlayer.removeClass('display-none');
      toolbarPlayer.find('.audio-title').html(latest.title);

      audioRange.max = Number(player.duration.toFixed(0));

      var durationMinutes = Math.floor((player.duration / 1000) / 60).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      });

      var durationSeconds = (Math.floor(player.duration / 1000) - durationMinutes * 60).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      });

      var duration = durationMinutes + ':' + durationSeconds;

      sheetPlayer.$el.find('.duration').html(duration);

      sheetPlayer.$el.find('.share-button').off('click').on('click', function () {

        app.request({
          url: encodeURI('https://abujabir.ru/s.php?url=' + player.url),
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

      sheetPlayer.$el.find('.preloader-block').addClass('display-none');
      sheetPlayer.$el.find('.page-content').removeClass('disabled');

      this.setPosition(latestTime);
      audioRange.setValue(latestTime);

      if (latestTime > 0) {

          setTimeout(function () {

            player.pause();

            var currentTimeMinutes = Math.floor((latestTime / 1000) / 60).toLocaleString('en-US', {
              minimumIntegerDigits: 2,
              useGrouping: false
            });

            var currentTimeSeconds = (Math.floor(latestTime / 1000) - currentTimeMinutes * 60).toLocaleString('en-US', {
              minimumIntegerDigits: 2,
              useGrouping: false
            });

            var currentTime = currentTimeMinutes + ':' + currentTimeSeconds;

            sheetPlayer.$el.find('.current-time').html(currentTime);

            latestTime = 0;

          }, 100);

      }

    },
    whileloading: function () {


    },
    whileplaying: function () {

      var latest = JSON.parse(localStorage.latest);

      var currentTimeMinutes = Math.floor((player.position / 1000) / 60).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      });

      var currentTimeSeconds = (Math.floor(player.position / 1000) - currentTimeMinutes * 60).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      });

      var currentTime = currentTimeMinutes + ':' + currentTimeSeconds;

      sheetPlayer.$el.find('.current-time').html(currentTime);

      latest.time = player.position;

      localStorage.latest = JSON.stringify(latest);

      change = false;

      audioRange.setValue(player.position);

      change = true;

    },
    onplay: function () {

      sheetPlayer.$el.find('.resume').addClass('display-none');
      sheetPlayer.$el.find('.pause').removeClass('display-none');

      toolbarPlayer.find('.resume').addClass('display-none');
      toolbarPlayer.find('.pause').removeClass('display-none');

      try {

        cordova.plugins.backgroundMode.enable();

      } catch (e) {

      }

    },
    onresume: function () {

      sheetPlayer.$el.find('.resume').addClass('display-none');
      sheetPlayer.$el.find('.pause').removeClass('display-none');

      toolbarPlayer.find('.resume').addClass('display-none');
      toolbarPlayer.find('.pause').removeClass('display-none');

      try {

        cordova.plugins.backgroundMode.enable();

      } catch (e) {

      }

    },
    onpause: function () {

      sheetPlayer.$el.find('.resume').removeClass('display-none');
      sheetPlayer.$el.find('.pause').addClass('display-none');

      toolbarPlayer.find('.resume').removeClass('display-none');
      toolbarPlayer.find('.pause').addClass('display-none');

      try {

        cordova.plugins.backgroundMode.disable();

      } catch (e) {

      }

    },
    onstop: function () {

      sheetPlayer.$el.find('.resume').removeClass('display-none');
      sheetPlayer.$el.find('.pause').addClass('display-none');

      toolbarPlayer.find('.resume').removeClass('display-none');
      toolbarPlayer.find('.pause').addClass('display-none');

      try {

        cordova.plugins.backgroundMode.disable();

      } catch (e) {

      }

    },
    onfinish: function () {

      sheetPlayer.$el.find('.resume').removeClass('display-none');
      sheetPlayer.$el.find('.pause').addClass('display-none');

      toolbarPlayer.find('.resume').removeClass('display-none');
      toolbarPlayer.find('.pause').addClass('display-none');

      try {

        cordova.plugins.backgroundMode.disable();

      } catch (e) {

      }

    }
  });

  if (app.device.ios) {

    setTimeout(function () {

      app.statusbar.hide();

    });

  }

  latestTime = 0;

  sheetPlayer.open();

  setTimeout(function () {

    sheetPlayer.close();

    setTimeout(function () {

      if (localStorage.latest !== undefined) {

        var latest = JSON.parse(localStorage.latest);

        latestTime = latest.time;

        app.methods.player.play(latest);

        setTimeout(function () {

          app.methods.player.play(latest);

        }, 100);

      }

    }, 100);

  }, 100);

  $$(document).on('backbutton', function(event) {

    app.methods.backButton();

  });

  setTimeout(function () {

    app.statusbar.show();

    navigator.splashscreen.hide();

  }, 5000);

});
