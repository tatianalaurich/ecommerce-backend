export const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);

    res.status(err.statusCode || 500).json({
        status: "error",
        error: err.message || "Error interno del servidor"
    });
};