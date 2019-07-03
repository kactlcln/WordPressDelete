//CHANNEL_ACCESS_TOKENを設定
var CHANNEL_ACCESS_TOKEN = 'アクセストークン';
var line_endpoint = 'https://api.line.me/v2/bot/message/reply';
function doPost(e) {
    var json = JSON.parse(e.postData.contents);
    
    //返信するためのトークン取得
    var reply_token= json.events[0].replyToken;
    if (typeof reply_token === 'undefined') {
        return;
    }
    
    //送られたLINEメッセージを取得
    var user_message = json.events[0].message.text;
    
    //返信する内容を作成
    var reply_messages;
    
    // sheetを特定するまでの決まりパターンでsheetを特定
    //'bot'はスプレッドシートのシート名
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('bot');
    
    // シート内のすべてのデータを取得する
    var data = sheet.getDataRange().getValues();
    
    // キーワードが合っていれば対応するデータをreply_messagesに格納
    for (var i = 1; i &lt; data.length; i++) {
        
        if (data[i][0] == user_message) {
            reply_messages = [ '「' + user_message + '」はこちら\n'+ '「' + data[i][1] + '」' ,];
            break;
        } else {
            // キーワードが合っていなければ以下をreply_messagesに格納
            reply_messages = ['「キーワード」を入力してみて！'];
        }
    }
    // 「キーワード」と入力された場合、スプレッドシートのA列を全てreply_messagesに格納
    if('キーワード'==user_message){
        var language;
        for (var i = 1; i &lt; data.length; i++) {
            if(language==undefined){
                language='「'+data[i][0]+'」';
            }else{
                language+='\n'+'「'+data[i][0]+'」';//'「'+language+'」\n';//+'「'+data[i][0]+'」';
            }
        }
        reply_messages = [language];//['「キーワード」が入ったよ！'];
    }
    
    // メッセージを返信
    var messages = reply_messages.map(function (v) {
        return {'type': 'text', 'text': v};
    });
    UrlFetchApp.fetch(line_endpoint, {
        'headers': {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
        },
        'method': 'post',
        'payload': JSON.stringify({
            'replyToken': reply_token,
            'messages': messages,
        }),
    });
    return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}
