const getImagePath = (image: string) => {
  return `url("http://${window.location.hostname}:8999/image?path=${image}")`
}

export default getImagePath
