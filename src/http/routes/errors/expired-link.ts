export class ExpiredLinkError extends Error {
  constructor() {
    super('Expired Link.')
  }
}
