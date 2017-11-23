// Initialize app.
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

// Relevant variables
var Titles = [];
var Contents = [];
var Question = [];
var Answers = [];
var Next = [];
var Back = [];
var chatEntered;

// ------------------------------------------------------------------------------------------------------------------
// Connects to the google sheets server and asks for the document that holds all the expert data.
function handleClientLoad() {
    var xhr = new XMLHttpRequest();
    var range = "B2:X40";
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
//This function is my main addition to this code.  It is meant to take in the relevant data and format it for later use
function stringParse(info){
    // Local varibales that are used to hold temp information.
    var AnswersList = [];
    var NextList = [];
    //loops through information given to format it
    for(i = 0; i < info.length; i++){
        // Pushes all of the titles, contents, and questions into one list
        this.Titles.push(info[i][0]);
        this.Contents.push(info[i][1]);
        this.Question.push(info[i][2]);
        // Pushes all of the answers into one list
        for(q = 3; q < info[i].length; q++){
            AnswersList.push(info[i][q].slice(0, info[i][q].lastIndexOf("[")));
            NextList.push(parseInt(info[i][q].slice(info[i][q].lastIndexOf("[")+1, info[i][q].length - 1)));
        }

        // Checks to see if there are any answers listed in the row
        this.Answers.push(AnswersList);
        this.Next.push(NextList);
        AnswersList = [];
        NextList = [];
    }
    
    // Creates the home screen with all the information we got from the google sheet.
    // It starts to output the first node in the google sheet.
    createHomeScreen();
}

// ------------------------------------------------------------------------------------------------------------------
// Asks the user if the information was helpful and sends the answer to google analytics.
function createHomeScreen() {
    var index = 0;
    if (chatEntered) {
        clearButtons();
        document.getElementsByClassName("flex")[0].removeChild( document.getElementsByClassName("flex")[0].childNodes[0]);  // remove back button.
        document.getElementById("answers").removeChild(document.getElementById("answers").childNodes[0]);        
        document.getElementById("titleImage").style.display = "";        
        document.getElementById("topLine").style = ""; // Change top line color on home screen.  
        document.getElementById("contents").innerHTML = "";   
        document.getElementById("text").innerHTML = "";           
    }
    chatEntered = false;
    document.getElementById('title').innerHTML = Titles[index];

    var bold = document.createElement("b");
    var question = document.createTextNode(Question[index]);
    bold.innerHTML = Contents[index] + "<br>";

    document.getElementById('contents').appendChild(bold)
    document.getElementById('contents').appendChild(question);
    // document.getElementsByClassName("toolbar")[0].style = "display: none;"    
    createButtons(0);
}

// ------------------------------------------------------------------------------------------------------------------
// Asks the user if the information was helpful and sends the answer to google analytics.
function chatScreen(index, col) {
    //var textOutput = Contents[index] + "</br>" + Question[index];
    // Clears the buttons and drawing chat background, make the background dinamic as the buttons panel gets smaller.
    clearButtons();
    if (chatEntered)
        drawChatBackground();

    // Two variables that holds the last node index - we use it to print the user "message".
    var answersRow = Back[Back.length-1][0];
    var answersCol = Back[Back.length-1][1];

    // document.getElementById('backButton').disabled = true;
    // document.getElementById("backButton").style.pointerEvents = "none";
    // document.getElementById("backButton").style = "color: grey;";  
    document.getElementById("topLine").style = "background-color: #1DBACD;"; // Change top line color on home screen.      
    
    // If its the first time the chat screen appear we need to set the elements below.
    if(!chatEntered) {

        document.getElementById("titleImage").style.display = "none"; // Hides the image of the heart in home screen.
        document.getElementById("title").style = "margin-right:20px"
        // Creating the back button(we create a div for it and append the back image to it).
        var image = document.createElement("img");
        image.setAttribute("src", "assets/Back.png");
        image.setAttribute("id", "backBtn");
        image.setAttribute("onclick", "backListener()");  
        image.setAttribute("style", "margin-left: 10px");        
        
        document.getElementsByClassName("flex")[0].insertAdjacentElement('afterbegin', image); // set the back buttom first child in .flex class
        // var backButton = document.createElement("div");
        // backButton.appendChild(image);

        // Adds the back button and the title to our title div.
        document.getElementById("title").innerHTML = Answers[answersRow][answersCol]; // Defines the title to the node title.
        //document.getElementById("title").appendChild(backButton); // We append the image to the title panel(top panel).
        
        document.getElementById("text").innerHTML = "";       
        document.getElementById("text").appendChild(createChat()); // Creates the chat screen.
        
        document.getElementById("contents").innerHTML = "";
        
        
        // Add the bottom line.
        var bottomLine = document.createElement("hr");
        bottomLine.id = "botLine";
        bottomLine.setAttribute("style", "height: 1px;background-color: white; margin: 0px;");
        document.getElementById("answers").appendChild(bottomLine);
        
        chatEntered = true;
        drawChatBackground();
    }

    // When the user is already on the main screen we create a chat bubble instead of changing the main title.
    else {
        document.getElementsByClassName("chat-message-list")[0].appendChild(createMsg("message-right", Answers[answersRow][answersCol]));   // createMsg(direction, imgSrc, text, time)     // Direction should be message-left or message-right => Admin Left, User Right.                
        drawChatBackground();
    }
    
    var msg = createMsg("message-left", Contents[index]);   // createMsg(direction, imgSrc, text, time) => Direction should be message-left or message-right - Admin Left, User Right.
    document.getElementsByClassName("chat-message-list")[0].appendChild(createMsgSpinner());
    drawChatBackground();

    // Creates a bubble of content and inside we also create a question bubble.
    // This part creates an illusion that the user is chatting with our consultant.
    // It creates 3 dots that rolls for a few seconds until it shows the chat bubble.
    setTimeout(function (){
        if(document.getElementsByClassName("chat-message-list")[0]) {
            document.getElementsByClassName("chat-message-list")[0].removeChild(document.getElementById('spinner'));
            document.getElementsByClassName("chat-message-list")[0].appendChild(msg);   // createMsg(direction, imgSrc, text, time)     // Direction should be message-left or message-right => Admin Left, User Right.
            if(Question[index]) {
                document.getElementsByClassName("chat-message-list")[0].appendChild(createMsgSpinner());
                var questMsg = createMsg("message-left", Question[index]);   // createMsg(direction, imgSrc, text, time)     // Direction should be message-left or message-right => Admin Left, User Right. 
                drawChatBackground();
                // Makes the spinner work and after few seconds shows the message question and also deletes the 3 dot spinner.
                setTimeout(function (){
                    if(document.getElementsByClassName("chat-message-list")[0]) {
                        document.getElementsByClassName("chat-message-list")[0].removeChild(document.getElementById('spinner'));
                        document.getElementsByClassName("chat-message-list")[0].appendChild(questMsg);   // createMsg(direction, imgSrc, text, time)     // Direction should be message-left or message-right => Admin Left, User Right.
                        createButtons(index);
                        // document.getElementById('backButton').disabled = false; 
                        // document.getElementById('backButton').style.pointerEvents = 'auto';
                    }
                }, (Question[index].length*50) > 3000 ? 3000 : (Question[index].length*50)); 
            }    
            else {              
                info(index);    
            }
        }
    }, (Contents[index].length*50) > 3500 ? 3500 : (Contents[index].length*50));    
    
    //document.getElementsByClassName("chat-message-list")[0].appendChild(createMsg("message-left", "http://www.pvhc.net/img8/niexjjzstcseuzdzkvoq.png", Question[index])); // direction, logo, msg
    
    
}

// ------------------------------------------------------------------------------------------------------------------
// Create all the buttons and puts it in answers panel.
function createButtons(index) {

    const INSIDE_DIV = 2;   // How many divs can be in row.

    var mainDiv = document.createElement("div");        // mainDiv will contain 2 divs inside
    mainDiv.setAttribute("class", "mainDiv");           // set class

    // if(chatEntered) {
    //     mainDiv.style = "height: auto; padding-top: 10px;";
    // }
    // Creates the all buttons we need using a for loop.
    for(i = 0; i < Answers[index].length; i++)
    {
        if(mainDiv.childElementCount == INSIDE_DIV) {   // If the main div contain 2 children
            answers.appendChild(mainDiv);               // append it to the dom.
            mainDiv = document.createElement("div");    // create new div with 0 children.
            mainDiv.setAttribute("class", "mainDiv");   // set class.
        }
        var div = document.createElement("div");
        if(i % INSIDE_DIV == 0) {
            div.setAttribute("class", "left");
        } else if(i % INSIDE_DIV == 1){
            div.setAttribute("class", "right");
        }
        
        // We need image only on main screen.
        // var image;
        // if(index == 0) {
        //     image = document.createElement("img");
        //     image.setAttribute("id", "image" + i);
        //     image.className = "icon";
        //     image.setAttribute("src", ImagesURL[i]);
        // }
        
        // var paragraph = document.createElement("p");
        // paragraph.className = "icon_paragraph";
        // paragraph.setAttribute("id", "par" + i);
        
        var button = document.createElement("button");  
        button.id = i;
        button.className = "categoryBtn";
        var color = getButtonColor(i);
        button.setAttribute("style", "background:" + color +  ";");
        button.addEventListener ("click", function() {
            var temp = Next[index][this.id];
            var tempArr = [index, this.id];
            console.log('temp'+this.id);
            // document.getElementsByClassName("toolbar")[0].style = "display: block;"
            Back.push(tempArr);      
            chatScreen(temp-1, this.id);
        });
        
        // paragraph.appendChild(document.createTextNode(Answers[index][i]));
        div.appendChild(button);
        // div.appendChild(paragraph);
        // if(index == 0) {
        //     button.appendChild(image);
        // } else {
            button.appendChild(document.createTextNode(Answers[index][i]));
            // paragraph.style = "color: white"
        // }
        // button.innerHTML = Answers[index][i];
        var answers = document.getElementById("answers");
        mainDiv.appendChild(div);
        if(i == Answers[index].length - 1) {        // if the number of the buttons if odd.
            answers.appendChild(mainDiv);           // add the last button to the DOM.
        }

        if(chatEntered)
            drawChatBackground();
        
    }   
}

// ------------------------------------------------------------------------------------------------------------------
// creates final node that holds the information.
function info(index) {
    createButtons(index);
}

// ------------------------------------------------------------------------------------------------------------------
// Asks the user if the information was helpful and sends the answer to google analytics.
function helpfulButton(index) {
    ga('create', 'UA-108462660-1',{"name": "HelpfulInfo"});        
    
    mainDiv = document.createElement("div");    // create new div with 0 children.
    mainDiv.setAttribute("class", "mainDiv");   // set class.
    mainDiv.style = "padding:0px"

    // Creating the paragraph that holds the question if the user found the infromation helpful, we append it to the main div.
    var helpedText = document.createElement("p"); 
    helpedText.innerHTML = "Was the information helpful?";
    mainDiv.appendChild(helpedText);

    // Creates the two buttons that sends the information to google analytics.
    createHelpBtn(mainDiv, "left", index);
    createHelpBtn(mainDiv, "right", index);
    
    // Contact us button.
    var contactParagraph = document.createElement("p");
    contactParagraph.className = "icon_paragraph";
    contactParagraph.style = "color: white"
    contactParagraph.appendChild(document.createTextNode("For personal question contact us"));                
    
    var contactDiv = document.createElement("div");
    contactDiv.setAttribute("class", "center");
    
    var contactButton = document.createElement("button");  
    contactButton.className = "categoryBtn";
    contactButton.style = "margin-top:5px"
    contactButton.addEventListener ("click", function() {
        
        // Refresh everything back to home screen with a delay that makes the screen switch much nicer and smoother.
        setTimeout(function (){        
            Back = [];
            createHomeScreen();
        },500 );
    });
    
    
    contactButton.setAttribute("style", "background:" + getButtonColor(index) +  ";margin-top:13px;width:-webkit-fill-available");
    
    contactDiv.appendChild(contactButton);
    contactDiv.appendChild(contactParagraph);
    contactButton.appendChild(contactParagraph)
    var hr = document.createElement("a");
    hr.setAttribute("href", "contact.html");
    hr.appendChild(contactButton);
    contactDiv.appendChild(hr);

    mainDiv.appendChild(contactDiv);

    document.getElementById("answers").appendChild(mainDiv);  
    drawChatBackground();
}

// ------------------------------------------------------------------------------------------------------------------
// Clear the buttons from the screen when needed.
function createHelpBtn(mainDiv, direction, index) {

    var paragraph = document.createElement("p");
    paragraph.className = "icon_paragraph";
    paragraph.style = "color: white";
    paragraph.appendChild(document.createTextNode(direction == "left" ? "No" : "Yes"));        

    var div = document.createElement("div");
    div.setAttribute("class", direction);


    var btn = document.createElement("button");  
    btn.className = "categoryBtn";

    var label = direction == "left" ?("Didn\'t help: node: " + (index+1) +  "content: " + Contents[index]) :
                                     ("Helped: node: " + (index+1) +  ", content: " + Contents[index]);

    btn.addEventListener ("click", function(label) {
        Back = [];

        ga('HelpfulInfo.send', 'event', {
            eventCategory: "Information quality",
            eventAction: "click",
            eventLabel: label
        });
        
        // Returns to home screen.
        createHomeScreen(); 
    });

    btn.setAttribute("style", "background:" + getButtonColor(index) +  ";");

    div.appendChild(btn);
    div.appendChild(paragraph);
    btn.appendChild(paragraph)        

    mainDiv.appendChild(div); 
}

// ------------------------------------------------------------------------------------------------------------------
// Clear the buttons from the screen when needed.
function clearButtons(){
    var length = document.getElementsByClassName("mainDiv").length;
    var div =  document.getElementById('answers');
    for(i = 0; i < length; i++){
        console.log(document.getElementsByClassName("mainDiv"));
        div.removeChild(document.getElementsByClassName("mainDiv")[0]);
  }
}

// ------------------------------------------------------------------------------------------------------------------
// Back button function, goes back a node - if there no node to go back to we go back to home screen insted.
function backListener() {
    if ((Back[Back.length-1][0]) > 0) {
        var row = Back[Back.length-1][0];
        var col =  Back[Back.length-1][1];
        Back.pop();        
        chatScreen(row,col);
    }

    else{
        Back.pop();
        createHomeScreen();
    }
}
 
function drawChatBackground() {
    document.getElementById("chat").style = "height: " + ($('#botLine').offset().top  - $('#text').offset().top - 40) + "px;"; 
    scrollBottonUpdate();        
}

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


function sendMessage() {
  // Using the js-base64 library for encoding:
  var api_key = 'key-f40db47c07d08435c967f7d1c3786599';
  var domain = 'sandbox4fd134d803914cbfb5198d49ff10d08a.mailgun.org';
  var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
   
  var data = {
    from: email,
    to: 'jonathann.maimon@gmail.com',
    subject: suject,
    text: 'from' + name + '<br><br>' + msg
  };
   
  mailgun.messages().send(data, function (error, body) {
    console.log(body);
  });
}
$("#myform").on('submit', function(e) {
    e.preventDefault();
    console.log("WORKD");
    sendFeedbackMessage();
});
function sendFeedbackMessage() {
    var email = document.getElementById('emailInput').value;
    var name = document.getElementById('nameInput').value;
    var subject = document.getElementById('subjectInput').value;
    var msg = document.getElementById('msgInput').value;    

    $.ajax('https://api.mailgun.net/v3/sandbox4fd134d803914cbfb5198d49ff10d08a.mailgun.org/messages',
    {
        type:'POST',
        username: 'api',
        password: 'key-f40db47c07d08435c967f7d1c3786599',
        data:{
            'html': 'from ' + name + ', email ' + email + '<br><br>' + msg,
            'subject': subject,
            'from': 'Bot New Feedback<postmaster@sandbox4fd134d803914cbfb5198d49ff10d08a.mailgun.org>',
            //'from': 'Bot New Feedback<postmaster@sandbox4fd134d803914cbfb5198d49ff10d08a.mailgun.org>',
            'to': '<jonathann.maimon@gmail.com>',
            text: 'from' + name + '<br><br>' + msg
        },
        success:function(a,b,c){
            console.log( 'mail sent: ', b );
            console.log(a);
            console.log(b);
            console.log(c);
        }.bind(this),
        error:function( xhr, status, errText ){console.log( 'mail sent failed: ', xhr.responseText );}
    });
} 

const RED = 29;
const GREEN = 186;
const BLUE = 205;

function getButtonColor(i) {
    var red, green, blue;
    var index = i;
    if(index % 2 != 0) {
        index--;
    }
    red = RED - (3 * index / 2);
    green = GREEN - (21 * index / 2);
    blue = BLUE - (23 * index / 2);
    return "rgb(" + red + ", " + green + "," + blue + ")";
}