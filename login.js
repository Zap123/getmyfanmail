var casper = require('casper').create({
    verbose: false,
    logLevel: 'debug'
});
casper.options.viewportSize = {
    width: 1024,
    height: 768
};
//casper.options.pageSettings.loadImages = false;
casper.userAgent("iPhone");

//phantom.cookiesEnabled = true;
var login = "https://tumblr.com/login"

casper.on("remote.message", function(message) {
    this.echo("remote console.log: " + message);
});

if (!casper.cli.has("user") || !casper.cli.has("pwd")) {
    console.log("you must specify your user and password with --user={name} and --pwd={password}")
    casper.exit();
}



casper.start(login, function() {

    this.fill("form#signup_form", {
        'determine_email': casper.cli.get("user"),
        'user[password]': casper.cli.has("pwd")
    }, false);

    this.click("button#signup_forms_submit");
})

casper.then(function() {
    this.wait(5000, function() {
        this.click("button#signup_forms_submit");
        console.log("clicked login");
    });
})

casper.run();
