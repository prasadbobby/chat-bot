$(document).ready(function() {
    wsConnect();
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
var sound = new Audio();
sound.src = 'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-35448/zapsplat_cartoon_bubble_pop_003_40275.mp3';

$('#prime').click(function() {
    toggleFab();
});


function toggleFab() {
    $('.prime').toggleClass('zmdi-comment-outline');
    $('.prime').toggleClass('zmdi-close');
    $('.prime').toggleClass('is-active');
    $('.prime').toggleClass('is-visible');
    $('#prime').toggleClass('is-float');
    $('.chat').toggleClass('is-visible');
    $('.fab').toggleClass('is-visible');

}


$('#chat_fullscreen_loader').click(function(e) {
    $('.fullscreen').toggleClass('zmdi-window-maximize');
    $('.fullscreen').toggleClass('zmdi-window-restore');
    $('.chat').toggleClass('chat_fullscreen');
    $('.fab').toggleClass('is-hide');
    $('.header_img').toggleClass('change_img');
    $('.img_container').toggleClass('change_img');
    $('.chat_header').toggleClass('chat_header2');
    $('.fab_field').toggleClass('fab_field2');
    $('.chat_converse').toggleClass('chat_converse2');

});


var ws;
var wsUri = "ws:";
var loc = window.location;
var responseMessage = {};
console.log(loc);
if (loc.protocol === "https:") {
    wsUri = "wss:";
}

wsUri += "//" + loc.host + loc.pathname.replace("test", "ws/test");

function wsConnect() {
    console.log("connect", wsUri);
    // ws = new WebSocket(wsUri);
    ws = new WebSocket("wss://devapi.orca.embiote.in/ws/simple");
    ws.onmessage = function(msg) {
        var line = "";
        var data = JSON.parse(msg.data);
        responseMessage["context"] = data["context"];
        console.log(msg);
        line += "<p>" + data.text + "</p>";
        setTimeout(() => {
            $("#typing-blob").remove();
        }, 2000);
        setTimeout(() => {
            $("#chat_converse").append("<div class='chat_msg_item chat_msg_item_admin back'><div class='chat_avatar'><img src='https://img.icons8.com/fluent-systems-regular/344/bot.png'></div>" + line + "</div>").animate({
                scrollTop: $('#chat_converse').prop("scrollHeight")
            }, 500)
            var d = new Date().toISOString();
            $("#chat_converse").append("<div class='bot-timer status2' id='time'><time class='timeago' datetime=" + d + "></time></div>").animate({
                scrollTop: $('#chat').prop("scrollHeight")
            }, 500)
            $(document).ready(function() {
                $("time.timeago").timeago();
                sound.play();
            });
            $(document).ready(function(){
                var text = data.text;
                     blinkTitleStop();
                     blinkTitle("Orca Says...",text,1000,true);
                });              
            if (data.options !== null) {
                $("#chatSend").prop("disabled", true);
                $("#chat_converse").append("<div class='chat_msg_item chat_msg_item_admin back' id='typing-blob'><div class='chat_avatar'><img src='https://img.icons8.com/fluent-systems-regular/344/bot.png'></div><div class='three col'><div class='loader' id='loader-4'><span></span><span></span><span></span></div></div></div>").animate({
                    scrollTop: $('#chat_converse').prop("scrollHeight")
                }, 500)
                setTimeout(function() {
                    $("#typing-blob").remove()
                }, 2000);
                setTimeout(() => {
                    $(document).ready(function() {
                        for (let i = 0; i < data.options[0].length; i++) {
                            if (data.options[0][i].text !== undefined) {
                                $("#chat_converse").append("<div class='chat_msg_item chat_msg_item_admin extra' data-value=\"" + data.options[0][i].text + "\" onclick='myFun(this)'> " + data.options[0][i].text + "</div>").animate({
                                    scrollTop: $('#chat_converse').prop("scrollHeight")
                                }, 500)
                            }
                        }
                        sound.play();
                    })
                }, 2100);
            } else {
                $("#chatSend").prop("disabled", false);
            }
        }, 2100);
    }

    ws.onopen = function() {
        console.log("connected");
    }
    ws.onclose = function() {
        setTimeout(wsConnect, 3000);
    }
}

function doit(m) {
    if (ws) {
        ws.send(m);
    }
}


function sendMessage(userResponse) {
    if (userResponse !== "") {
        responseMessage["text"] = userResponse
        doit(JSON.stringify(responseMessage));
        responseMessage = {};
        $("#chat_converse").append("<div class='chat_msg_item chat_msg_item_user'>" + userResponse + "</div>").animate({
            scrollTop: $('#chat_converse').prop("scrollHeight")
        }, 500)
        var d = new Date().toISOString();
        $("#chat_converse").append("<div class='bot-timer status' id='time'><time class='timeago' datetime=" + d + "></time></div>").animate({
            scrollTop: $('#chat').prop("scrollHeight")
        }, 500)
        $(document).ready(function() {
            $("time.timeago").timeago();
        });
        $("#chat_converse").append("<div class='chat_msg_item chat_msg_item_admin back' id='typing-blob'><div class='chat_avatar'><img src='https://img.icons8.com/fluent-systems-regular/344/bot.png'></div><div class='three col'><div class='loader' id='loader-4'><span></span><span></span><span></span></div></div></div>").animate({
            scrollTop: $('#chat_converse').prop("scrollHeight")
        }, 500)

        sound.play();
        $("#chatSend").val("");
        setTimeout(function() {
            $("#typing-blob").remove()
        }, 5000);

    }
}

function sendFromTextBox() {
    if (userResponse !== "") {
        var userResponse = $("#chatSend").val();
        console.log(userResponse);
        sendMessage(userResponse);
        userResponse = "";
    }
}


function myFun(btn) {
    console.log(btn.dataset.value);
    userResponse = btn.dataset.value;
    sendMessage(userResponse);
}


function record() {
    $(document).ready(function() {
        $('input[name="msg-txt"]').attr('placeholder', 'Listening.....');
    })
    setTimeout(() => {
        $(document).ready(function() {
            $('input[name="msg-txt"]').attr('placeholder', 'Send a message');
        })
    }, 4000);
    var recognition = new webkitSpeechRecognition();
    recognition.lang = "en-GB";
    recognition.onresult = function(event) {
        console.log(event);
        document.getElementById('chatSend').value = event.results[0][0].transcript;
        setTimeout(() => {
            var userResponse = $("#chatSend").val();
            console.log(userResponse);

            sendMessage(userResponse);
            userResponse = "";
        }, 2000);

        $(document).ready(function() {
            $('input[name="msg-txt"]').attr('placeholder', 'Send a message');
        })


    }
    recognition.start();
}

function iconFunction() {
    if (document.getElementById('micIcon').className == "zmdi zmdi-mic") {
        record();
    }
    if (document.getElementById('micIcon').className == "far fa-paper-plane") {
        sendFromTextBox();
    }


}


//changeicon code
function changeIcon(f1) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (document.getElementById(f1).className == "zmdi zmdi-mic") {

        if (keycode != 32 && keycode != 8) {
            document.getElementById(f1).className = "far fa-paper-plane";

        }
    } else {
        if (keycode == 8) {
            //console.log(keycode);
            var content = document.getElementById('chatSend').value;
            if (content == "") {
                document.getElementById(f1).className = "zmdi zmdi-mic";
            }

        } else if (keycode == 13)

        {
            sendFromTextBox();
            document.getElementById(f1).className = "zmdi zmdi-mic";

        } else {
            document.getElementById(f1).className = "far fa-paper-plane";
        }
    }

}


// $(document).delegate("#fab_send", "click", function() {
//     var userResponse = $("#chatSend").val();
//     console.log(userResponse);
//     sendMessage(userResponse);
//     userResponse = "";
// });




// $(document).delegate("#chatSend", "keyup", function(event) {
//     if (event.keyCode === 13) {
//         $("#fab_send").click();
//     }
// });

$(document).ready(function() {
    setTimeout(function() {
        $(".fab").click();
    }, 1000);

});