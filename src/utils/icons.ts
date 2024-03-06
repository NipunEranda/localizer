function importAll(r: any) {
  return r.keys().map(r);
}

const img = importAll(
  require.context("../assets/img", false, /\.(png|jpe?g|svg)$/)
);

const icons = importAll(
  require.context("../assets/img/icons/", false, /\.(png|jpe?g|svg)$/)
);

const images = img.concat(icons);

export function getIcon(name: string) {
  return images.filter((i: string) => i.includes(name))[0];
}
