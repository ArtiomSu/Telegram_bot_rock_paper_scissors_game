const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const bot = new TelegramBot(process.env.BOT_API, {polling: true});
const game_rock_paper_options = ["rock", "paper", "scissors", "stop_rock"];
const formatted_options = [ "     rock      ", "     paper     ", "   scissors    ", "    waiting    ", "     picked    " ];
const formatted_optionsdc = {
    "rock": "     rock      ",
    "paper": "     paper     ",
    "scissors": "   scissors    "
}
var game_rock_paper_pvp = {};

var format_optional_text = (optional_text) => {
    if(optional_text){
        optional_text = " "+optional_text.slice(0,29)+" ";
        while(optional_text.length < 31){
            optional_text = optional_text + " ";
        }

        optional_text = "|"+optional_text+"|\n";

    }else{
        optional_text = "";
    }
    return optional_text;
}


var create_board = (msg,optional_text) => {

    var initiator;
    if(game_rock_paper_pvp[msg.from.id].initiator){
        initiator = msg.from.id;
    }else{
        initiator = game_rock_paper_pvp[msg.from.id].oponent;
    }

    let my_choice;
    if(game_rock_paper_pvp[initiator].current_choice){
        my_choice = formatted_optionsdc[game_rock_paper_pvp[initiator].current_choice];
    }else{
        my_choice = formatted_options[3];
    }

    let oponent_choice;
    if(game_rock_paper_pvp[game_rock_paper_pvp[initiator].oponent].current_choice){
        oponent_choice = formatted_optionsdc[game_rock_paper_pvp[game_rock_paper_pvp[initiator].oponent].current_choice]}
    else{
        oponent_choice = formatted_options[3];
    }

    if(game_rock_paper_pvp[initiator].made_choice && ! game_rock_paper_pvp[initiator].oponent_made_choice){
        my_choice = formatted_options[4];
    }else if( ! game_rock_paper_pvp[initiator].made_choice && game_rock_paper_pvp[initiator].oponent_made_choice) {
        oponent_choice = formatted_options[4];
    }

    if(!optional_text){
        optional_text = game_rock_paper_pvp[initiator].last_update;
    }

    return "<pre>\n" +
        "+-------------------------------+\n" +
        "|"+game_rock_paper_pvp[initiator].name+"|"+game_rock_paper_pvp[game_rock_paper_pvp[initiator].oponent].name+"|\n" +
        "+-------------------------------+\n" +
        "|            Round "+(function () { if(game_rock_paper_pvp[initiator].current_round < 10){ return "0"+game_rock_paper_pvp[initiator].current_round; }else{ return game_rock_paper_pvp[initiator].current_round;}})()+"           |\n" +
        "+-------------------------------+\n" +
        "|"+my_choice+"|"+oponent_choice+"|\n" +
        "+-------------------------------+\n" +
        "|       Choice last round       |\n" +
        "+-------------------------------+\n" +
        "|"+game_rock_paper_pvp[initiator].choice_last_round+"|"+game_rock_paper_pvp[initiator].choice_last_round_oponent+"|\n" +
        "+-------------------------------+\n" +
        "|            Points             |\n" +
        "+-------------------------------+\n" +
        "|       "+game_rock_paper_pvp[initiator].current_game_wins+"       |       "+game_rock_paper_pvp[initiator].current_game_losses+"       |\n" +
        "+-------------------------------+\n" +
        format_optional_text(optional_text) +
        "+-------------------------------+\n" +
        "</pre>";


}

