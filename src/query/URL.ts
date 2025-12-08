export const trimLastSlashes = (url: string) => {
  return url.replace(/\/*$/, "")
}

export const squashSlashes = (url: string) => {
  return url.replace(/\/+/g, "/")
}
