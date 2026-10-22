
import { ImageKit } from "@imagekit/nodejs";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUB,
    privateKey: process.env.IMAGEKIT_PIV,
});

export default imagekit;
