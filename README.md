# Telegram_bot_rock_paper_scissors_game
Telegram bot that lets you play rock paper scissors against other people in the group

# Setup
0. Create a bot using telegrams botfather this will generate an API key you can use.

1. You will need to create a `.env` file in the repo directory to store your telegram API key with the following
```
BOT_API=XXXXXXXXXX:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
2. Run `npm install` to download all of the modules, this will create a node_modules folder.

3. Run `npm start` in terminal to start the bot.

4. Add the bot to your group and set it as admin

# Playing the game
To start a game against a friend reply to any of their messages with `play game rock` and you will be presented with the following screen

![Image of how the initial message looks like](https://github.com/ArtiomSu/Telegram_bot_rock_paper_scissors_game/blob/master/scrot/1.png)

Press one of the 3 buttons to choose rock, paper or scissors. Your oponent won't know what you selected it will just say picked for whoever picked something, You don't have to pick in order, picking at the same time should work.

![Image of when one person picks](https://github.com/ArtiomSu/Telegram_bot_rock_paper_scissors_game/blob/master/scrot/2.png)

After both players pick you will see who won the round and what each player choose.

![Image of when someone wins the round](https://github.com/ArtiomSu/Telegram_bot_rock_paper_scissors_game/blob/master/scrot/3.png)

You can also draw.

![Image of when there is a draw](https://github.com/ArtiomSu/Telegram_bot_rock_paper_scissors_game/blob/master/scrot/4.png)

After someone wins the game ( by default first to 3 ) there will be a brief animation and the game will end.

![Image of when game is over](https://github.com/ArtiomSu/Telegram_bot_rock_paper_scissors_game/blob/master/scrot/5.png)

Any of the players playing can also stop the game by clicking on the stop button.

![Image of when one person picks](https://github.com/ArtiomSu/Telegram_bot_rock_paper_scissors_game/blob/master/scrot/6.png)

