import createHttpError  from 'http-errors';

export const errorHandler = (err, req, res, next) => {
      if (err.name === "ValidationError") {
    return res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
    if (err instanceof createHttpError ) {
        res.status(err.status).json({
            status: err.status,
            message: err.message,
            data: err,
        });
        return;
     }
    
    
    res.status(500).json({
        status: 500,
        message: "Something went wrong",
        data: err.message,
    });
}

