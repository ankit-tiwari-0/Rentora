import { ImageKit } from "@imagekit/nodejs/client.js";

var imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUB,
    privateKey : process.env.IMAGEKIT_PIV           ,
    urlEndPoint : process.env.ENDPOINT           ,
});

export default imagekit