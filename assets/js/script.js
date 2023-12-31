const btn = document.querySelector("#btn");
const resultArea = document.querySelector("#resultArea");
const sortWord = document.querySelector("#sortWord");
const loading = document.querySelector("#loading");

const url = `https://itunes.apple.com/search`;
let currentPlayingAudio = null;
let resultData = [];

/**********************************************************
 * @function getSongTemplate
 * @param {*} item
 * 楽曲のHTMLテンプレートを返す
 *********************************************************/
function getTemplate(item) {
  return `<div class="flex bg-white p-4">
            <div class="mr-6">
                <img src="${item.artworkUrl100}" alt="" />
            </div>
            <div class="flex flex-col">
                <h2 class="text-lg mb-4 text-black font-bold">${item.trackName}</h2>
                <div class="flex gap-4">
                    <button class="js-btn-play btn btn-info text-white w-[160px]" data-preview-url="${item.previewUrl}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 icon icon-tabler icon-tabler-player-play-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" stroke-width="0" fill="currentColor" />
                        </svg>
                        視聴する
                    </button>
                    <button class="js-btn-stop btn btn-info text-white w-[160px]" data-preview-url="${item.previewUrl}">     
                        <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 icon icon-tabler icon-tabler-player-pause-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M9 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" stroke-width="0" fill="currentColor" />
                            <path d="M17 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" stroke-width="0" fill="currentColor" />
                        </svg>
                        停止する
                    </button>
                </div>
            </div>
        </div>`;
}

/**********************************************************
 * @function toggleLoadingState
 * @param {*} item
 * @returns
 *********************************************************/
function toggleLoadingState() {
  loading.classList.toggle("hidden");
}

/**********************************************************
 * @function updateDOMWithMusicData
 * @param {*} data
 * APIから取得したデータをもとに楽曲一覧のHTMLを挿入する
 *********************************************************/

function updateDOMWithMusicData(data) {
  const result = data.results.reduce(
    (acc, item) => acc + getTemplate(item),
    ""
  );
  resultData = [...data.results];
  resultArea.innerHTML = result;
}

/**********************************************************
 * @function toggleSound
 * @param {*} item
 * @returns
 *********************************************************/
function toggleSound(event) {
  const isPlayButton = event.target.closest(".js-btn-play");
  const previewUrl =
    event.target.closest("button").getAttribute("data-preview-url") || null;

  if (currentPlayingAudio) {
    currentPlayingAudio.pause();
  }

  if (isPlayButton) {
    currentPlayingAudio = new Audio(previewUrl);
    currentPlayingAudio.play();
  } else {
    currentPlayingAudio = null;
  }
}

/**********************************************************
 * @function sortResultData
 * @param {*} item
 * @returns
 *********************************************************/
function sortResultData() {
  const songKeyword = sortWord.value;

  if (!songKeyword.trim()) {
    updateDOMWithMusicData({ results: resultData });
    return;
  }

  const sortResult = resultData.filter((item) =>
    item.trackName.includes(songKeyword)
  );
  const result = sortResult.reduce((acc, item) => acc + getTemplate(item), "");

  resultArea.innerHTML = result;
}

/**********************************************************
 * @function fetchMusicData
 * @param {*} item
 * @returns
 *********************************************************/
async function fetchMusicData() {
  const keyword = document.querySelector("#keyword").value;
  const limit = document.querySelector("#limit").value || 30;

  if (!keyword) {
    return false;
  }

  toggleLoadingState();

  try {
    const params = {
      lang: "ja_JP",
      entry: "music",
      media: "music",
      entity: "musicTrack",
      country: "JP",
      term: keyword,
      limit: limit,
    };

    const res = await axios.get(url, { params });

    resultArea.classList.remove("hidden");

    // const data = await res.json();
    updateDOMWithMusicData(res.data);
  } catch (error) {
    console.error("エラーが発生しました:", error);
  } finally {
    toggleLoadingState();
  }
}

btn.addEventListener("click", fetchMusicData);
resultArea.addEventListener("click", toggleSound);
sortWord.addEventListener("keyup", sortResultData);
