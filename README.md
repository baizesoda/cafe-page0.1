# 咖啡瘾史长卷

《全球上瘾：咖啡如何搅动人类历史》的个人阅读长卷：一条时间线 + 一张传播地图。
视觉规范见项目根目录的 `design-spec.md`（复古精密档案风）。

## 本地开发

```bash
npm install
npm run dev        # http://localhost:3000
```

内容全部来自 `content/` 里的 JSON，构建期读入，没有 API 路由也没有运行时取数。
`content/map.json` 里的陆地路径和港口像素坐标由 `../tools/build-map.mjs` 预投影好，
客户端不需要 d3-geo。

## 构建

```bash
npm run build      # 产物在 out/，纯静态，约 30 个文件 1.2MB
```

`next.config.ts` 里开了 `output: "export"`，所以服务器上只要一个能发静态文件的
Web Server，不需要常驻 Node 进程。

## 部署到一台 Linux 服务器（Nginx）

**先在云控制台开放端口**：安全组入方向加一条 TCP `80`、授权对象 `0.0.0.0/0`。
这一步 SSH 进去也改不了，不开则一定访问不了。阿里云中国大陆地域的 80 端口有备案
要求，如果排除安全组后仍打不开，把端口换成 `8080`（安全组和 Nginx 一起改）。

**服务器上装 Nginx 并建目录**：

```bash
sudo apt update && sudo apt install -y nginx apache2-utils   # Ubuntu / Debian
# sudo yum install -y nginx httpd-tools                      # Alibaba Cloud Linux / CentOS
sudo systemctl enable --now nginx
sudo mkdir -p /var/www/coffee
```

**设一个访问口令**（交互式输入，密码不会进 shell 历史）：

```bash
sudo htpasswd -c /etc/nginx/.htpasswd coffee
sudo chmod 640 /etc/nginx/.htpasswd
sudo chown root:www-data /etc/nginx/.htpasswd   # CentOS 系用 root:nginx
```

**本地推产物上去**：

```bash
npm run build
rsync -avz --delete out/ root@<公网IP>:/var/www/coffee/
```

`--delete` 会清掉该目录下不属于本次产物的文件，第一次执行前确认目录是空的。

**写 Nginx 配置**：

```nginx
# /etc/nginx/conf.d/coffee.conf
server {
    listen 80 default_server;
    server_name _;
    root /var/www/coffee;
    index index.html;

    auth_basic "coffee";
    auth_basic_user_file /etc/nginx/.htpasswd;

    location / {
        try_files $uri $uri/ =404;
    }

    # 文件名带内容哈希，可以长缓存
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/css application/javascript image/svg+xml;
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

**Basic Auth 的边界**：它挡住的是顺手点进来的人和爬虫。凭据是 base64 编码而非加密，
在纯 HTTP 上等同明文传输，同网络里能抓包的人可以还原出口令。要真正保密就得配 HTTPS
（需要域名 + 证书）。
