# サーバー側ディープリンク実装ガイド

## 問題
HTTPS URLをクリックすると、Webブラウザが開いて「unauthorized」と表示される。
アプリ（Expo Go）が起動しない。

## 解決策
サーバー側で `/community/${id}/join` エンドポイントを修正し、
ディープリンクを起動するHTMLページを返すようにする。

## Cloudflare Workers 実装例

```javascript
// pocke-autumn-back.pocke-cojt.workers.dev

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // コミュニティ招待リンクのパスをチェック
    const communityJoinMatch = url.pathname.match(/\/community\/([^\/]+)\/join$/);
    
    if (communityJoinMatch) {
      const communityId = communityJoinMatch[1];
      const deepLink = `pocke://community/${communityId}/join`;
      
      // ディープリンクを起動するHTMLページを返す
      return new Response(`
        <!DOCTYPE html>
        <html lang="ja">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>コミュニティに参加</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-align: center;
            }
            .container {
              max-width: 400px;
              background: rgba(255, 255, 255, 0.1);
              padding: 40px;
              border-radius: 20px;
              backdrop-filter: blur(10px);
            }
            h1 {
              font-size: 24px;
              margin-bottom: 20px;
            }
            p {
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 30px;
            }
            .btn {
              display: inline-block;
              background: white;
              color: #667eea;
              padding: 15px 30px;
              border-radius: 30px;
              text-decoration: none;
              font-weight: bold;
              font-size: 16px;
              transition: transform 0.2s;
            }
            .btn:hover {
              transform: scale(1.05);
            }
            #status {
              margin-top: 20px;
              font-size: 14px;
              opacity: 0.8;
            }
          </style>
          <script>
            // ページ読み込み時に自動的にディープリンクを試行
            window.addEventListener('load', function() {
              // アプリを開く
              window.location.href = '${deepLink}';
              
              // 2秒後にメッセージを表示
              setTimeout(function() {
                document.getElementById('status').textContent = 
                  'アプリが開かない場合は、下のボタンをタップしてください';
              }, 2000);
            });
          </script>
        </head>
        <body>
          <div class="container">
            <h1>🎉 コミュニティへようこそ</h1>
            <p>Pockeアプリで開いています...</p>
            <a href="${deepLink}" class="btn">アプリで開く</a>
            <p id="status"></p>
          </div>
        </body>
        </html>
      `, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }
    
    // 他のエンドポイントの処理...
    // 既存のAPIロジックをここに記述
    
    return new Response('Not Found', { status: 404 });
  },
};
```

## 実装のポイント

1. **自動リダイレクト**: ページ読み込み時に自動的に `pocke://` スキームを起動
2. **フォールバック**: 自動起動が失敗した場合のための手動ボタン
3. **ユーザー体験**: 美しいUIでユーザーにアプリが開くことを通知

## 開発環境での確認方法

1. サーバー側の変更をデプロイ
2. スマートフォンで `https://pocke-autumn-back.pocke-cojt.workers.dev/community/xxx/join` にアクセス
3. 自動的にExpo Goアプリが開き、JoinCommunityScreenに遷移することを確認

## 本番環境での考慮事項

本番環境（Expo Goではなく、スタンドアロンアプリ）では、
Universal Linksを適切に設定することで、ブラウザを経由せずに
直接アプリが開くようにできます。

そのためには:
1. サーバーに `.well-known/apple-app-site-association` ファイルを配置（iOS）
2. サーバーに `.well-known/assetlinks.json` ファイルを配置（Android）
3. app.json に `associatedDomains` と `intentFilters` を設定

しかし、Expo Go環境では上記の方法が最適です。
