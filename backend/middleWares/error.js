import ErrorHandler from '../utils/errorHandler.js'

export default (err, req, res, next) => {
    let error = {
        statusCode: err?.statusCode || 500,
        message : err?.message || 'Internal Server Error'
    };

    // Handle invalid mongoose ID Errror
    if(err.name === 'CastError') {
        const message =`resourse not found. invalid :${err?.path}`
        error = new ErrorHandler(message, 404);
    }
     // Handle validation Errror  ************* SORRY NOT CLEAR***********
     if(err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((value) => value.message)
        error = new ErrorHandler(message, 400);
    }

      // Handle mongoose Duplicate Key Errror
      if(err.code === 11000) {
        const message =`Duplicate ${Object.keys(err.keyValue)} entered`
        error = new ErrorHandler(message, 400);
    }

    // Handle Wrong JWT ERROr 
    if(err.name === 'JsonWebTokenError') {
        const message =`JSON Web Token is invalid , try again`
        error = new ErrorHandler(message, 400);
    }

      // Handle Expired JWT ERROr 
      if(err.name === 'TokenExpiredError') {
        const message =`JSON Web Token is invalid , try again`
        error = new ErrorHandler(message, 400);
    }


    if(process.env.NODE_ENV === 'DEVELOPMENT') {
        res.status(error.statusCode).json({
            message : error.message,
            error: err,
            stack:err.stack,
        })
    } 

    if(process.env.NODE_ENV === 'PRODUCTION') {
        res.status(error.statusCode).json({
        message : error.message,
        })
    } 
}; 