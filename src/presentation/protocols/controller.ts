import { HttpResponse } from './http'

export interface Controller {
  handle: (httpRequest) => Promise<HttpResponse>
}