var start_game = (msg) => {
    let create = false;
    if(! Object.keys(game_rock_paper_pvp).includes(msg.from.id.toString())) {
        if(! Object.keys(game_rock_paper_pvp).includes(msg.reply_to_message.from.id.toString())) {
            let my_name = msg.from.first_name;
            let oponent_name = msg.reply_to_message.from.first_name;

            my_name = " "+my_name.slice(0,13)+" ";
            oponent_name = " "+oponent_name.slice(0,13)+" ";
            while(my_name.length < 15){
                my_name = my_name + " ";
            }

            while(oponent_name.length < 15){
                oponent_name = oponent_name + " ";
            }


            game_rock_paper_pvp[msg.from.id] = {
                name: my_name,
                initiator: true,
                initiator_chat: msg.chat.id,
                oponent: msg.reply_to_message.from.id,
                made_choice: false,
                oponent_made_choice: false,
                playing: true,
                current_choice: undefined,
                current_round: 1,
                current_game_wins: 0,
                current_game_losses: 0,
                first_to: 1,
                initial_message: null,
                last_update: undefined,
                choice_last_round:"     none      ",
                choice_last_round_oponent:"     none      "
            };

            game_rock_paper_pvp[msg.reply_to_message.from.id] = {
                name: oponent_name,
                initiator: false,
                oponent: msg.from.id,
                current_choice: undefined,
            };

            create = true;

        }
    }

    if(create){

        var options = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: '🗿', callback_data: 'rock' },{ text: '📄', callback_data: 'paper' },{ text: '✂️', callback_data: 'scissors' }],
                    [{text: 'stop', callback_data:"stop_rock"}]
                ]
            }),
            parse_mode: "HTML",
            disable_web_page_preview:true
        };



        game_rock_paper_pvp[msg.from.id].last_update = "First to " + game_rock_paper_pvp[msg.from.id].first_to + " wins";
        let output = create_board(msg,game_rock_paper_pvp[msg.from.id].last_update);


        //let output = create_board(msg,"really long text really long text really long text really long text really long text really long text really long text really long text really long text");
        //console.log(output);
        bot.sendMessage(msg.chat.id, output, options).then( msg_return =>{
            //console.log("message id is ", msg_return.message_id);
            game_rock_paper_pvp[msg.from.id].initial_message = msg_return.message_id;
        });
        bot.deleteMessage(msg.chat.id,msg.message_id);

        }
    else{
        bot.deleteMessage(msg.chat.id,msg.message_id);
        bot.sendMessage(msg.chat.id,
            "Cannot create a Game either you or "+ game_rock_paper_pvp[msg.reply_to_message.from.id].name +
            " is playing someone else",
            {parse_mode: "HTML", disable_web_page_preview:true});
    }


}


var animate_win = (options,output,frame) => {

    // 10 total frames
    let animate_frame = [
        "xxxxxxx-------------------------+",
        "xxxxxxxxxxxxx-------------------+",
        "xxxxxxxxxxxxxxxxxxx-------------+",
        "xxxxxxxxxxxxxxxxxxxxxxxxxx------+",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    ];

    let outsplit = output.split("\n");

    for(let i =1; i<outsplit.length; i = i + 2){
        outsplit[i] = animate_frame[frame];
    }

    output = outsplit.join("\n");
    bot.editMessageText(output, options);

    let anim_delay = Math.floor(Math.random()*(600-500+1)+500); 
    //console.log(frame, " delay is ", anim_delay);

    frame = frame + 1;
    if(frame < animate_frame.length){
        setTimeout(function() {
            animate_win(options,output,frame);
            }, anim_delay);
    }
}

var update_message = (payload) => {

    if(Object.keys(game_rock_paper_pvp).includes(payload.initiator.toString())) { //try update
        var options = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: '🗿', callback_data: 'rock' },{ text: '📄', callback_data: 'paper' },{ text: '✂️', callback_data: 'scissors' }],
                    [{text: 'stop', callback_data:"stop_rock"}]
                ]
            }),
            chat_id: payload.init_chat_id,
            message_id: payload.init_message_id,
            parse_mode: "HTML",
            disable_web_page_preview:true
        };


        let output = create_board(payload.msg,payload.optional_text);


        if(payload.game_over){
            options.reply_markup = undefined;
            delete game_rock_paper_pvp[game_rock_paper_pvp[payload.initiator].oponent];
            delete game_rock_paper_pvp[payload.initiator];
            animate_win(options,output,0);
        }else{
            bot.editMessageText(output, options);
        }
    }

}

