const path = require('path');
const os = require('os');

const sharp = require("sharp");
const fs = require("fs-extra");
const UUID = require("uuid-v4");
const admin = require('firebase-admin');

const { tmpdir } = os;
const { join, dirname } = path;

const bucket = admin.storage().bucket();
const database = admin.firestore();


function updateModelData(model, id, property, value) {
  const modelRef = database.collection(model).doc(id);

  modelRef.update({
    [property]: value,
  });
}

/**
 * Function to resize the uploaded images
 * @param {data} object - The http request with an email parameter either in the query string or in the body
 */
module.exports.onUploadMedia = async (data) => {
  console.log("Data", data);
  const { fileName, model } = data;
  const filePath = data.ref;
  const bucketDir = dirname(filePath);

  const workingDir = join(tmpdir(), 'thumbs');
  const tmpFilePath = join(workingDir, `source_${fileName}`);

  // 1. Ensure thumbnail dir exists
  await fs.ensureDir(workingDir);

  // 2. Download source file
  await bucket.file(filePath).download({
    destination: tmpFilePath
  });

  // 3. Resize the images and define an array of upload promises
  const sizes = [500];
  const uploadPromises = sizes.map(async size => {
    const thumbName = `thumb@${size}_${fileName}`;
    const thumbPath = join(workingDir, thumbName);
    const uuid = UUID();

    const imgMetada = {
      destination: join(bucketDir, thumbName),          
      uploadType: "media",
      metadata: {
        contentType: 'image/jpeg',
        metadata: {
          firebaseStorageDownloadTokens: uuid
        }
      }
    };

    // Resize source image
    await sharp(tmpFilePath)
      .resize(size, size)
      .toFile(thumbPath);
    
    return bucket.upload(thumbPath, imgMetada)
    .then(() => {
      const baseUrl = 'https://firebasestorage.googleapis.com/v0/b'
      const { destination } = imgMetada;
      const firebaseUrl = `${baseUrl}/${bucket.name}/o/${encodeURIComponent(destination)}?alt=media&token=${uuid}`;
      const urlObject = {
        fileName: thumbName,
        ref: destination,
        type: 'image',
        url: firebaseUrl
      };
      console.log(urlObject);
      return Promise.resolve(urlObject);
    });
  });

  // 4. Run the upload operations
  const fbUrlObject = await Promise.all(uploadPromises);

  // 5.  Update the model
  const modelName = model.name;
  const modelId = model.id;
  const modelProp = model.property;

  await updateModelData(modelName, modelId, modelProp, fbUrlObject);

  // 6. Cleanup remove the tmp/thumbs from the filesystem
  return fs.remove(workingDir);
};