// Initialize app
var myApp = new Framework7();

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;


// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

//relevant variables
var ImagesURL = [];
var Titles = [];
var Contents = [];
var Question = [];
var Answers = [];
var Next = [];
var Back = [];

/*function makeApiCall() {
    var params = {
        // The ID of the spreadsheet to retrieve data from.
        spreadsheetId: '16oXmBaKcVvEzv_5421m5FgjuVYE7C7wUytzL8_2A7w0',  // TODO: Update placeholder value.
        //spreadsheetId: '19mGKx7aMqjc_bSVCJ_04tnwTAguLLGK5kPrkF7wI4jE',  // TODO: Update placeholder value.
        // The A1 notation of the values to retrieve.
        range: 'B2:J9',  // TODO: Update placeholder value.
        // How values should be represented in the output.
        // The default render option is ValueRenderOption.FORMATTED_VALUE.
        valueRenderOption: 'FORMATTED_VALUE',  // TODO: Update placeholder value.
        // How dates, times, and durations should be represented in the output.
        // This is ignored if value_render_option is
        // FORMATTED_VALUE.
        // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
        dateTimeRenderOption: 'SERIAL_NUMBER',  // TODO: Update placeholder value.
        majorDimension: 'ROWS',
    };

    var request = gapi.client.sheets.spreadsheets.values.get(params);

    request.then(function(response) {
        // TODO: Change code below to process the `response` object:
        stringParse(response.result.values);
        console.log(response.result);
    }, function(reason) {
        console.error('error: ' + reason.result.error.message);
    });
}*/

// ------------------------------------------------------------------------------------------------------------------
//This function is my main addition to this code.  It is meant to take in the relevant data and format it for later use
function stringParse(info){
    // Local varibales that are used to hold temp information.
    var AnswersList = [];
    var NextList = [];
    //loops through information given to format it
    for(i = 0; i < info.length; i++){
        // Pushes all of the titles, contents, and questions into one list
        this.ImagesURL.push(info[i][0]);        
        this.Titles.push(info[i][1]);
        this.Contents.push(info[i][2]);
        this.Question.push(info[i][3]);
            console.log(info[i][0]);
        // Pushes all of the answers into one list
        for(q = 4; q < info[i].length; q++){
            AnswersList.push(info[i][q].slice(0, info[i][q].length - 3));
            NextList.push(parseInt(info[i][q].slice(info[i][q].length - 2, info[i][q].length - 1)));
        }

        // Checks to see if there are any answers listed in the row
        this.Answers.push(AnswersList);
        this.Next.push(NextList);
        AnswersList = [];
        NextList = [];
    }
    
    // Starts to output the first node in the decision tree.
    nodeOutput(0);
}

