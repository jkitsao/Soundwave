import { ffprobe } from '@dropb/ffprobe';
import _ from 'underscore'

/**
 * Retrieves a random song from the provided catalogue array.
 * 
 * @param {Array<any>} catalogue - The array containing the songs catalogue.
 * @returns {any} A randomly selected song from the catalogue.
 */
export const generateRandomSong = (catalogue: Array<any>): any => {
    // Shuffle the songs in the catalogue
    let shuffledSongs = _.shuffle(catalogue);
    
    // Create a copy of the shuffled songs array
    var copy = shuffledSongs.slice(0);
    
    // Return a randomly selected song from the shuffled copy
    return (function () {
      if (copy.length < 1) {
        copy = shuffledSongs.slice(0);
      }
      var index = Math.floor(Math.random() * copy.length);
      var item = copy[index];
      copy.splice(index, 1);
      return item;
    })();
  };
  
/**
 * Retrieves the bit rate of a given song using ffprobe package.
 * 
 * @param {any} song - The song for which to retrieve the bit rate.
 * @returns {Promise<number|string>} A promise that resolves to the bit rate of the song, or a default value if an error occurs.
 */
export const getBitRate = async (song: any): Promise<number|string> => {
    // console.log({ song });
  
    try {
      // Use ffprobe to get the streams information of the song
      const { streams } = await ffprobe(song);
      
      // Return the bit rate from the first stream
      return streams[0].bit_rate;
    } catch (err) {
      console.log("bitrate error", err);
      
      // Return a default bit rate value (128 kbps) if an error occurs
      return 128000;
    }
  };
  
 