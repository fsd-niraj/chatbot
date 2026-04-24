import { Request, Response, NextFunction } from 'express'
import { ValidateError } from 'tsoa'

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof ValidateError) {
    res.status(422).json({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        statusCode: 422,
        details: err.fields,
      },
    })
    return
  }

  if (typeof err === 'object' && err !== null && 'statusCode' in err) {
    const e = err as { statusCode: number; message: string }
    res.status(e.statusCode).json({
      success: false,
      error: {
        message: e.message,
        code: 'ERROR',
        statusCode: e.statusCode,
      },
    })
    return
  }

  if (err instanceof Error) {
    console.error(err)
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
        statusCode: 500,
      },
    })
    return
  }

  next()
}
