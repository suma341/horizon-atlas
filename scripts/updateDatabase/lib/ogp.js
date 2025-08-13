import ogs from 'open-graph-scraper';

export async function getOGP(url) {
  try {
    const options = { url };
    const { result } = await ogs(options);
    return result
  } catch (error) {
    console.error(error);
  }
}
