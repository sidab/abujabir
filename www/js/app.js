var $$ = Dom7;

var audioElDom7 = $$('audio');
var audioEl = audioElDom7[0];

var app = new Framework7({
    root: '#app',
    name: 'Абу Джабир',
    theme: 'ios',
    version: 3.6,
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
        books: function (id) {

            var app = this;

            if (localStorage.books == undefined || Number(localStorage.version) !== app.version) {

                app.methods.loadData();

            }

            var books = JSON.parse(localStorage.books);

            if (id) {

                var book = books.filter(function (book) {

                    return book.id == id;

                })[0];

                return book;

            } else {

                return books;

            }

        },
        player: {
            play: function (audio) {

                localStorage.latest = JSON.stringify(audio);

                localforage.getItem(audio.url).then(function(value) {

                    var src;

                    if (value !== null) {

                        src = URL.createObjectURL(value);

                    } else {

                        if (app !== undefined) {

                            sheetPlayer.$el.find('.preloader').removeClass('display-none');
                            sheetPlayer.$el.find('.page-content').addClass('disabled');

                        }

                        src = app.params.backend + audio.url;

                    }

                    audioElDom7.attr('src', src);

                    audioEl.load();

                    sheetPlayer.open();

                });

            },
            next: function () {

            },
            prev: function () {

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

                    if (dataVersion > Number(localStorage.dataVersion)) {

                        localStorage.removeItem('books');

                        localStorage.dataVersion = dataVersion;

                    }

                    if (audioVersion > Number(localStorage.audioVersion)) {

                        localforage.clear();

                        localStorage.audioVersion = audioVersion;

                    }

                }
            });

        }
    },
    on: {
        init: function () {

            var app = this;

            app.methods.checkVersion();

            setInterval(function () {

                app.methods.checkVersion();

            }, 30000);

            var sheetPlayer = app.sheet.create({
                el: '.sheet-player',
                swipeToClose: true,
                backdrop: true,
            });

            var audioRange = app.range.create({
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

                app.methods.player.play(latest);

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

    }, 100);

    viewUrls = [];

    for (var i = 0; i < app.views.length; i++) {
        viewUrls.push(app.views[i].params.url);
    }

    $$(document).on('backbutton', function () {

        app.preloader.hide();

        path = app.views.current.router.currentRoute.path;

        if (viewUrls.indexOf(path) !== -1) {

            if (app.views.current.selector === '.view-main') {

                if (app.dialog.get('.dialog') == undefined) {

                    var confirmExit = app.dialog.confirm('Вы уверены что хотите закрыть приложение?', function () {

                        navigator.app.exitApp();

                    });

                } else {

                    navigator.app.exitApp();

                }

            } else {

                $$('.toolbar-menu').find('a[href="#view-projects"]').click();

            }

        } else {

            app.view.current.router.back();

        }

    });

});

var audioRange = app.range.get('.range-audio');
var sheetPlayer = app.sheet.get('.sheet-player');
var toolbarPlayer = $$('.toolbar-player');

audioElDom7.on('loadedmetadata', function () {

    var latest = JSON.parse(localStorage.latest);

    sheetPlayer.$el.find('.audio-title').html(latest.title);

    if (latest.title.length > 20) {

        sheetPlayer.$el.find('.audio-title').addClass('marquee');
        toolbarPlayer.find('.audio-title').addClass('marquee');

    } else {

        sheetPlayer.$el.find('.audio-title').removeClass('marquee');
        toolbarPlayer.find('.audio-title').removeClass('marquee');

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

    audioElDom7.once('canplay', function () {

        sheetPlayer.$el.find('.preloader').addClass('display-none');
        sheetPlayer.$el.find('.page-content').removeClass('disabled');

        if (firstPlay && localStorage.latest !== undefined) {

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