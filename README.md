# nearest_bin

(index.js)
The following lambda computes the nearest 5 bins based on user longitude, latitude and source_var
- source_var is based on SOURCE column ['cashfortrash','ewaste','lighting','recyclingbins']

(bot.js)
The following is a component that allows user to return their latitude/longtitude
- it requires the user to sent their location to the telegrambot
- requires `npm i node-telegram-bot-api`

Some suggestions to connect to database
- use this nodejs library to connect (node.js https://www.npmjs.com/package/telegraf-session-mysql)
- user another lambda to invoke telgram hook (https://stackoverflow.com/questions/61241086/aws-lambda-telegram-bot-with-mysql-loop-message-same-message)
- use a NoSQL database like dynamoDB (node.js https://www.npmjs.com/package/telegraf-session-dynamodb)
