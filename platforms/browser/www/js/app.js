var $$ = Dom7;

var app = new Framework7({
    root: '#app',
    name: 'Единобожие - Вероубеждение',
    theme: 'md',
    version: 1.4,
    audioVersion: 1.0,
    routes: routes,
    touch: {
        mdTouchRipple: false
    },
    view: {
        stackPages: true,
        animate: false
    },
    methods: {
        player: {
            play: function (bookId, index, autoplay1, time1) {

                player = this;

                if(autoplay1 === undefined){
                    autoplay = true;
                } else {
                    autoplay = autoplay1;
                }

                if(time1 === undefined){
                    time = 0;
                } else {
                    time = time1;
                }

                book = app.methods.books(bookId);
                audioInfo = book.Аудио[index];

                audioInfo.index = index;
                audioInfo.book = bookId;

                localStorage.latestAudio = JSON.stringify(audioInfo);

                dialogProgress = app.dialog.progress('Загрузка', 0);

                setTimeout(function () {

                    localforage.getItem(audioInfo.Ссылка, function (err, value) {

                        if (value == null || app.params.audioVersion !== Number(localStorage.audioVersion)) {

                            request = app.request({
                                url: encodeURI('https://abujabir.ru/' + audioInfo.Ссылка),
                                xhrFields: {
                                    responseType: 'blob'
                                },
                                success: function (blob) {

                                    blobURL = window.URL.createObjectURL(blob);

                                    localforage.setItem(audioInfo.Ссылка, blob);

                                    localStorage.audioVersion = app.params.audioVersion;

                                    app.emit('audio:load');

                                }
                            });

                            request.addEventListener('progress', function (progress) {

                                progress = (progress.loaded / progress.total) * 100

                                dialogProgress.setProgress(progress);
                                dialogProgress.setText(progress.toFixed(0) + '% из 100%');

                            }, false);

                        } else {

                            blobURL = window.URL.createObjectURL(value);

                            app.emit('audio:load');

                        }

                    });

                });

            },
            next: function () {

                latestAudio = JSON.parse(localStorage.latestAudio);
                nextAudio = book.Аудио[+ latestAudio.index + 1];

                app.actions.close();

                if (nextAudio !== undefined) {

                    this.play(book.id, + latestAudio.index + 1);

                } else {

                    this.play(book.id, 0);

                }

            },
            prev: function () {

                latestAudio = JSON.parse(localStorage.latestAudio);
                prevAudio = book.Аудио[+ latestAudio.index - 1];

                app.actions.close();

                if (prevAudio !== undefined) {

                    this.play(book.id, + latestAudio.index - 1);

                } else {

                    this.play(book.id, + book.Аудио.length - 1);

                }

            }
        },
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

            books = JSON.parse(localStorage.books);

            if (id) {

                book = books.filter(function (book) {

                    return book.id == id;

                })[0];

                return book;

            } else {

                return books;

            }

        }
    }
}).init();

app.request.setup({
    complete(xhr) {
        console.log(xhr);
    },
    error: function () {
        app.dialog.alert('Проверьте подключение к интернету!', 'Ошибка подлкючения!');
    }
});

if (app.version !== Number(localStorage.version)) {

    localStorage.clear();
    localforage.clear();

    localStorage.version = app.version;

    location.reload();

}

app.views.create('.view-main', {
    url: '/books/',
    main: true
});

$$('*').on('click', function () {

    $$('video')[0].play();

});

$audio = $$('audio');
audio = $$('audio')[0];

if (localStorage.latestAudio !== undefined) {

    latestAudio = JSON.parse(localStorage.latestAudio);

    app.methods.player.play(latestAudio.book, latestAudio.index, false, latestAudio.time);

}

app.on('audio:load', function () {

    $audio.attr('src', blobURL);

    audio.load();

});

$audio.on('loadeddata', function () {

    audio.currentTime = time;

    if (autoplay) {

        audio.play();

    }

    playerSmall = $$('.player-small');

    playerSmall.removeClass('display-none');
    playerSmall.find('.audio-title').html(audioInfo.Название);

    playerBig = $$('.player-big');

    playerBig.find('.audio-title').html(book.Название + ' - ' + audioInfo.Название);
    playerBig.find('.audio-author').html(book.Автор);

    audioRange = app.range.create({
        el: playerBig.find('.audio-range'),
        label: false,
        value: time,
        min: 0,
        max: audio.duration.toFixed(0),
        on: {
            change: function (range, value) {

                if (change) {

                    audio.currentTime = value;

                }

            }
        }
    });

    audioRange.max = audio.duration.toFixed(0);
    audioRange.updateScale();

    if (!app.device.ios) {

        volumeRange = app.range.create({
            el: playerBig.find('.volume-range'),
            value: audio.volume,
            min: 0.0,
            step: 0.000001,
            max: 1,
            on: {
                change: function (range, value) {

                    audio.volume = value;

                }
            }
        });

    } else {

        $$('.audio-volume').addClass('display-none');
        $$('.player-big').css('height', '250px');

    }

    durationMinutes = Math.floor(audio.duration / 60).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    });

    durationSeconds = (Math.floor(audio.duration) - durationMinutes * 60).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    });

    duration = durationMinutes + ':' + durationSeconds;

    playerBig.find('.duration').html(duration);

    app.actions.open('.player-big');

    setTimeout(function () {

        dialogProgress.close();

    });

});

$$('.pause').on('click', function() {

    audio.pause();

});

$$('.resume').on('click', function() {

    audio.play();

});

$$(audio).on('pause', function () {

    playerSmall.find('.resume').removeClass('display-none');
    playerSmall.find('.pause').addClass('display-none');

    playerBig.find('.resume').removeClass('display-none');
    playerBig.find('.pause').addClass('display-none');

});

$$(audio).on('playing', function () {

    playerSmall.find('.resume').addClass('display-none');
    playerSmall.find('.pause').removeClass('display-none');

    playerBig.find('.resume').addClass('display-none');
    playerBig.find('.pause').removeClass('display-none');

});

$$(audio).on('timeupdate', function () {

    latestAudio = JSON.parse(localStorage.latestAudio);
    latestAudio.time = audio.currentTime;

    localStorage.latestAudio = JSON.stringify(latestAudio);

    change = false;

    if (typeof audioRange !== 'undefined') {

        audioRange.setValue(audio.currentTime);

    }

    change = true;

    currentTimeMinutes = Math.floor(audio.currentTime / 60).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    });

    currentTimeSeconds = (Math.floor(audio.currentTime) - currentTimeMinutes * 60).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    });

    currentTime = currentTimeMinutes + ':' + currentTimeSeconds;

    if (typeof playerBig !== 'undefined') {

        playerBig.find('.current-time').html(currentTime);

    }

});

$$(audio).on('ended', function () {

    player.next();

});

viewUrls = [];

for (var i = 0; i < app.views.length; i++) {
    viewUrls.push(app.views[i].params.url);
}

$$(document).on('backbutton', function() {

    app.preloader.hide();

    path = app.views.current.router.currentRoute.path;

    if (viewUrls.indexOf(path) !== -1) {

        app.dialog.confirm('Вы уверены что хотите закрыть приложение?', function() {

            navigator.app.exitApp();

        });

    } else {

        app.view.current.router.back();

    }

});

$$(document).on('deviceready', function () {

    setTimeout(function () {

        navigator.splashscreen.hide();

    }, 500);

});