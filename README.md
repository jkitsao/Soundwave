## SoundWave

<img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTowEvl_bWzq4ieK-UU1kzqCbLrB8e1FvPT4eIDcFFFJsAjbYyGMDS1uaCRnqJ7I3jkqGI&usqp=CAU'>

# Online Radio with Node.js Streams

This project is an online radio implementation using Node.js streams. It allows you to stream audio data to connected clients in real-time, enabling them to listen to the radio broadcast. The project is built with TypeScript and leverages the power of Node.js streams for efficient data processing.

### Features

---

- Random Song Selection: The application randomly selects songs from a catalog, which includes both regular and alternative songs, and plays them in a loop.
- Streaming to Listeners: Listeners can connect to the server and stream the currently playing song in real time.
- Throttling: The streaming is throttled based on the bitrate of the song to ensure smooth playback and efficient data transfer.
- Now Playing Information: The server provides an endpoint to retrieve the currently playing song, along with the number of current listeners.

## Installation

1.  Clone the repository:

    bashCopy code

    `git clone https://github.com/jkitsao/soundwave.git`

2.  Navigate to the project directory:

    bash

    `cd soundwave`

3.  Install the dependencies:

    bash

    `npm install`

4.  Start the server:

    bash

    `npm start`

5.  Access the application in your browser at `http://localhost:5000` (or the specified port).

## Usage

- Upon accessing the application, the online radio will start playing a loop of randomly selected songs.
- Multiple users can connect to the online radio and listen to the broadcast in real-time.
- The server streams audio data using Node.js streams, ensuring efficient data processing and delivery.
- You can customize the songs catalogue and implement additional features based on your requirements.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please create an issue or submit a pull request.

## License

This project is licensed under the [MIT License](https://chat.openai.com/c/LICENSE).

## Acknowledgments

- This project is inspired by the concept of online radios and the power of Node.js streams.
- Special thanks to the open-source community for their valuable libraries and resources.

Feel free to update and customize the generated README according to your specific project details, guidelines, and preferences.
