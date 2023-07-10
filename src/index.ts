import express, { Express, Request, Response } from 'express';
import * as https from "https"
import crypto from 'crypto'
import Throttle from 'throttle'
import { PassThrough  } from "stream";
import cors from 'cors'
import dotenv from 'dotenv';
import {generateRandomSong,getBitRate} from './utils/songs'
import {catalogue} from './utils/testaudio'
dotenv.config();
const app: Express = express();
// cors  middlewares
app.use(
    cors({
      origin: "*",
    })
  );

/**
 * Interface to define the structure of the metadata object.
 */
interface Meta {
  now_playing: string;
  songs: string[];
  listeners: any[];
  catalogue: string[];
  sinks: Map<string, any>;
}

/**
 * Interface to define the structure of the responseSink object.
 */
interface Sink {
  id: string;
  responseSink: any;
}


/**
 * Initialize the metadata object with default values.
 */
let metadata: Meta = {
  now_playing: '',
  songs: [],
  listeners: [],
  catalogue: [],
  sinks: new Map()
};

// Function to broadcast chunks to all sinks

/**
 * Broadcasts a chunk of data to every sink in the metadata.
 *
 * @param {Buffer} chunk - The data chunk to be broadcasted.
 */
const broadcastToEverySink = async (chunk:Buffer) => {
  // Iterate over each sink in the metadata
  for await (const [, sink] of metadata.sinks) {
    // Write the chunk to the current sink
    sink.write(chunk);
  }
};
/**
 * Creates a response sink and adds it to the metadata with a unique ID.
 * Returns an object containing the ID and the response sink.
 *
 * @returns {Promise<Object>} An object containing the ID and response sink.
 */
const makeResponseSink =  ():Sink => {
  // Generate a unique ID to identify the client
  const getRandomId = () => crypto.randomBytes(32).toString ('hex')
  const id = getRandomId();

  // TODO: Return a custom transformer instead of a passthrough
  const responseSink = new PassThrough();

  // Add the response sink to the metadata with the generated ID
  metadata.sinks.set(id, responseSink);

  // Return an object containing the ID and response sink
  return { id, responseSink };
};

/**
 * Plays a loop of randomly selected songs by generating a random song from the catalogue,
 * retrieving its bit rate, and streaming it to the connected sinks.
 * 
 * The loop continues indefinitely, selecting a new random song after each song finishes playing.
 */
const playLoop = async () => {
  // Generate a random song from the catalogue
  let { name, src } = generateRandomSong(catalogue);
  
  // Retrieve the bit rate of the song
  const bitRate: any = await getBitRate(src);
  
  // Use the HTTPS module to make a GET request to the song source
  https.get(src, (stream) => {
    // Create a Throttle transform stream based on the bit rate
    const throttleTransformable = new Throttle(parseInt(bitRate) / 8);
    
    // Event handler for data event from the throttleTransformable stream
    throttleTransformable.on("data", (chunk) => broadcastToEverySink(chunk));
    
    // Event handler for end event from the throttleTransformable stream
    throttleTransformable.on("end", () => playLoop());
    
    // "play" event with the source of the song
    stream.emit("play", src);
    
    // Update the metadata with the currently playing song
    metadata.now_playing = name;
    
    // Pipe the stream through the throttleTransformable stream
    stream.pipe(throttleTransformable);
  });
};


app.get('/', async (req: Request, res: Response) => {
  // Set corresponding headers for the response
  res.set({
    "Content-Type": "audio/mpeg",
    "Transfer-Encoding": "chunked",
  });
  // console.log('url hit')
  // Create a response sink using the makeResponseSink function
  const { responseSink } = makeResponseSink();

  // Pipe the response sink to the response object
  responseSink.pipe(res);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  // Call the playLoop function to start playing the loop of songs
  playLoop();
  
  //  indicate that the server is running
  console.log(`⚡️[soundwave acknowledges]: on http://localhost:${port}`);
});
