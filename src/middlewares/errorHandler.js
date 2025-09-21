import {HttpError}   from 'http-errors';

export const errorHandler = (err, req, res, next) => {
if (err.name === 'CastError') {
    return res.status(404).json({
      status: 404,
      message: `Contact not found`,
      data: {message: `Contact not found`}
    });
  }


      if (err.name === "ValidationError") {
    return res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
    if (err instanceof HttpError  ) {
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

