import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage/", async (req, res) => {
      let files = [];
      const { image_url } = req.query;
      // Validate image url does not exist as query param
      if (!image_url) {
        res.status(404).send({ message: 'Please input an URL' });
      }

      // Validate image url does not exist as query param
      const imageUrlSplit = image_url.split('.');
      const imageUrlSplitLength = imageUrlSplit.length;
      if (imageUrlSplitLength < 2) {
          res.status(400).send({ message: 'Proper url required' });
      }

      const imageUrlFormat = imageUrlSplit[imageUrlSplitLength-1];
      console.log('imageUrlSplitLength', imageUrlFormat);
      if (imageUrlFormat != 'jpg') {
          res.status(400).send({ message: 'Please input jpg file' });
      }

      // Filter the image
      const filteredImagePath = await filterImageFromURL(image_url);
      files.push(filteredImagePath);

      // Delete the file locally for cleanup
      const deleteMyFiles = await deleteLocalFiles(files);
      res.status(200).send(filteredImagePath);
  });
  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
