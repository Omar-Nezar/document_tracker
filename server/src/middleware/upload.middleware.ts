import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";

const uploadDirectory = path.join(
    process.cwd(),
    "uploads",
    "transactions"
);

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
        recursive: true,
    });
}

const storage = multer.diskStorage({

    destination: (
        req,
        file,
        cb
    ) => {
        cb(null, uploadDirectory);
    },

    filename: (
        req,
        file,
        cb
    ) => {

        const extension = path.extname(file.originalname);

        const filename = `${crypto.randomUUID()}${extension}`;

        cb(null, filename);
    },
});

const fileFilter: multer.Options["fileFilter"] = (
    req,
    file,
    cb
) => {

    const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
    ];

    if (
        allowedTypes.includes(
            file.mimetype
        )
    ) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only PDF, JPG, and PNG files are allowed"
            )
        );
    }
};

export const uploadDocuments = multer({
    storage,

    fileFilter,

    limits: {
        fileSize: 10 * 1024 * 1024,

        files: 5,
    },
});