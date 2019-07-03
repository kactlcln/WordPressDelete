// ユーザー名
var user_name = 'ユーザー名';

// APIキーとトークン
var api_key = 'APIキー';
var api_token = 'APIトークン';

// ボードID
var board_id = 'ボードID';

// リストID
var list_id = 'リストID';

// カード名の列番号
var title_column_no = 2;
// カード詳細説明の列番号
var description_column_no = 3;

function getBoards() {
    var url = 'https://api.trello.com/1/members/' + user_name + '/boards?key=' + api_key + '&amp;token=' + api_token + '&amp;fields=name';
    Logger.log(UrlFetchApp.fetch(url, {'method':'get'}));
}

function getlists() {
    var url = "https://trello.com/1/boards/" + board_id + "/lists?key=" + api_key + "&amp;token=" + api_token + "&amp;fields=name";
    Logger.log(UrlFetchApp.fetch(url, {'method':'get'}));
}

function getLabels() {
    var url = "https://trello.com/1/boards/" + board_id + "/labels?key=" + api_key + "&amp;token=" + api_token + "&amp;fields=name";
    Logger.log(UrlFetchApp.fetch(url, {'method':'get'}));
}

function addTrelloCard() {
    
    // 選択しているセルの開始行番号を取得
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    var upper_left_cell = sheet.getActiveCell();
    var start_row = upper_left_cell.getRow();
    
    // 選択しているセルの行数を取得
    var range = SpreadsheetApp.getActiveRange();
    var rows = range.getNumRows();
    
    // カード作成
    for (var i = 0; i &lt; rows; i++) {
        var row = start_row + i;
        var card_title = sheet.getRange(row, title_column_no).getValue();
        var card_description = sheet.getRange(row, description_column_no).getValue();
        var url = 'https://api.trello.com/1/cards/?key=' + api_key + '&amp;token=' + api_token;
        var options = {
            'method' : 'post',
            'muteHttpExceptions' : true,
            'payload' : {
                'name'      : card_title,
                'desc'      : card_description,
                'due'       : '',
                'idList'    : list_id,
                // 'idLabels'  : 'ラベルを使用したい場合はgetLabelsを実行してよしなに',
                'urlSource' : ''
            }
        }
        var response = UrlFetchApp.fetch(url, options);
        // 作成したカードのURLをセルに出力したい場合は下記コメントアウトはずしてよしなに。
        // var response_data = JSON.parse(response.getContentText());
        // sheet.getRange(row, 3).setValue(response_data['shortUrl']);
    }
}
