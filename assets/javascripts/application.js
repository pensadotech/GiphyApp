// Game java scripts

let fixedTopics = {
    // topics
    topicArr: [
        'Dog',
        'Cat',
        'Cow',
        'Chiken',
        'Horse',
        'Hamster',
        'bird',
        'Turtle',
        'Chinchilla',
        'Skunk',
        'Monkey',
        'Fish',
        'Goldfish'
    ]
}

let giphyApp = {

    availableTopicsArr: [],
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
            console.log(this.availableTopicsArr)
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
    displayVideos(searchTopic) {
        
        console.log(searchTopic)

        // made ajax request
    }

} //giphyApp

//  initalize ..........................................
console.log("GifTastic application");

giphyApp.initalizeApp();
console.log(giphyApp);


// Events ................................................
$('#addTopicBtn').on('click', function () {

    // Control defualt behavior
    event.preventDefault();
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

$(document).on('click','.topicBtn',function(){
    
    // get data-value from selected button
    let searchTopic = $(this).attr('data-value');
    // display videos
    giphyApp.displayVideos(searchTopic)

})