# aaaa

# サーバーの準備

このキャッシュシステムを使用するには、サーバー上にサービスが必要になります

- Redis v4 以上
- Nginx

## Redis の準備

RHEL8 系のOSの場合は次のコマンドを実行してください

```bash
# redis v6 を指定して、インストール
dnf module enable redis:6
dnf install -y redis

# サービスを起動
systemctl enable redis
systemcll start redis

```

## NGINX の準備

NGINXには最低限、次のモジュールが必要になります。
(*) のものは サードパーティモジュールで、公式には配信されていません。

- ndx_http_module
- ngx_js_module
- ngx_http_srcache_filter (*)
- ngx_http_set_misc (*)
- ngx_http_lua (*)

これらのモジュールを使用するには、別途モジュールをビルドするか、ビルド済みのレポジトリを使用する必要があります。

ビルド済みのレポジトリを使用するには [こちら](https://github.com/ueno-bst/nginx-mainline) を参考にしてください。

レポジトリを導入したら、パッケージをインストールします。

```bash
dnf install -y \
  nginx \
  nginx-module-ndk \
  nginx-module-njs \
  nginx-module-lua \
  nginx-module-set-misc \
  nginx-module-srcache
```

nginx.conf を編集して、モジュールを読み込ませます

```nginx
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;

# ここから追加
load_module modules/ndk_http_module.so;
load_module modules/ngx_http_brotli_filter_module.so;
load_module modules/ngx_http_brotli_static_module.so;
load_module modules/ngx_http_js_module-debug.so;
load_module modules/ngx_http_srcache_filter_module.so;
load_module modules/ngx_http_set_misc_module.so;
load_module modules/ngx_http_lua_module.so;
# ここまで追加
```

NGINXを起動して、正常に動作するか確認してください。

```bash
systemctl enable nginx
systemctl start nginx
```

