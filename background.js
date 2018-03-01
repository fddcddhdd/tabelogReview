
// popup.jsに移植したのでコメントアウト
/*
// アドレスバーの隣のアイコンをクリックされたら
chrome.browserAction.onClicked.addListener(function(command) {
  // アクティブなタブ情報を取得
  chrome.tabs.getSelected(null, function(tab) {
     // ストレージから設定値を取得(無かったら初期値)
    chrome.storage.sync.get(null, function(items) {       
      var selected_timezone = (items.selected_timezone === undefined) ? "lunch" : items.selected_timezone;  
      var selected_tab_num =  (items.selected_tab_num  === undefined) ? 5       : items.selected_tab_num;

      // レビューページ(新着順)のURLを生成
      //昼間 or 夜 or 全て
      switch(selected_timezone){
        case "lunch"  : option = "dtlrvwlst/COND-1/smp1/D-visit/?lc=0&rvw_part=all"; break;
        case "dinner" : option = "dtlrvwlst/COND-2/smp1/D-visit/?lc=0&rvw_part=all"; break;
        case "all"    : option = "dtlrvwlst/COND-0/smp1/D-visit/?lc=0&rvw_part=all"; break;
        default       : option = "dtlrvwlst/COND-0/smp1/D-visit/?lc=0&rvw_part=all"; break;
      }   
      var review_list_url = tab.url + option;
      
      // 非同期でレビューページのソースを取得
      $.ajax({
         type: "get",
         url: review_list_url,
         success: function(data){ 
           review_num = 0;                 
           // 各レビューへのURLを取得して、別タブで開く(rvw-item__title-targetがレビューのclass名っぽい)
           $(data).find('.rvw-item__title-target').each(function(){             
              var review_url = 'https://tabelog.com' + $(this).attr('href');                
              chrome.tabs.create({url: review_url });
              
              // 別タブで開くレビュー数のMAX(1ページ辺り20件が表示される)
              if(++review_num >= selected_tab_num){
                  exit;
              }                
           });                  
         }
      }); 
        
    });        
  });    
});
*/