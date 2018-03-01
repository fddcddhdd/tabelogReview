$(function(){

    // 検索条件が、chromeアカウントと紐づくストレージに保存されていなかったら、デフォルト値を使う
    chrome.storage.sync.get({
      selected_timezone: 'lunch',
      selected_tab_num: 5
      
    // 保存された値があったら、それを使う
    }, function(items) {
      document.getElementById('timezone').value = items.selected_timezone;
      document.getElementById('tab_num').value = items.selected_tab_num;    
    });

    // 検索ボタンを押されたら
    $('#search_btn').click(function(){
        // ポップアップのプルダウンを値を、変数に格納  
        var timezone = document.getElementById('timezone').value;
        var tab_num = document.getElementById('tab_num').value;

        // chromeアカウントと紐づくストレージに保存
        chrome.storage.sync.set({
        selected_timezone: timezone,
        selected_tab_num: tab_num

        }, function () {            
          // アクティブなタブ情報を取得
          chrome.tabs.getSelected(null, function(tab) {
            
            // 食べログのURL構造は、以下のようになっているみたい
            // https://tabelog.com/都道府県名/大地域ID/小地域ID/店ID
            // 口コミ・メニュー・地図のURLでも、店舗トップのURLを取得
            var tabelog_url = tab.url.match(/^https:\/\/tabelog\.com\/[a-z]+\/[A-Z0-9]+\/[A-Z0-9]+\/[A-Z0-9]+\//);    
            if(tabelog_url == null){
                alert('食べログの店舗URLではありません！');
                exit();
            }       
          
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
              var review_list_url = tabelog_url + option;
              
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
      

    });    
});