import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Play, Pause, StopCircle, SkipForward } from 'lucide-react';

interface Song {
  title: string;
  artist: string;
  src: string;
}

const songs: Song[] = [
  { title: 'Song 1', artist: 'Artist 1', src: '/sounds/song1.mp3' },
  { title: 'Song 2', artist: 'Artist 2', src: '/sounds/song2.mp3' },
  { title: 'Song 3', artist: 'Artist 3', src: '/sounds/song3.mp3' },
];

const Music: React.FC = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState<number[]>([50]); // Rango de volumen (0-100)
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Reproducir/Pausar música
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Detener música
  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  // Cambiar a la siguiente canción
  const nextSong = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    if (audioRef.current) {
      audioRef.current.src = songs[nextIndex].src;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-4 w-80">
      {/* Audio Element */}
      <audio ref={audioRef} src={songs[currentSongIndex].src} />

      {/* Song Info */}
      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold text-white">
          {songs[currentSongIndex].title}
        </h3>
        <p className="text-sm text-gray-400">
          {songs[currentSongIndex].artist}
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={stopMusic}
          aria-label="Stop"
        >
          <StopCircle className="text-white" size={24} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlayPause}
          aria-label="Play/Pause"
        >
          {isPlaying ? (
            <Pause className="text-white" size={24} />
          ) : (
            <Play className="text-white" size={24} />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSong}
          aria-label="Next"
        >
          <SkipForward className="text-white" size={24} />
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-2">
        <span className="text-white text-sm">Volume</span>
        <Slider
          value={volume}
          onValueChange={(value) => {
            setVolume(value);
            if (audioRef.current) {
              audioRef.current.volume = value[0] / 100;
            }
          }}
          max={100}
          step={1}
          className="flex-grow"
        />
      </div>
    </div>
  );
};

export default Music;
