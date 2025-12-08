const API_PATH = "http://v2991160.hosted-by-vdsina.ru/api/v1/"

const getBaseUrl = () => {
  let url

  try {
    url = new URL(API_PATH)
  } catch (error) {
    url = new URL(API_PATH, window.location.origin)
  }

  return String(url ?? "").replace(/\/$/, "")
}

export const baseUrl = getBaseUrl()
