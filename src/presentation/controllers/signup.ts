import { AddAccount } from '../../domain/useCases/add-account'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'
import { Controller, HttpResponse, EmailValidator, HttpRequest } from '../protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) return badRequest(new InvalidParamError('passwordConfirmation'))
      const isValidEmail: boolean = this.emailValidator.isValid(email)
      if (!isValidEmail) return badRequest(new InvalidParamError('email'))
      const added = this.addAccount.add({
        name,
        email,
        password
      })
      return {
        statusCode: 201,
        body: added
      }
    } catch (error) {
      return serverError()
    }
  }
}
