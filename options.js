

// 設定画面で保存ボタンを押されたら
function save_options() {
    
  // 設定値を変数に格納  
  var timezone = document.getElementById('timezone').value;
  var tab_num = document.getElementById('tab_num').value;

  // chromeアカウントと紐づくストレージに保存
  chrome.storage.sync.set({
    selected_timezone: timezone,
    selected_tab_num: tab_num
    
  }, function() {
    
    // 保存できたら、画面にメッセージを表示(0.75秒だけ)
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// 設定画面で設定を表示する
function restore_options() {
  // デフォルト値は、ここで設定する
  chrome.storage.sync.get({
    selected_timezone: 'lunch',
    selected_tab_num: 5
    
  // 保存された値があったら、それを使う
  }, function(items) {
    document.getElementById('timezone').value = items.selected_timezone;
    document.getElementById('tab_num').value = items.selected_tab_num;    
  });
}

// 画面表示と保存ボタンのイベントを設定
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);


