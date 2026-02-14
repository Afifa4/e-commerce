const { handleImageUpload } = require("../../helpers/cloudinary");

async function uploadImage(req, res) {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: "No file received. Please select an image (JPEG, PNG, GIF, or WebP).",
      });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataUrl = `data:${req.file.mimetype};base64,${b64}`;
    const result = await handleImageUpload(dataUrl);

    let secureUrl = result.secure_url;
    if (secureUrl.startsWith("/")) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      secureUrl = `${baseUrl}${secureUrl}`;
    }

    res.json({
      success: true,
      result: { ...result, secure_url: secureUrl },
    });
  } catch (error) {
    const message = error.message || "Error uploading image";
    res.status(500).json({
      success: false,
      message,
    });
  }
}

module.exports = { uploadImage };
