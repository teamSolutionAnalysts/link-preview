const cheerio = require("cheerio");
const request = require("request");

const getByProp = ($, property) =>
  $(`meta[property='${property}']`)
    .first()
    .attr("content") || null;

function collectMeta($, url, deepVideo) {
  const ogUrl = getByProp($, "og:url");
  const ogVideoUrl = getByProp($, "og:video:secure_url") || getByProp($, "og:video:url");
  const res = {
    url,
    image: getByProp($, "og:image"),
    imageWidth: getByProp($, "og:image:width"),
    imageHeight: getByProp($, "og:image:height"),
    imageType: getByProp($, "og:image:type"),
    title: getByProp($, "og:title"),
    description: getByProp($, "og:description"),
    siteName: getByProp($, "og:site_name"),
    ogVideoUrl: (ogVideoUrl || "").indexOf("youtube.com") >= 0 ? null : ogVideoUrl,
    ogUrl,
    youtube:
      (ogVideoUrl || "").indexOf("youtube.com") >= 0
        ? ogVideoUrl
        : !ogUrl ? null : ogUrl.indexOf("youtube.com") >= 0 ? `https://youtube.com/embed/${getValue(ogUrl, "v")}` : null
  };
  if (deepVideo && !res.ogVideoUrl && !res.youtube)
    return getDeepVideo(
      (getByProp($, "og:description") || "").match(/(http(s)?:\/\/([a-z0-9]+\.)+[a-z0-9]+(\/[a-z0-9]+)?)/gi)
    ).then(ogVideoUrl => {
      videoUrl = ogVideoUrl.filter(url => !!url)[0] || "";
      return Object.assign(res, {
        [videoUrl.indexOf("youtube.com") >= 0 ? "youtube" : "ogVideoUrl"]: videoUrl || null
      });
    });
  return Promise.resolve(res);
}

const getDeepVideo = urls => {
  if (!urls) return Promise.resolve([null]);
  return Promise.all(
    urls.map(url =>
      linkPreview
        .makeRequest(url, 10000)
        .then(
          ({ response, body }) =>
            !response || response.statusCode !== 200
              ? null
              : getByProp(cheerio.load(body), "og:video:secure_url") || getByProp(cheerio.load(body), "og:video:url")
        )
    )
  );
};

const getValue = (url, name) => {
  const i = url.indexOf(`${name}=`) + name.length + 1;
  const j = url.indexOf("&", i);
  const end = j < 0 ? url.length : j;
  return i < 0 ? "" : url.slice(i, end);
};

const getError = url => ({
  url,
  image: null,
  imageWidth: null,
  imageHeight: null,
  imageType: null,
  title: undefined,
  description: null,
  siteName: null
});

function linkPreview(url, deepVideo = false, timeout = 100000) {
  if (!url || url === "") return Promise.reject({ message: "You must add a valid url" });
  if (!url.match(/^http(s)?:\/\/[a-z]+\.[a-z]+(.)+/i)) return Promise.resolve(getError(url));
  return linkPreview.makeRequest(url, timeout).then(({ response, body }) => {
    if (!response) return getError(url);
    if (response.statusCode === 200) return collectMeta(cheerio.load(body), url, deepVideo);
    return getError(url);
  });
}

linkPreview.makeRequest = (url, timeout) =>
  new Promise((resolve, reject) => {
    request(url, { timeout: timeout }, (error, response, body) => resolve({ body, response }));
  });

module.exports = linkPreview;
