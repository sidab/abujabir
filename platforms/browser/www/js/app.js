var $$ = Dom7;

var audioElDom7 = $$('audio');
var audioEl = audioElDom7[0];

var app = new Framework7({
    root: '#app',
    name: 'Абу Джабир',
    theme: 'auto',
    version: 1.5,
    routes: routes,
    touch: {
        mdTouchRipple: false,
        tapHold: false,
        disableContextMenu: true,
        activeState: false,
        fastClicks: true
    },
    view: {
        mdSwipeBack: true,
        animate: false,
        iosDynamicNavbar: false,
        stackPages: true
    },
    methods: {
        books: function (id) {

            if (localStorage.books == undefined) {

                app.request({
                    url: 'data.json',
                    dataType: 'json',
                    async: false,
                    success: function (data) {

                        localStorage.books = JSON.stringify(data.Книги);

                    }
                })

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
            play: function (book, index) {

                var audio = book.Аудио[index];

                localStorage.latest = JSON.stringify({
                    book: book,
                    index: index,
                    audio: audio
                });

                if (app !== undefined) {

                    app.dialog.preloader('Загрузка...');

                }

                localforage.getItem(audio.Ссылка).then(function(value) {

                    var src;

                    if (value !== null) {

                        src = URL.createObjectURL(value);

                    } else {

                        src = 'https://abujabir.ru/' + audio.Ссылка;

                    }

                    audioElDom7.attr('src', src);

                    audioEl.load();

                });

            },
            next: function () {

                var latest = JSON.parse(localStorage.latest);

                var nextAudio = latest.book.Аудио[+ latest.index + 1];

                if (nextAudio !== undefined) {

                    this.play(latest.book, + latest.index + 1);

                } else {

                    this.play(latest.book, 0);

                }

            },
            prev: function () {

                var latest = JSON.parse(localStorage.latest);

                var nextAudio = latest.book.Аудио[+ latest.index - 1];

                if (nextAudio !== undefined) {

                    this.play(latest.book, + latest.index - 1);

                } else {

                    this.play(latest.book, 0);

                }

            }
        }
    },
    on: {
        init: function () {

            var app = this;

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

                app.methods.player.play(latest.book, latest.index);

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

var audioRange = app.range.get('.range-audio');
var sheetPlayer = app.sheet.get('.sheet-player');
var toolbarPlayer = $$('.toolbar-player');

$$(document).on('deviceready', function () {

    setTimeout(function () {

        navigator.splashscreen.hide();

    }, 500);

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

audioElDom7.on('loadedmetadata', function () {

    audioElDom7.once('canplaythrough', function () {

        if (firstPlay && localStorage.latest !== undefined) {

            setTimeout(function () {
                audioEl.currentTime = latestTime;
            })

            firstPlay = false;

        } else {

            audioEl.play();

        }

        var latest = JSON.parse(localStorage.latest);

        sheetPlayer.$el.find('.audio-title').html(latest.book.Название + ' - ' + latest.audio.Название);
        sheetPlayer.$el.find('.audio-author').html(latest.book.Автор);

        toolbarPlayer.removeClass('display-none');
        toolbarPlayer.find('.audio-title').html(latest.audio.Название);

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

        audioEl.currentTime = latest.time;

        sheetPlayer.open();

        app.dialog.close();

        audioElDom7.off('canplaythrough');

    });

});

audioElDom7.on('loadeddata', function () {

    var latest = JSON.parse(localStorage.latest);

    app.request({
        url: encodeURI('https://abujabir.ru/' + latest.audio.Ссылка),
        xhrFields: {
            responseType: 'blob'
        },
        success: function (blob) {

            var blobURL = window.URL.createObjectURL(blob);

            localforage.setItem(latest.audio.Ссылка, blob);

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

audioElDom7.on('ended', function () {

    app.methods.player.next();

});