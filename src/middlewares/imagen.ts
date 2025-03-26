import { Request, Response, NextFunction } from "express";
import path from "path";
import { Endpoint, S3 } from "aws-sdk";
import multer from "multer";
import sharp from "sharp";

// Configuración de multer para manejar la carga de archivos
const storage = multer.memoryStorage(); // Guarda los archivos en la memoria para procesamiento
const upload = multer({ storage: storage });

const spacesEndPoint = new Endpoint(process.env.ENDPOINTSPACE);

const awsS3 = new S3({
  endpoint: spacesEndPoint,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
});

interface CustomRequest extends Request {
  imageURL?: string;
  imageURLs?: string[];
}

// Middleware para procesar la imagen con Sharp antes de subirla
const processImage = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return next(err);
    }

    if (!req.file) {
      return next(new Error("Error: No file uploaded"));
    }

    try {
      // Verificar el tipo de archivo
      const isFileTypeValid = checkFileType(req.file);
      if (!isFileTypeValid) {
        throw new Error("Error: Invalid file type");
      }

      let imageBuffer = req.file.buffer;

      // Si la imagen es WebP, convertirla a PNG
      if (path.extname(req.file.originalname).toLowerCase() === ".webp") {
        imageBuffer = await convertWebPToPNG(imageBuffer);
      }

      // Redimensionar la imagen usando Sharp
      const resizedImageBuffer = await sharp(imageBuffer)
        .resize(400) // Redimensionar a 400px de ancho
        .toFormat("jpeg") // Convertir a JPEG (puedes cambiarlo a PNG si lo prefieres)
        .toBuffer();

      // Subir la imagen procesada a AWS S3
      const uploadedImage = await uploadToAWSS3(resizedImageBuffer, "perfil");

      // Agregar la URL de la imagen al objeto de la solicitud para que esté disponible en el controlador
      req.imageURL = uploadedImage.url;

      // Continúa con el siguiente middleware
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  });
};

const processImageCover = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return next(err);
    }

    if (!req.file) {
      return next(new Error("Error: No file uploaded"));
    }

    try {
      // Verificar el tipo de archivo
      const isFileTypeValid = checkFileType(req.file);
      if (!isFileTypeValid) {
        throw new Error("Error: Invalid file type");
      }

      let imageBuffer = req.file.buffer;

      // Si la imagen es WebP, convertirla a PNG
      if (path.extname(req.file.originalname).toLowerCase() === ".webp") {
        imageBuffer = await convertWebPToPNG(imageBuffer);
      }

      // Redimensionar la imagen usando Sharp
      const resizedImageBuffer = await sharp(imageBuffer)
        .resize(800) // Redimensionar a 800px de ancho
        .toFormat("jpeg") // Convertir a JPEG (puedes cambiarlo a PNG si lo prefieres)
        .toBuffer();

      // Subir la imagen procesada a AWS S3
      const uploadedImage = await uploadToAWSS3(resizedImageBuffer, "portada");

      // Agregar la URL de la imagen al objeto de la solicitud para que esté disponible en el controlador
      req.imageURL = uploadedImage.url;

      // Continúa con el siguiente middleware
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  });
};

const processMultipleImage = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  upload.array("images", 50)(req, res, async (err) => {
    // 'images' es el nombre del campo que contiene las imágenes y '10' es el número máximo de archivos permitidos.
    if (err) {
      return next(err);
    }

    if (!req.files || req.files.length === 0) {
      return next(new Error("Error: No files uploaded"));
    }

    try {
      // Almacenar las URLs de las imágenes procesadas
      const imageUrls: string[] = [];

      for (const file of req.files as Express.Multer.File[]) {
        const isFileTypeValid = checkFileType(file);
        if (!isFileTypeValid) {
          throw new Error("Error: Invalid file type");
        }

        let imageBuffer = file.buffer;

        // Si la imagen es WebP, convertirla a PNG
        if (path.extname(file.originalname).toLowerCase() === ".webp") {
          imageBuffer = await convertWebPToPNG(imageBuffer);
        }

        // Redimensionar la imagen usando Sharp
        const resizedImageBuffer = await sharp(imageBuffer)
          .resize(400) // Redimensionar a 400px de ancho
          .toFormat("jpeg") // Convertir a JPEG (puedes cambiarlo a PNG si lo prefieres)
          .toBuffer();

        // Subir la imagen procesada a AWS S3
        const uploadedImage = await uploadToAWSS3(resizedImageBuffer, "perfil");

        // Agregar la URL de la imagen a la lista
        imageUrls.push(uploadedImage.url);
      }

      // Agregar las URLs de las imágenes al objeto de la solicitud
      req.imageURLs = imageUrls;

      // Continúa con el siguiente middleware
      next();
    } catch (error) {
      console.log(error);
      // Manejo de errores
      next(error);
    }
  });
};

// Verificar el tipo de archivo
const checkFileType = (file) => {
  const filetypes = /jpeg|jpg|png|gif|webp|jfif|svg/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  return extname && mimetype;
};

// Función para convertir WebP a PNG
const convertWebPToPNG = async (imageBuffer) => {
  try {
    const convertedImage = await sharp(imageBuffer)
      .toFormat("png") // Convertir a PNG
      .toBuffer();
    return convertedImage;
  } catch (error) {
    console.error("Error al convertir la imagen:", error);
    throw new Error("Error al convertir la imagen WebP a PNG");
  }
};

// Función para subir la imagen a AWS S3
const uploadToAWSS3 = async (imageBuffer, folder) => {
  try {
    const uploadResult = await awsS3
      .upload({
        Bucket: process.env.BUCKET_NAME,
        Key: `${folder}/${Date.now()}.png`, // Ruta y nombre de archivo en Digital Ocean Spaces
        Body: imageBuffer,
        ACL: "public-read",
        ContentType: "image/png", // O puedes usar 'image/jpeg' si prefieres JPEG
      })
      .promise();

    return {
      url: uploadResult.Location, // Devuelve la URL de la imagen en Digital Ocean Spaces
    };
  } catch (error) {
    throw new Error("Error al subir la imagen a Digital Ocean Spaces");
  }
};

const deletFile = async (fieldname: string) => {
  const Fieldname = fieldname.split(".com/");
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: Fieldname[1],
  };

  try {
    await awsS3.deleteObject(params).promise();
    console.log("Archivo eliminado correctamente.");
  } catch (error) {
    if (error.code === "NoSuchKey") {
      console.log("El archivo no existe en Amazon S3.");
    } else {
      console.error("Error al intentar eliminar el archivo:", error);
    }
  }
};

export { processImage, deletFile, processImageCover, processMultipleImage };
