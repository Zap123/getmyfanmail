var casper = require('casper').create({
    verbose: false,
    logLevel: 'debug'
});
casper.options.viewportSize = {
    width: 1024,
    height: 768
};
//casper.options.pageSettings.loadImages = false;
var db = {user:{}};
var nr = 1;
var fs = require('fs');
casper.userAgent("iPhone");
if (casper.cli.has("blog")) {
    var blog = casper.cli.get("blog")
} else {
    console.log("you must specify your blog with --blog={name}")
    casper.exit();
}


//phantom.cookiesEnabled = true;
var fanmail = "https://www.tumblr.com/blog/" + blog + "/messages/page/"

casper.on("remote.message", function(message) {
    this.echo("remote console.log: " + message);
});

var getMessages = function() {
    db.user = casper.evaluate(function(store) {
        var message = document.querySelectorAll(".mh_post_head")
        for (var i = 0; i < message.length; i++) {
            msg = message[i]
            if (msg !== undefined) {
                var message_sender = msg.children[0].
                    children[1].textContent;
                var avatar = msg.children[0].children[0].
                        style.backgroundImage;
                    avatar = avatar.match(/\((.*)\)/)[1]
                var message_body = msg.nextElementSibling.textContent;
                if (store[message_sender] === undefined) {
                    store[message_sender] = {};
                    store[message_sender]['message'] = [];
                    store[message_sender]['avatar'] = avatar;
                    store[message_sender]['url'] = "https://"+
                        message_sender+".tumblr.com";
                }
                store[message_sender]['message'].unshift(message_body);
            }
        }
        return store
    }, db)
}

var page = function(n) {
    return fanmail + n
}

var saveJSON = function() {
    console.log(JSON.stringify(db))
    fs.write('mail.json', JSON.stringify(db), "w");
    fs.write('data.json', convert(db), "w");
}

var convert = function(db){
   tmp = {fanmail:[]}
   var newformat = Object.keys(db.user).map(function(obj){
        converted = {}
        converted.name = obj;
        converted.message = db.user[obj].message
        converted.avatar = db.user[obj].avatar
        converted.url = db.user[obj].url
        return converted;
   });
   tmp.fanmail = newformat;
   return JSON.stringify(tmp)
}

var msgLoop = function() {
    console.log("Page " + nr + " ...")
    casper.thenOpen(page(nr), function() {
        var end = this.exists(".no_posts_found")
        if (!end) {
            getMessages();
            nr++;
            msgLoop()
        } else {
            saveJSON();
        }
    })
}

casper.start(page(1), function() {
    this.echo("Opening Fanmail...")
    casper.capture("fan.png");
    msgLoop();
})

casper.run();
