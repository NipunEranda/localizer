function importAll(r: __WebpackModuleApi.RequireContext) {
  return r.keys().map<string>(r);
}

const img: string[] = importAll(
  require.context("../assets/img", false, /\.(png|jpe?g|svg)$/)
);

const icons: string[] = importAll(
  require.context("../assets/img/icons/", false, /\.(png|jpe?g|svg)$/)
);

const images: string[] = img.concat(icons);

export default function getIcon(name: string) {
  return images.filter((value: string) => value.includes(name))[0];
}
