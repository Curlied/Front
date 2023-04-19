const { writeFile } = require('fs');
//  Your  environment.custom.ts  file.  Will  be  ignored  by  git.
const targetPath = './src/environments/environment.custom.ts';
//  Load  dotenv  to  work  with  process.env
require('dotenv').config();
//  environment.ts  file  structure
const version =  require('./package.json').version;
const envConfigFile = `
export  const  environment  =  {
  production:  ${process.env['PRODUCTION']},
  AdresseAPI:  '${process.env['ADRESSEAPI']}',
  appVersion:  '${version}',
  nomEnvironnement:  '${process.env['NOMENVIRONNEMENT']}',
  timeToken:  ${process.env['TIMETOKEN']},
  AdresseIcon: '${process.env['ADRESSE_ICON']}',
  bucketImagesBasePath: '${process.env['BUCKET_IMAGES_BASE_PATH']}',
  folderBucketEventPictures: '${process.env['FOLDER_BUCKET_EVENT_PICTURES']}',
  folderBucketGlobalPictures: '${process.env['FOLDER_BUCKET_GLOBAL_PICTURES']}',
  folderBucketUsersPictures: '${process.env['FOLDER_BUCKET_USERS_PICTURES']}',
};
`;
writeFile(targetPath, envConfigFile, function (err: any) {
  if (err) {
    throw console.error(err);
  } else {
    console.log('Using  custom  environment');
  }
});