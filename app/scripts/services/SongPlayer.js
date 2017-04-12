
(function() {
    function SongPlayer(Fixtures) {
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
        * @desc Stops currently playing song and loads new audio file as currentBuzzObject
        * @param {Object} song
        */
        var setSong = function(song) {
            if (currentBuzzObject) {
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
            }
            
            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
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
            var getSongIndex = function(song) {
                 return currentAlbum.songs.indexOf(song);
             };
        
         /**
        * @desc Holds current song number
        * @type {Number}
        */
        SongPlayer.currentSong = null;
        
        /**
        * @function playSong
        * @desc Plays current song and sets song.playing to true
        * @param {Object} song
        */
        var playSong = function(song) {
            currentBuzzObject.play();
            song.playing = true;
        };
        
        var stopSong = function(song){
             currentBuzzObject.stop();
             song.playing = null;
        };
        
        /**
        * @function SongPlayer.play
        * @desc Plays current song if paused, or selected song
        * @param {Object} song
        */
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
                
                setSong(song);
                playSong(song);
                
            } else if (SongPlayer.currentSong === song) {
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
        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };
        
        /**
        * @function SongPlayer.previous
        * @desc Sets song to previous song
        * @param {Object} song
        */
        
        SongPlayer.previous = function() {
             var currentSongIndex = getSongIndex(SongPlayer.currentSong);
             currentSongIndex--;
            
             if (currentSongIndex < 0) {
                 stopSong(song);
             }
            else {
                 var song = currentAlbum.songs[currentSongIndex];
                 setSong(song);
                 playSong(song);
             }
         };
        
           /**
        * @function SongPlayer.next
        * @desc Sets song to next song
        * @param {Object} song
        */
        
        SongPlayer.next = function() {
             var currentSongIndex = getSongIndex(SongPlayer.currentSong);
             currentSongIndex++;
            
             if (currentSongIndex < 0) {
                 stopSong();
             }
            else {
                 var song = currentAlbum.songs[currentSongIndex];
                 setSong(song);
                 playSong(song);
             }
         };
        
        return SongPlayer;
    }
    
    angular
        .module('blocJams')
        .factory('SongPlayer', ['Fixtures', SongPlayer]);
})();

    
        
       