// ------------------------------------------------------------------------------------------------------------------
function nodeOutput(index) {
    var textOutput = [];
    // Output the title inside the title at the html.
    
    
    document.getElementById('title').innerHTML = Titles[index];

    // Output the content and question inside the text at the html.
    if (Question[index]) {
        textOutput = Contents[index] + "</br>" + Question[index];
    }

    else{
        textOutput = Contents[index];
    }

    document.getElementById('text').innerHTML = textOutput;   
    
    clearButtons();
    
    const INSIDE_DIV = 2;                                   // How many div can contain in row.
    // document.getElementById("text").appendChild(createChat());
    // document.getElementsByClassName("chat-message-list")[0].appendChild(createMsgSpinner());
    // document.getElementsByClassName("chat-message-list")[0].appendChild(createMsg("message-left", "http://www.pvhc.net/img8/niexjjzstcseuzdzkvoq.png", "Hello world"));   // createMsg(direction, imgSrc, text, time)     // Direction should be message-left or message-right => Admin Left, User Right.
    // document.getElementsByClassName("chat-message-list")[0].appendChild(createMsg("message-right", "http://www.pvhc.net/img8/niexjjzstcseuzdzkvoq.png", "Hello world"));

    // Creates answer buttons.
    if(Question[index]) {
        var mainDiv = document.createElement("div");        // mainDiv will contain 2 divs inside
        mainDiv.setAttribute("class", "mainDiv");           // set class
        
        // Creates the all buttons we need using a for loop.
        for(i = 0; i < Answers[index].length; i++)
        {
            if(mainDiv.childElementCount == INSIDE_DIV) {   // If the main div contain 2 children
                answers.appendChild(mainDiv);               // append it to the dom.
                mainDiv = document.createElement("div");    // create new div with 0 children.
                mainDiv.setAttribute("class", "mainDiv");   // set class.
            }
            var div = document.createElement("div");
            if(i % 2 == 0) {
                div.setAttribute("class", "left");
            } else {
                div.setAttribute("class", "right");
            }

            var image;
            if(index == 0) {
                image = document.createElement("img");
                image.setAttribute("id", "image" + i);
                image.className = "icon";
                image.setAttribute("src", ImagesURL[i]);
            }
            
            var paragraph = document.createElement("p");
            paragraph.className = "icon_paragraph";
            paragraph.setAttribute("id", "par" + i);
            
            var button = document.createElement("button");  
            button.id = i;
            button.className = "categoryBtn";
            button.addEventListener ("click", function() {
                var temp = Next[index][this.id];
                Back.push(index);      
                nodeOutput(temp-1);
            });
            
            paragraph.appendChild(document.createTextNode(Answers[index][i]));
            div.appendChild(button);
            div.appendChild(paragraph);
            if(index == 0) {
                button.appendChild(image);
            } else {
                button.appendChild(paragraph);
                paragraph.style = "color: white"
            }
            // button.innerHTML = Answers[index][i];
            var answers = document.getElementById("answers");
            mainDiv.appendChild(div);
            if(i == Answers[index].length - 1) {        // if the number of the buttons if odd.
                answers.appendChild(mainDiv);           // add the last button to the DOM.
            }
            
        }
    }

    // When its the last node to show - ask if the information helped.
    else {
      
        mainDiv = document.createElement("div");    // create new div with 0 children.
        mainDiv.setAttribute("class", "mainDiv");   // set class.

        //innerHTML = "<br><br>Was the information helpful?";
        var helpedText = document.createElement("p"); 
        helpedText.innerHTML = "<br><br>Was the information helpful?";
        mainDiv.appendChild(helpedText);

        
        // Left div creation - 'no' button.
        var lefParagraph = document.createElement("p");
        lefParagraph.className = "icon_paragraph";
        lefParagraph.style = "color: white"
        lefParagraph.appendChild(document.createTextNode("No"));        
        
        var leftDiv = document.createElement("div");
        leftDiv.setAttribute("class", "left");
        
        var leftButton = document.createElement("button");  
        leftButton.className = "categoryBtn";
        leftButton.addEventListener ("click", function() {
            Back = [];
            ga('send', 'event', {
                eventCategory: 'Information quality',
                eventAction: 'click',
                eventLabel: 'Not helpful content: ' + Contents[index]
            });
            // ga('send', 'pageview', 'Not helpful content: ' + Contents[index]);
            // ga('send', 'event', 'Not helpful content: ' + Contents[index]);
            // ga('send', 'item', 'Not helpful content: ' + Contents[index]);
            nodeOutput(0);    
        });
        
        leftDiv.appendChild(leftButton);
        leftDiv.appendChild(lefParagraph);
        leftButton.appendChild(lefParagraph)        
        
        mainDiv.appendChild(leftDiv);        
        
        // Right div creation - 'yes' button.
        var rightParagraph = document.createElement("p");
        rightParagraph.className = "icon_paragraph";
        rightParagraph.style = "color: white"
        rightParagraph.appendChild(document.createTextNode("Yes"));                
        
        var rightDiv = document.createElement("div");
        rightDiv.setAttribute("class", "right");
        
        var rightButton = document.createElement("button");  
        rightButton.className = "categoryBtn";
        rightButton.addEventListener ("click", function() {
            Back = [];
            ga('send', 'item', 'Yes ' + Contents[index]);
            nodeOutput(0);              
        });
        
        rightDiv.appendChild(rightButton);
        rightDiv.appendChild(rightParagraph);
        rightButton.appendChild(rightParagraph)

        mainDiv.appendChild(rightDiv);

        document.getElementById("answers").appendChild(mainDiv);  
    }
}

