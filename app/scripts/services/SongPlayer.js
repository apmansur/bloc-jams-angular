(function () {
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};
        /**
         * @desc album object 
         * @type {Object}
         */
        var currentAlbum = Fixtures.getAlbum();
        /**
         * @desc Buzz object audio file
         * @type {Object}
         */
        
        var currentBuzzObject = null

        /**
         * @function setSong
         * @desc Stops currently playing song and loads new audio file as currentBuzzObject and allows other parts of application to listen to time update
         * @param {Object} song
         */
        var setSong = function (song) {
            if (currentBuzzObject) {
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
            }

            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });

            currentBuzzObject.bind('timeupdate', function () {
                $rootScope.$apply(function () {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                });
            });

            /**
             * @desc Active song object from list of songs
             * @type {Object}
             */

            SongPlayer.currentSong = song;
        };

        /**
         * @function getIndexSong
         * @desc fucntion to get song indez
         * @type {Number}
         */
        var getSongIndex = function (song) {
            return currentAlbum.songs.indexOf(song);
        };

        /**
         * @desc Holds current song number
         * @type {Number}
         */
        SongPlayer.currentSong = null;

        /**
         * @desc Current playback time (in seconds) of currently playing song
         * @type {Number}
         */
        SongPlayer.currentTime = null;

        /**
         * @function playSong
         * @desc Plays current song and sets song.playing to true
         * @param {Object} song
         */
        var playSong = function (song) {
            currentBuzzObject.play();
            song.playing = true;
        };

        var stopSong = function (song) {
            currentBuzzObject.stop();
            song.playing = null;
        };

        /**
         * @function setCurrentTime
         * @desc Set current time (in seconds) of currently playing song
         * @param {Number} time
         */
        SongPlayer.setCurrentTime = function (time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };
        /**
         * @function SongPlayer.volume
         * @desc holds value of volume
         * @param {Number} volume
         */
        SongPlayer.volume = 80;
        
        SongPlayer.mute = function(){
            if (SongPlayer.volume > 0){
                SongPlayer.setVolume(0);
            }
            else{
                SongPlayer.setVolume(80);
            }
        };

        /**
         * @function SongPlayer.setVolume
         * @desc sets volume of song playing
         * @param {Number} volume
         */
        SongPlayer.setVolume = function (volume) {
                SongPlayer.volume = volume;
                currentBuzzObject.setVolume(volume);
        };


        /**
         * @function SongPlayer.play
         * @desc Plays current song if paused, or selected song
         * @param {Object} song
         */
        SongPlayer.play = function (song) {
            song = song || SongPlayer.currentSong || currentAlbum.songs[0];
            if (SongPlayer.currentSong !== song) {

                setSong(song);
                playSong(song);

            } 
            else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    playSong(song);
                }
            }
           
        };

        /**
         * @function SongPlayer.pause
         * @desc Pauses current song
         * @param {Object} song
         */
        SongPlayer.pause = function (song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };

        /**
         * @function SongPlayer.previous
         * @desc Sets song to previous song
         * @param {Object} song
         */

        SongPlayer.previous = function () {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;

            if (currentSongIndex < 0) {
                currentSongIndex = ((currentAlbum.songs.length) - 1);
            }

            var song = currentAlbum.songs[currentSongIndex];
            setSong(song);
            playSong(song);

        };

        /**
         * @function SongPlayer.next
         * @desc Sets song to next song
         * @param {Object} song
         */

        SongPlayer.next = function () {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;

            if (currentSongIndex > ((currentAlbum.songs.length) - 1)) {
                currentSongIndex = 0;
            }
            var song = currentAlbum.songs[currentSongIndex];
            setSong(song);
            playSong(song);
        };

        return SongPlayer;
    }

    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
