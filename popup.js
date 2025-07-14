$(function () {
  // 初期設定を取得（ここはそのままでOK）
  chrome.storage.sync.get({
    selected_timezone: 'lunch',
    selected_tab_num: 5
  }, function (items) {
    $('#tab_num').val(items.selected_tab_num);
  });

  // ボタンをクリックしたときに実行（ここを修正）
  $('.search_btn').click(function () {
    const timezone = $(this).val(); // 押されたボタンの value
    const tab_num = parseInt($('#tab_num').val(), 10);

    chrome.storage.sync.set({
      selected_timezone: timezone,
      selected_tab_num: tab_num
    }, function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tab = tabs[0];
        const tabelog_url_match = tab.url.match(/^https:\/\/tabelog\.com\/[a-z]+\/[A-Z0-9]+\/[A-Z0-9]+\/[A-Z0-9]+\//);

        if (!tabelog_url_match) {
          alert('食べログの店舗URLではありません！');
          return;
        }

        const tabelog_url = tabelog_url_match[0];

        let option;
        switch (timezone) {
          case 'lunch':
            option = 'dtlrvwlst/COND-1/smp1/D-visit/?lc=0&rvw_part=all';
            break;
          case 'dinner':
            option = 'dtlrvwlst/COND-2/smp1/D-visit/?lc=0&rvw_part=all';
            break;
          case 'all':
          default:
            option = 'dtlrvwlst/COND-0/smp1/D-visit/?lc=0&rvw_part=all';
            break;
        }

        const review_list_url = tabelog_url + option;

        fetch(review_list_url)
          .then(response => response.text())
          .then(html => {
            const tempDom = document.createElement('html');
            tempDom.innerHTML = html;
            const anchors = tempDom.querySelectorAll('.rvw-item__title-target');
            let count = 0;

            for (const anchor of anchors) {
              const review_url = 'https://tabelog.com' + anchor.getAttribute('href');
              chrome.tabs.create({ url: review_url });
              count++;
              if (count >= tab_num) break;
            }
          });
      });
    });
  });
});