// ------------------------------------------------------------------------------------------------------------------
// Clear the buttons from the screen when needed.
function clearButtons(){
    var length = document.getElementById('answers').childElementCount;
    var div =  document.getElementById('answers');
    for(i = 0; i < length; i++){
        div.removeChild(document.getElementsByClassName("mainDiv")[0]);
  }
}


// ------------------------------------------------------------------------------------------------------------------
// Initiates the client
/*function initClient() {
    var API_KEY = 'AIzaSyDfXNTAOiF2foSfcXh-zrhJpuZkZmqwVak';  // TODO: Update placeholder with desired API key.
    
    //var API_KEY = 'AIzaSyD1548_G7dQRFH7us5ziBpOp-DRRQ3w1yk';  // TODO: Update placeholder with desired API key.
    var CLIENT_ID = '264708841934-nceklkm8rbtougbded3ihr25cr1v30lq.apps.googleusercontent.com';  // TODO: Update placeholder with desired client ID.
    //var CLIENT_ID = '371986161218-v1ejafinod0idod1dl5jll2nrap36q5o.apps.googleusercontent.com';  // TODO: Update placeholder with desired client ID.
    // TODO: Authorize using one of the following scopes:
    //   'https://www.googleapis.com/auth/drive'
    //   'https://www.googleapis.com/auth/drive.file'
    //   'https://www.googleapis.com/auth/drive.readonly'
    //   'https://www.googleapis.com/auth/spreadsheets'
    //   'https://www.googleapis.com/auth/spreadsheets.readonly'
    var SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly';
    gapi.client.init({
        'apiKey': API_KEY,
        'clientId': CLIENT_ID,
        'scope': SCOPE,
        'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(function() {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
        updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}*/

// ------------------------------------------------------------------------------------------------------------------
// Loads the client so that a user may log in
/*function handleClientLoad() {
    gapi.load('client:auth2', initClient);
    setTimeout(function(){
        handleSignIn();
    },5000);    
}*/

function handleClientLoad() {
    var xhr = new XMLHttpRequest();
    var range = "B2:L40";
    xhr.open('GET', "https://sheets.googleapis.com/v4/spreadsheets/16oXmBaKcVvEzv_5421m5FgjuVYE7C7wUytzL8_2A7w0/values/" + range + "?key=AIzaSyDfXNTAOiF2foSfcXh-zrhJpuZkZmqwVak", true);       
    xhr.send();
    xhr.onreadystatechange = function (e){
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            stringParse(response.values);
        }
    }
}
 
// ------------------------------------------------------------------------------------------------------------------
// Grabs the data if the user is signed in
/*function updateSignInStatus(isSignedIn) {
    if (isSignedIn)
        makeApiCall();
}*/
 
 // ------------------------------------------------------------------------------------------------------------------
 //signs in a user
/*function handleSignIn() {
    gapi.auth2.getAuthInstance().signIn();
}*/

 
// Now we need to run the code that will be executed only for Contact page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('contact', function (page) {
    // Do something here for "about" page
    myApp.alert('Here comes About page');
})

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'contact') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="contact"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert('Here comes About page');
})


function recieveData() {
    var data = [];
    data.push(document.getElementById('nameInput').value);
    data.push(document.getElementById('emailInput').value);
    data.push(document.getElementById('subjectInput').value);
    data.push(document.getElementById('msgInput').value);    
    for(i = 0; i<4; i++)
        console.log(data[i]);
    sendMessage("jonathann.maimon@gmail.com", document.getElementById('emailInput').value, )
    // document.location.href = "mailto:jonathann.maimon@gmail.com?subject="
    // + encodeURIComponent(data[2])
    // + "&body=" + encodeURIComponent(data[3]);
    // at this point we need to change it to JSON format and send to the server.
    // Need the right api for it first.
}
function sendMessage(userId, email, callback) {
  // Using the js-base64 library for encoding:
  // https://www.npmjs.com/package/js-base64
  var base64EncodedEmail = Base64.encodeURI(email);
  var request = gapi.client.gmail.users.messages.send({
    'userId': userId,
    'resource': {
      'raw': base64EncodedEmail
    }
  });
  request.execute(callback);
}
