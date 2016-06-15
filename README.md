# getmyfanmail
Download your correspondence from Tumblr

As of January 2016 Tumblr discontinued the fanmail, fortunately all your messages are still available, but what will happen to them in the future? This is the right time to take back your conversations.

##usage##

npm install

- Login in your account:

./node_modules/casperjs/bin/casperjs --cookies-file=cookies.txt login.js --user={{email}} --pwd={{pass}}

- Download your messages:

./node_modules/casperjs/bin/casperjs --cookies-file=cookies.txt fanmail.js --blog={{name}} 

-Output to HTML

npm start

Or do whatever you want because now it's your data (.json).
