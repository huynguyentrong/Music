const PLAYER_STORAGE_KEY = "USER_PLAYER";
const playList = document.querySelector(".playlist");
const player = document.querySelector(".player");
const cd = document.querySelector(".cd");
const heading = document.querySelector("header h2");
const cdThumb = document.querySelector(".cd-thumb");
const audio = document.querySelector("#audio");
const playBtn = document.querySelector(".btn-toggle-play");
const progress = document.querySelector(".progress");
const nextBtn = document.querySelector(".btn-next");
const prevBtn = document.querySelector(".btn-prev");
const random = document.querySelector(".btn-random");
const repeat = document.querySelector(".btn-repeat");
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRamdom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Sold-Out",
      singer: "Hawk-Nelson",
      path: "./music/Sold-Out-Hawk-Nelson.mp3",
      image: "./img/sold-out_37.jpg",
    },
    {
      name: "Tan-Cung-Noi-Nho",
      singer: "Will-Han-Sara",
      path: "./music/Tan-Cung-Noi-Nho-New-Version-Will-Han-Sara.mp3",
      image: "./img/tan cung cua noi nho.jpg",
    },
    {
      name: "Thu-Cuoi",
      singer: "Mr-T-Hang-BingBoong",
      path: "./music/Thu-Cuoi-Yanbi-Mr-T-Hang-BingBoong.mp3",
      image: "./img/Thu cuoi.jpg",
    },
    {
      name: "Người nào đó",
      singer: "JustaTee",
      path: "./music/Nguoi-Nao-Do-JustaTee.mp3",
      image: "./img/nguoi nao do.jpg",
    },
    {
      name: "Vo-Tinh",
      singer: "Xesi",
      path: "./music/Vo-Tinh-Xesi-Hoaprox.mp3",
      image: "./img/Vo tinh.jpg",
    },
    {
      name: "Vo-Tinh",
      singer: "Xesi",
      path: "./music/Vo-Tinh-Xesi-Hoaprox.mp3",
      image: "./img/Vo tinh.jpg",
    },
  ],
};

const loadConfig = () => {
  random.classList.toggle("active", app.isRamdom);
  repeat.classList.toggle("active", app.isRepeat);
  app.isRamdom = app.config.isRamdom;
  app.isRepeat = app.config.isRepeat;
};
const handleEvents = () => {
  const cdWidth = cd.offsetWidth;
  const cdThumbAnimate = cdThumb.animate(
    [
      {
        transform: "rotate(360deg)",
      },
    ],
    {
      duration: 10000,
      iterations: Infinity,
    }
  );
  cdThumbAnimate.pause();
  document.onscroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const newCdWidth = cdWidth - scrollTop;
    cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
    cd.style.opacity = newCdWidth / cdWidth;
  };
  // xử lý khi click Play
  playBtn.onclick = () => {
    if (app.isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };
  // khi song được play
  audio.onplay = () => {
    app.isPlaying = true;
    player.classList.add("playing");
    cdThumbAnimate.play();
  };
  //khi song được pause
  audio.onpause = () => {
    app.isPlaying = false;
    player.classList.remove("playing");
    cdThumbAnimate.pause();
  };
  // khi tiến độ bài hát thay đổi
  audio.ontimeupdate = () => {
    if (audio.duration) {
      const progressPercent = Math.floor(
        (audio.currentTime / audio.duration) * 100
      );
      progress.value = progressPercent;
    }
  };
  //xử lý next song khi audio ended
  audio.onended = () => {
    if (app.isRepeat) {
      audio.play();
    } else {
      nextBtn.click();
    }
  };
  // xử lý khi tua song
  progress.onchange = (e) => {
    const seektime = (audio.duration / 100) * e.target.value;
    audio.currentTime = seektime;
  };
  // khi next song
  nextBtn.onclick = () => {
    if (app.isRamdom) {
      playRandomSong();
    } else {
      nextSong();
    }
    audio.play();
    render();
    scrollToActiveSong();
  };
  // khi prev song
  prevBtn.onclick = () => {
    if (app.isRamdom) {
      playRandomSong();
    } else {
      prevSong();
    }
    audio.play();
    render();
    scrollToActiveSong();
  };
  random.onclick = () => {
    app.isRamdom = !app.isRamdom;
    setConfig("isRamdom", app.isRamdom);
    random.classList.toggle("active", app.isRamdom);
  };
  // xử lý lặp lại song
  repeat.onclick = () => {
    app.isRepeat = !app.isRepeat;
    setConfig("isRepeat", app.isRepeat);
    repeat.classList.toggle("active", app.isRepeat);
  };
  // lắng nghe hành vi click vào playlist
  playList.onclick = (e) => {
    const songNode = e.target.closest(".song:not(.active)");
    if (songNode || e.target.closest(".option")) {
      app.currentIndex = Number(songNode.dataset.index);
      loadCurrentSong();
      render();
      audio.play();
    }
  };
};
const setConfig = (key, value) => {
  app.config[key] = value;
  localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(app.config));
};
const loadCurrentSong = () => {
  heading.textContent = app.songs[app.currentIndex].name;
  cdThumb.style.backgroundImage = `url("${app.songs[app.currentIndex].image}")`;
  audio.src = app.songs[app.currentIndex].path;
};
const nextSong = () => {
  app.currentIndex++;
  if (app.currentIndex >= app.songs.length) {
    app.currentIndex = 0;
  }
  loadCurrentSong();
};
const scrollToActiveSong = () => {
  const songActive = document.querySelector(".song.active");
  songActive.scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "nearest",
  });
};
const prevSong = () => {
  app.currentIndex--;
  if (app.currentIndex < 0) {
    app.currentIndex = app.songs.length - 1;
  }
  loadCurrentSong();
};
const playRandomSong = () => {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * app.songs.length);
  } while (newIndex === app.currentIndex);
  app.currentIndex = newIndex;
  loadCurrentSong();
};
const render = () => {
  const htmls = app.songs.map((song, index) => {
    return ` <div class="song ${
      index === app.currentIndex ? "active" : ""
    }" data-index=${index}>
    <div
      class="thumb"
      style="
        background-image: url('${song.image}');
      "
    ></div>
    <div class="body">
      <h3 class="title">${song.name}</h3>
      <p class="author">${song.singer}</p>
    </div>
    <div class="option">
      <i class="fas fa-ellipsis-h"></i>
    </div>
  </div>`;
  });
  playList.innerHTML = htmls.join("");
};
loadConfig();
loadCurrentSong();
handleEvents();
render();
