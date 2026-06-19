require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

(async () => {
  try {
    console.log('Uploading demo image...');
    const res = await cloudinary.uploader.upload('https://res.cloudinary.com/demo/image/upload/sample.jpg', { folder: 'monarc/test' });

    console.log('Upload result:');
    console.log('secure_url:', res.secure_url);
    console.log('public_id:', res.public_id);
    console.log('width:', res.width);
    console.log('height:', res.height);
    console.log('format:', res.format);
    console.log('bytes:', res.bytes);

    const transformed = cloudinary.url(res.public_id, { fetch_format: 'auto', quality: 'auto' });
    console.log('Transformed URL:', transformed);

    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error('Upload error:', err);
    process.exit(1);
  }
})();