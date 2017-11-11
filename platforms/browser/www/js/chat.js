/* 
    <div class="chat">
        <div class="chat-listcontainer"> 
            <ul class="chat-message-list">
            </ul>
        </div>
    </div> 
*/
function createChat() {
    var div = document.createElement("div");
    div.setAttribute("class", "chat");

    var divList = document.createElement("div");
    divList.setAttribute("class", "chat-listcontainer");

    var chatUlList = document.createElement("ul");
    chatUlList.setAttribute("class", "chat-message-list");

    divList.appendChild(chatUlList);

    div.appendChild(divList);

    return div;
}


/*     <div>
//         <span class="spinme-left">
//             <div class="spinner">
//                 <div class="bounce1"></div>
//                 <div class="bounce2"></div>
//                 <div class="bounce3"></div>
//             </div>
//         </span>
//     </div>
*/ 
/* Create dots animation like typing */
function createMsgSpinner() {
    var spinner = document.createElement("div");
    spinner.setAttribute("id", "spinner");

    var span = document.createElement("span");
    span.setAttribute("class", "spinme-left");

    var divSpinner = document.createElement("div");
    divSpinner.setAttribute("class", "spinner");

    var bounce1 = document.createElement("div");
    bounce1.setAttribute("class", "bounce1");

    var bounce2 = document.createElement("div");
    bounce2.setAttribute("class", "bounce2");

    var bounce3 = document.createElement("div");
    bounce3.setAttribute("class", "bounce3");

    divSpinner.appendChild(bounce1);
    divSpinner.appendChild(bounce2);
    divSpinner.appendChild(bounce3);

    span.appendChild(divSpinner);

    spinner.appendChild(span);

    return spinner;
}


/*
//     <li class="message-left">
//         <div>
//             <img src="http://iconshow.me/media/images/ui/ios7-icons/png/512/contact-outline.png" class="chatIcon">                                                                    
//             <span class="message-text"> This is Message.</span>
//             <span class="message-time"> Here Is Time 15:48 </span>
//         </div>
//     </li> 
*/
function createMsg(direction, text) {     // Direction should be message-left or message-right => Admin Left, User Right.
    
    var msg = document.createElement("li");
    msg.setAttribute("class", direction);

    var div = document.createElement("div");

    
    var spanMsg = document.createElement("span");
    spanMsg.setAttribute("class", "message-text");
    spanMsg.innerHTML = text;
    
    var spanTime = document.createElement("span");
    spanTime.setAttribute("class", "message-time");
    spanTime.innerHTML = getTimeNow();
   
    div.appendChild(spanMsg);
    div.appendChild(spanTime);

    msg.appendChild(div);

    return msg;
    
}
    
// Function which returns the time in this format => HH:MM
function getTimeNow() {
    var now = new Date();
    var str = now.getHours() + ":";

    return (now.getMinutes() < 10) ? str += "0" + now.getMinutes() : str += now.getMinutes();  
}


//Make sure message list is scrolled to the bottom
function scrollBottonUpdate() {
    var container = document.getElementsByClassName("chat")[0];
    var containerHeight = container.clientHeight;
    var contentHeight = container.scrollHeight;

    container.scrollTop = contentHeight - containerHeight;
}