var stop_rock_game = (msg,initiator) => {
    var options = {

        chat_id: game_rock_paper_pvp[initiator].initiator_chat,
        message_id: game_rock_paper_pvp[initiator].initial_message,
        parse_mode: "HTML",
        disable_web_page_preview:true
    };

    let output = "<pre>" +
        "+-------------------------------+\n" +
        "|        Game stopped by        |\n" +
        "|       "+game_rock_paper_pvp[msg.from.id].name+"         |\n" +
        "+-------------------------------+\n" +
        "</pre>"

    delete game_rock_paper_pvp[game_rock_paper_pvp[initiator].oponent];
    delete game_rock_paper_pvp[initiator];

    bot.editMessageText(output, options);
    return true
}

var play_game = (msg) => {
    if(! Object.keys(game_rock_paper_pvp).includes(msg.from.id.toString())){
        bot.answerCallbackQuery(msg.id,{text: "Game ended",show_alert: false});
    }else{
        //check if the player is initiator or not
        var initiator;
        var current_player = msg.from.id;
        if(game_rock_paper_pvp[msg.from.id].initiator){
            initiator = current_player;
        }else{
            initiator = game_rock_paper_pvp[current_player].oponent;
        }

        //check if stop is pressed
        if(msg.data === game_rock_paper_options[3]){
            return stop_rock_game(msg,initiator);
        }

        if(game_rock_paper_pvp[initiator].playing){

            let choice_made = true;

            if(initiator === current_player){
                if(! game_rock_paper_pvp[initiator].made_choice){
                    choice_made = false;
                }
            }else{
                if(! game_rock_paper_pvp[initiator].oponent_made_choice){
                    choice_made = false;
                }
            }

            if(choice_made){
                bot.answerCallbackQuery(msg.id,{text: "You already Choose this round",show_alert: false});
                //already made a choice so we need to do nothing
            }
            else{
                //if not made a choice make it now
                if(msg.data === game_rock_paper_options[0]){
                    game_rock_paper_pvp[current_player].current_choice = game_rock_paper_options[0];
                }else if(msg.data === game_rock_paper_options[1]) {
                    game_rock_paper_pvp[current_player].current_choice = game_rock_paper_options[1];
                }else if(msg.data === game_rock_paper_options[2]) {
                    game_rock_paper_pvp[current_player].current_choice = game_rock_paper_options[2];
                }


                //now we check if both players made a choice
                if(initiator === current_player){
                    game_rock_paper_pvp[initiator].made_choice = true;
                }else{
                    game_rock_paper_pvp[initiator].oponent_made_choice = true;
                }

                if( game_rock_paper_pvp[initiator].made_choice && game_rock_paper_pvp[initiator].oponent_made_choice){

                    //perspective of initiator / so initiator = player
                    var player_choice = game_rock_paper_pvp[initiator].current_choice;
                    var computer_choice = game_rock_paper_pvp[game_rock_paper_pvp[initiator].oponent].current_choice;

                    var draw = false;
                    var win = false;
                    //game_rock_paper_options = ["rock", "paper", "scissors"];
                    if(computer_choice === game_rock_paper_options[0] && player_choice === game_rock_paper_options[0]){
                        draw = true;
                    }else if(computer_choice === game_rock_paper_options[1] && player_choice === game_rock_paper_options[1]){
                        draw = true;
                    }else if(computer_choice === game_rock_paper_options[2] && player_choice === game_rock_paper_options[2]){
                        draw = true;
                    }else if(computer_choice === game_rock_paper_options[0] && player_choice === game_rock_paper_options[1]){
                        win = true;
                    }else if(computer_choice === game_rock_paper_options[1] && player_choice === game_rock_paper_options[2]){
                        win = true;
                    }else if(computer_choice === game_rock_paper_options[2] && player_choice === game_rock_paper_options[0]){
                        win = true;
                    }

                    var output = "";
                    var game_over = false;


                    if(win){
                        game_rock_paper_pvp[initiator].current_game_wins = game_rock_paper_pvp[initiator].current_game_wins + 1;
                        //check if game won
                        if(game_rock_paper_pvp[initiator].current_game_wins === game_rock_paper_pvp[initiator].first_to){
                            game_rock_paper_pvp[initiator].playing = false;
                            output += "Game Won by"+game_rock_paper_pvp[initiator].name;
                            game_over = true;
                        }else{
                            output += "Round won by" + game_rock_paper_pvp[initiator].name;
                        }

                    }else if(draw){
                        //nothing really continue playing
                        output += "This round is a draw";
                    }else{ //lost
                        game_rock_paper_pvp[initiator].current_game_losses = game_rock_paper_pvp[initiator].current_game_losses + 1;
                        //check if other player won
                        if(game_rock_paper_pvp[initiator].current_game_losses === game_rock_paper_pvp[initiator].first_to){
                            game_rock_paper_pvp[initiator].playing = false;
                            output += "Game Won by" + game_rock_paper_pvp[game_rock_paper_pvp[initiator].oponent].name;
                            game_over = true;
                        }else {
                            output += "Round won by" + game_rock_paper_pvp[game_rock_paper_pvp[initiator].oponent].name;
                        }

                    }
                    let send_to_main_chat = game_rock_paper_pvp[initiator].initiator_chat; // this is needed cause in the last round this is gone lol
                    let initial_message = game_rock_paper_pvp[initiator].initial_message;

                    game_rock_paper_pvp[initiator].choice_last_round = formatted_optionsdc[player_choice];
                    game_rock_paper_pvp[initiator].choice_last_round_oponent = formatted_optionsdc[computer_choice];

                    if(game_rock_paper_pvp[initiator].playing){
                        game_rock_paper_pvp[initiator].current_round = game_rock_paper_pvp[initiator].current_round + 1;
                        //reset some options
                        game_rock_paper_pvp[initiator].made_choice = false;
                        game_rock_paper_pvp[initiator].oponent_made_choice = false;
                        game_rock_paper_pvp[initiator].current_choice = undefined;
                        game_rock_paper_pvp[game_rock_paper_pvp[initiator].oponent].current_choice = undefined;
                        game_rock_paper_pvp[initiator].last_update = output;

                    }

                    let payload = {
                        msg: msg,
                        initiator: initiator,
                        game_over: game_over,
                        init_message_id: initial_message,
                        init_chat_id: send_to_main_chat,
                        optional_text: output
                    };

                    update_message(payload);

                }else{
                    let payload = {
                        msg: msg,
                        initiator: initiator,
                        game_over: false,
                        init_message_id: game_rock_paper_pvp[initiator].initial_message,
                        init_chat_id: game_rock_paper_pvp[initiator].initiator_chat,
                        optional_text: undefined
                    };
                    update_message(payload);
                }
                bot.answerCallbackQuery(msg.id);


            }

        }else{
            bot.answerCallbackQuery(msg.id,{text: "Game ended",show_alert: false});
        }
    }
}

var process_message = (msg) => {
    if(msg.reply_to_message){
        if(msg.text.toLowerCase() === "play game rock"){
            start_game(msg);
        }
        return true;
    }
}


bot.on('callback_query', (callbackQuery) => {
    const action = callbackQuery.data;
    if(game_rock_paper_options.includes(action)){
        play_game(callbackQuery);
    }
});


bot.on('message', (msg) => {
    if(msg.text){
        process_message(msg);
    }
});


bot.on('polling_error', (error) => {
    if( error.code ){
        if(error.code !== 'EFATAL'){
            console.log("error code: ", error);
        }
    }else{
        console.log("error code: ", error);
    }
});