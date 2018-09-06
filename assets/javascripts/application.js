// Application java scripts

// Set sounds for the game
var selectSound = new Audio('./assets/sounds/selectSound.mp3');

// Image object with ocnstructor
function giphyImage(id, title, imgStill, ImgDynamic) {
  this.id = id;
  this.title = title;
  this.imgStill = imgStill;
  this.ImgDynamic = ImgDynamic;
}

let fixedTopics = {
  // topics
  topicArr: [
    'Dog',
    'Cat',
    'Skunk',
    'Goat',
    'Horse',
    'Hamster',
    'Bird',
    'Chinchilla'
  ]
}

let giphyApp = {
  giphyUrl: 'https://api.giphy.com/v1/gifs/search',
  appiKey: "BXIZxTggsYCzLEpHJaIc54rJ47T5LXPH",
  availableTopicsArr: [],
  videoArr: [],
  initalizeApp() {
    this.availableTopicsArr = fixedTopics.topicArr;
    this.displayTopics();
  },
  displayTopics() {

    // Clear teh topi group container
    $('#topicGroup').empty();

    this.availableTopicsArr.forEach(topicItem => {
      let topicBtn = $(`
               <button class="btn btn-success btn-lg topicBtn" id="topic${topicItem}" 
                       data-value="${topicItem}">
                  <i class="fas fa-kiwi-bird"></i> ${topicItem}
               </button>
             `);

      $('#topicGroup').append(topicBtn);
    });
  },
  addTopic(newTopic) {

    // Add new topic to the end of array, only if it does not exist yet
    if (this.availableTopicsArr.indexOf(newTopic) === -1) {
      this.availableTopicsArr.push(newTopic);
    }

    // redisplay topics
    this.displayTopics();
  },
  removeTopic(targetTopic) {

    // force to lowr case for compariosn
    targetTopic = targetTopic.toLowerCase();

    // search ofr a matching element, and remove
    for (let i = 0; i < this.availableTopicsArr.length; i++) {
      // Force array item to lower case for compariosn
      let topicName = this.availableTopicsArr[i].toLowerCase();
      //if them same remove it
      if (topicName === targetTopic) {
        // remove
        this.availableTopicsArr.splice(i, 1);
        break;
      }
    }

    // redisplay topics
    this.displayTopics();
  },
  getVideos(totVideos, searchTopic) {

    // Show search type in the screen 
    $('#videoResults').empty();
    $('#videoResults').html(`<p>Results for "${searchTopic}" ( click on an image )</p>`)

    // buidl URL
    let url = this.giphyUrl;
    url += '?limit=' + totVideos;
    url += '&q=' + searchTopic;
    url += '&api_key=' + this.appiKey;

    // empty vide array
    this.videoArr = [];

    // refrence tu current object inside forEach
    let thisObj = this;

    // Make ajax request
    $.get(url)
      .then(function (response) {

        // get from each video the fixed and dynamic image
        response.data.forEach(video => {
          // Get data from video
          let id = video.id;
          // Remove word 'GIF' from title
          let title = video.title.replace(/GIF/g, '').trim();
          let imgStill = video.images.fixed_height_still.url;
          let ImgDynamic = video.images.fixed_width.url;

          // Initalize actor
          let obj = new giphyImage(id, title, imgStill, ImgDynamic);
          // add to images array
          thisObj.videoArr.push(obj);
        });

        giphyApp.displayVideos();

      })
      .catch(function (err) {
        // Display error in console
        console.error(err);
        // Send error to the screen
        $('#userMsg').empty();
        $('#userMsg').html(`<p> ${err}</p>`);
      })
  },
  displayVideos() {

    // Clear vide result area
    $('#videoGroup').empty();

    this.videoArr.forEach(function (videoItem) {

      // Construct video
      let videoHtml = ` 
          <div class="giphyImage d-inline-block">
              <div class="videoTitle">
                 <p>${videoItem.title}</p>
              </div>
              <div class="videoBody">
                 <img id=${videoItem.id} class="videoItem" src="${videoItem.imgStill}" alt="Giphy images">
              </div>
          </div>
       `;

      // Add video to the screen
      $('#videoGroup').append(videoHtml);
    });
  },
  findVideo(videoId) {

    let videoObj = '';

    for (let i = 0; i < this.videoArr.length; i++) {
      // Ge video from array
      let vObj = this.videoArr[i];

      if (vObj.id === videoId) {
        videoObj = vObj;
        break;
      }
    }

    return videoObj;

  },
  toggleVideo(imgTag) {

    // Obtain attributes for selected video
    let videoId = imgTag.attr('id');
    let currentVideoUrl = imgTag.attr('src');
    let videoObj = this.findVideo(videoId);
    let videoUrl = '';

    // Compare current gif, and change for 
    // alertnative one among fix and dynamic
    if (currentVideoUrl === videoObj.imgStill) {
      // if img still, replace with dynamic
      videoUrl = videoObj.ImgDynamic;
    } else {
      // it is dynamic, replace for still 
      videoUrl = videoObj.imgStill;
    }

    // Replace source attribute
    imgTag.attr('src', videoUrl);
  }

} //giphyApp

// functions ...........................................
function getTotalVideosToDisplay(elementId) {

  var elmnt = document.getElementById(elementId);

  if (elmnt.selectedIndex == -1) {
    return null;
  }

  return elmnt.options[elmnt.selectedIndex].text;
}

//  initalize ..........................................
giphyApp.initalizeApp();

// Events ................................................
$('#addTopicBtn').on('click', function () {

  // Control defualt behavior
  event.preventDefault();
  // Select sound
  selectSound.play();
  // Obtain value in input element
  let newTopic = $('#addTopicInput').val().trim();
  // Clear input for a possible new entry
  $('#addTopicInput').val('');

  // If new topic is not empty, add it
  if (newTopic != '') {
    giphyApp.addTopic(newTopic);
  }

})

$('#removeTopicBtn').on('click', function () {

  // Select sound
  selectSound.play();
  // Control defualt behavior
  event.preventDefault();
  // Obtain value in input element
  let removeTopic = $('#addTopicInput').val().trim();
  // Clrea input for a possible new entry
  $('#addTopicInput').val('');

  // If new topic is not empty, add it
  if (removeTopic != '') {
    giphyApp.removeTopic(removeTopic);
  }

})

$(document).on('click', '.topicBtn', function () {
  // Select sound
  selectSound.play();
  // get the total of videos to see
  let totVideos = getTotalVideosToDisplay('numVideos');
  // get data-value from selected button
  let searchTopic = $(this).attr('data-value');
  // display videos
  giphyApp.getVideos(totVideos, searchTopic)

})

$(document).on('click', '.videoItem', function () {
  // Select sound
  selectSound.play();
  // Togled from fix to dynamic
  giphyApp.toggleVideo($(this));
})